// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TrustPayEscrow
 * @author TrustPay SEA Team
 * @notice Milestone-based escrow contract for freelance payments
 * 
 * CRITICAL DESIGN PRINCIPLES:
 * 1. AI NEVER controls funds or makes final decisions
 * 2. All fund releases require HUMAN action (client approval)
 * 3. Smart contract is the neutral escrow holder
 * 4. Supports stablecoins (USDC, USDT) for SEA market
 * 5. Dispute resolution requires human mediator decision
 */
contract TrustPayEscrow is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    // ============ CONSTANTS ============
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public constant MAX_FEE = 500; // 5% max fee
    uint256 public constant DISPUTE_WINDOW = 7 days;
    
    // ============ STATE ============
    uint256 public platformFee = 200; // 2% default fee
    address public feeRecipient;
    uint256 public dealCounter;

    // Supported payment tokens (stablecoins)
    mapping(address => bool) public supportedTokens;

    // ============ ENUMS ============
    enum DealStatus {
        Created,      // Deal created, awaiting funding
        Funded,       // Client has funded the escrow
        InProgress,   // Work has started
        Completed,    // All milestones completed
        Disputed,     // Under dispute
        Cancelled     // Deal cancelled
    }

    enum MilestoneStatus {
        Pending,      // Not started
        Active,       // Work in progress
        Submitted,    // Freelancer submitted work
        Approved,     // Client approved, funds released
        Rejected,     // Client rejected, needs revision
        Disputed      // Under dispute
    }

    // ============ STRUCTS ============
    struct Milestone {
        string title;
        uint256 amount;
        uint256 deadline;
        MilestoneStatus status;
        bool fundsReleased;
    }

    struct Deal {
        uint256 id;
        address client;
        address freelancer;
        address mediator;        // Optional dispute resolver
        address paymentToken;    // USDC, USDT, etc.
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 createdAt;
        uint256 fundedAt;
        DealStatus status;
        string title;
        string description;
    }

    // ============ STORAGE ============
    mapping(uint256 => Deal) public deals;
    mapping(uint256 => Milestone[]) public dealMilestones;
    mapping(uint256 => mapping(address => bool)) public hasRole; // dealId => address => isParty

    // ============ EVENTS ============
    event DealCreated(
        uint256 indexed dealId,
        address indexed client,
        address indexed freelancer,
        address paymentToken,
        uint256 totalAmount
    );
    event DealFunded(uint256 indexed dealId, uint256 amount);
    event MilestoneSubmitted(uint256 indexed dealId, uint256 milestoneIndex);
    event MilestoneApproved(uint256 indexed dealId, uint256 milestoneIndex, uint256 amount);
    event MilestoneRejected(uint256 indexed dealId, uint256 milestoneIndex, string reason);
    event DisputeOpened(uint256 indexed dealId, uint256 milestoneIndex, address initiator);
    event DisputeResolved(uint256 indexed dealId, address winner, uint256 amount);
    event DealCancelled(uint256 indexed dealId);
    event DealCompleted(uint256 indexed dealId);

    // ============ MODIFIERS ============
    modifier onlyDealParty(uint256 _dealId) {
        require(
            msg.sender == deals[_dealId].client || 
            msg.sender == deals[_dealId].freelancer,
            "Not a deal party"
        );
        _;
    }

    modifier onlyClient(uint256 _dealId) {
        require(msg.sender == deals[_dealId].client, "Not the client");
        _;
    }

    modifier onlyFreelancer(uint256 _dealId) {
        require(msg.sender == deals[_dealId].freelancer, "Not the freelancer");
        _;
    }

    modifier onlyMediator(uint256 _dealId) {
        require(msg.sender == deals[_dealId].mediator, "Not the mediator");
        _;
    }

    modifier dealExists(uint256 _dealId) {
        require(deals[_dealId].createdAt > 0, "Deal does not exist");
        _;
    }

    modifier inStatus(uint256 _dealId, DealStatus _status) {
        require(deals[_dealId].status == _status, "Invalid deal status");
        _;
    }

    // ============ CONSTRUCTOR ============
    constructor(address _feeRecipient) Ownable(msg.sender) {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        feeRecipient = _feeRecipient;
    }

    // ============ ADMIN FUNCTIONS ============
    
    function setSupportedToken(address _token, bool _supported) external onlyOwner {
        supportedTokens[_token] = _supported;
    }

    function setPlatformFee(uint256 _fee) external onlyOwner {
        require(_fee <= MAX_FEE, "Fee too high");
        platformFee = _fee;
    }

    function setFeeRecipient(address _recipient) external onlyOwner {
        require(_recipient != address(0), "Invalid address");
        feeRecipient = _recipient;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // ============ CORE FUNCTIONS ============

    /**
     * @notice Create a new escrow deal
     * @dev Anyone can create a deal (usually the client)
     */
    function createDeal(
        address _freelancer,
        address _mediator,
        address _paymentToken,
        string calldata _title,
        string calldata _description,
        string[] calldata _milestoneTitles,
        uint256[] calldata _milestoneAmounts,
        uint256[] calldata _milestoneDeadlines
    ) external whenNotPaused returns (uint256) {
        require(_freelancer != address(0), "Invalid freelancer");
        require(_freelancer != msg.sender, "Cannot be own freelancer");
        require(supportedTokens[_paymentToken], "Token not supported");
        require(_milestoneTitles.length > 0, "Need at least 1 milestone");
        require(
            _milestoneTitles.length == _milestoneAmounts.length &&
            _milestoneAmounts.length == _milestoneDeadlines.length,
            "Milestone arrays mismatch"
        );

        // Calculate total
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            require(_milestoneAmounts[i] > 0, "Milestone amount must be > 0");
            totalAmount += _milestoneAmounts[i];
        }

        // Create deal
        uint256 dealId = ++dealCounter;
        deals[dealId] = Deal({
            id: dealId,
            client: msg.sender,
            freelancer: _freelancer,
            mediator: _mediator,
            paymentToken: _paymentToken,
            totalAmount: totalAmount,
            releasedAmount: 0,
            createdAt: block.timestamp,
            fundedAt: 0,
            status: DealStatus.Created,
            title: _title,
            description: _description
        });

        // Create milestones
        for (uint256 i = 0; i < _milestoneTitles.length; i++) {
            dealMilestones[dealId].push(Milestone({
                title: _milestoneTitles[i],
                amount: _milestoneAmounts[i],
                deadline: _milestoneDeadlines[i],
                status: MilestoneStatus.Pending,
                fundsReleased: false
            }));
        }

        // Set roles
        hasRole[dealId][msg.sender] = true;
        hasRole[dealId][_freelancer] = true;
        if (_mediator != address(0)) {
            hasRole[dealId][_mediator] = true;
        }

        emit DealCreated(dealId, msg.sender, _freelancer, _paymentToken, totalAmount);
        return dealId;
    }

    /**
     * @notice Client funds the escrow
     * @dev Requires token approval first
     */
    function fundDeal(uint256 _dealId) 
        external 
        nonReentrant 
        whenNotPaused
        dealExists(_dealId)
        onlyClient(_dealId)
        inStatus(_dealId, DealStatus.Created)
    {
        Deal storage deal = deals[_dealId];
        
        // Calculate total with fee
        uint256 fee = (deal.totalAmount * platformFee) / FEE_DENOMINATOR;
        uint256 totalRequired = deal.totalAmount + fee;

        // Transfer funds to contract
        IERC20(deal.paymentToken).safeTransferFrom(msg.sender, address(this), totalRequired);
        
        // Transfer fee to platform
        if (fee > 0) {
            IERC20(deal.paymentToken).safeTransfer(feeRecipient, fee);
        }

        deal.status = DealStatus.Funded;
        deal.fundedAt = block.timestamp;

        // Activate first milestone
        if (dealMilestones[_dealId].length > 0) {
            dealMilestones[_dealId][0].status = MilestoneStatus.Active;
        }

        emit DealFunded(_dealId, deal.totalAmount);
    }

    /**
     * @notice Freelancer submits milestone for review
     */
    function submitMilestone(uint256 _dealId, uint256 _milestoneIndex)
        external
        whenNotPaused
        dealExists(_dealId)
        onlyFreelancer(_dealId)
    {
        Deal storage deal = deals[_dealId];
        require(
            deal.status == DealStatus.Funded || deal.status == DealStatus.InProgress,
            "Deal not active"
        );

        Milestone storage milestone = dealMilestones[_dealId][_milestoneIndex];
        require(
            milestone.status == MilestoneStatus.Active || 
            milestone.status == MilestoneStatus.Rejected,
            "Cannot submit this milestone"
        );

        milestone.status = MilestoneStatus.Submitted;
        deal.status = DealStatus.InProgress;

        emit MilestoneSubmitted(_dealId, _milestoneIndex);
    }

    /**
     * @notice Client approves milestone and releases payment
     * @dev THIS IS THE CRITICAL HUMAN-IN-THE-LOOP FUNCTION
     * @dev AI can recommend, but ONLY client can call this
     */
    function approveMilestone(uint256 _dealId, uint256 _milestoneIndex)
        external
        nonReentrant
        whenNotPaused
        dealExists(_dealId)
        onlyClient(_dealId)  // CRITICAL: Only human client can approve
    {
        Deal storage deal = deals[_dealId];
        require(deal.status == DealStatus.InProgress, "Deal not in progress");

        Milestone storage milestone = dealMilestones[_dealId][_milestoneIndex];
        require(milestone.status == MilestoneStatus.Submitted, "Milestone not submitted");
        require(!milestone.fundsReleased, "Funds already released");

        // Update milestone
        milestone.status = MilestoneStatus.Approved;
        milestone.fundsReleased = true;

        // Release funds to freelancer
        deal.releasedAmount += milestone.amount;
        IERC20(deal.paymentToken).safeTransfer(deal.freelancer, milestone.amount);

        // Activate next milestone or complete deal
        bool hasMore = false;
        for (uint256 i = _milestoneIndex + 1; i < dealMilestones[_dealId].length; i++) {
            if (dealMilestones[_dealId][i].status == MilestoneStatus.Pending) {
                dealMilestones[_dealId][i].status = MilestoneStatus.Active;
                hasMore = true;
                break;
            }
        }

        // Check if all milestones completed
        if (!hasMore && deal.releasedAmount >= deal.totalAmount) {
            deal.status = DealStatus.Completed;
            emit DealCompleted(_dealId);
        }

        emit MilestoneApproved(_dealId, _milestoneIndex, milestone.amount);
    }

    /**
     * @notice Client rejects milestone, requires revision
     */
    function rejectMilestone(uint256 _dealId, uint256 _milestoneIndex, string calldata _reason)
        external
        whenNotPaused
        dealExists(_dealId)
        onlyClient(_dealId)
    {
        Milestone storage milestone = dealMilestones[_dealId][_milestoneIndex];
        require(milestone.status == MilestoneStatus.Submitted, "Milestone not submitted");

        milestone.status = MilestoneStatus.Rejected;

        emit MilestoneRejected(_dealId, _milestoneIndex, _reason);
    }

    /**
     * @notice Open a dispute for a milestone
     */
    function openDispute(uint256 _dealId, uint256 _milestoneIndex)
        external
        whenNotPaused
        dealExists(_dealId)
        onlyDealParty(_dealId)
    {
        Deal storage deal = deals[_dealId];
        require(
            deal.status == DealStatus.InProgress || deal.status == DealStatus.Funded,
            "Cannot dispute this deal"
        );

        Milestone storage milestone = dealMilestones[_dealId][_milestoneIndex];
        require(
            milestone.status == MilestoneStatus.Submitted || 
            milestone.status == MilestoneStatus.Rejected,
            "Cannot dispute this milestone"
        );

        milestone.status = MilestoneStatus.Disputed;
        deal.status = DealStatus.Disputed;

        emit DisputeOpened(_dealId, _milestoneIndex, msg.sender);
    }

    /**
     * @notice Mediator resolves dispute
     * @dev Only human mediator can resolve, AI provides recommendations only
     */
    function resolveDispute(
        uint256 _dealId,
        uint256 _milestoneIndex,
        address _winner,
        uint256 _freelancerShare  // Percentage in basis points (0-10000)
    )
        external
        nonReentrant
        whenNotPaused
        dealExists(_dealId)
        onlyMediator(_dealId)
    {
        Deal storage deal = deals[_dealId];
        require(deal.status == DealStatus.Disputed, "No active dispute");
        require(_freelancerShare <= FEE_DENOMINATOR, "Invalid share");

        Milestone storage milestone = dealMilestones[_dealId][_milestoneIndex];
        require(milestone.status == MilestoneStatus.Disputed, "Milestone not disputed");
        require(!milestone.fundsReleased, "Funds already released");

        milestone.fundsReleased = true;

        // Calculate split
        uint256 freelancerAmount = (milestone.amount * _freelancerShare) / FEE_DENOMINATOR;
        uint256 clientAmount = milestone.amount - freelancerAmount;

        // Transfer funds
        if (freelancerAmount > 0) {
            deal.releasedAmount += freelancerAmount;
            IERC20(deal.paymentToken).safeTransfer(deal.freelancer, freelancerAmount);
        }
        if (clientAmount > 0) {
            IERC20(deal.paymentToken).safeTransfer(deal.client, clientAmount);
        }

        // Update status
        milestone.status = MilestoneStatus.Approved;
        deal.status = DealStatus.InProgress;

        // Check completion
        bool allDone = true;
        for (uint256 i = 0; i < dealMilestones[_dealId].length; i++) {
            if (!dealMilestones[_dealId][i].fundsReleased) {
                allDone = false;
                // Activate next pending
                if (dealMilestones[_dealId][i].status == MilestoneStatus.Pending) {
                    dealMilestones[_dealId][i].status = MilestoneStatus.Active;
                }
                break;
            }
        }

        if (allDone) {
            deal.status = DealStatus.Completed;
            emit DealCompleted(_dealId);
        }

        emit DisputeResolved(_dealId, _winner, milestone.amount);
    }

    /**
     * @notice Cancel deal before funding (by either party)
     */
    function cancelDeal(uint256 _dealId)
        external
        whenNotPaused
        dealExists(_dealId)
        onlyDealParty(_dealId)
        inStatus(_dealId, DealStatus.Created)
    {
        deals[_dealId].status = DealStatus.Cancelled;
        emit DealCancelled(_dealId);
    }

    /**
     * @notice Cancel funded deal (requires both parties or mediator)
     * @dev Returns funds to client
     */
    function cancelFundedDeal(uint256 _dealId)
        external
        nonReentrant
        whenNotPaused
        dealExists(_dealId)
    {
        Deal storage deal = deals[_dealId];
        require(
            deal.status == DealStatus.Funded && 
            dealMilestones[_dealId][0].status == MilestoneStatus.Active,
            "Cannot cancel at this stage"
        );
        require(
            msg.sender == deal.mediator || 
            (msg.sender == deal.client && deal.mediator == address(0)),
            "Not authorized"
        );

        // Refund remaining to client
        uint256 remaining = deal.totalAmount - deal.releasedAmount;
        if (remaining > 0) {
            IERC20(deal.paymentToken).safeTransfer(deal.client, remaining);
        }

        deal.status = DealStatus.Cancelled;
        emit DealCancelled(_dealId);
    }

    // ============ VIEW FUNCTIONS ============

    function getDeal(uint256 _dealId) external view returns (Deal memory) {
        return deals[_dealId];
    }

    function getMilestones(uint256 _dealId) external view returns (Milestone[] memory) {
        return dealMilestones[_dealId];
    }

    function getMilestone(uint256 _dealId, uint256 _index) external view returns (Milestone memory) {
        return dealMilestones[_dealId][_index];
    }

    function getMilestoneCount(uint256 _dealId) external view returns (uint256) {
        return dealMilestones[_dealId].length;
    }

    function getRemainingBalance(uint256 _dealId) external view returns (uint256) {
        Deal storage deal = deals[_dealId];
        return deal.totalAmount - deal.releasedAmount;
    }
}
