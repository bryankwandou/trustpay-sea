const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrustPayEscrow", function () {
  let TrustPayEscrow;
  let escrow;
  let mockToken;
  let owner;
  let client;
  let freelancer;
  let mediator;
  let feeRecipient;

  const DEAL_AMOUNT = ethers.parseUnits("1000", 6); // 1000 USDC
  const MILESTONE_1_AMOUNT = ethers.parseUnits("300", 6);
  const MILESTONE_2_AMOUNT = ethers.parseUnits("700", 6);

  beforeEach(async function () {
    [owner, client, freelancer, mediator, feeRecipient] = await ethers.getSigners();

    // Deploy mock USDC token
    const MockToken = await ethers.getContractFactory("MockERC20");
    mockToken = await MockToken.deploy("Mock USDC", "USDC", 6);
    await mockToken.waitForDeployment();

    // Mint tokens to client
    await mockToken.mint(client.address, ethers.parseUnits("10000", 6));

    // Deploy escrow contract
    TrustPayEscrow = await ethers.getContractFactory("TrustPayEscrow");
    escrow = await TrustPayEscrow.deploy(feeRecipient.address);
    await escrow.waitForDeployment();

    // Add supported token
    await escrow.setSupportedToken(await mockToken.getAddress(), true);
  });

  describe("Deal Creation", function () {
    it("Should create a deal with milestones", async function () {
      const tx = await escrow.connect(client).createDeal(
        freelancer.address,
        mediator.address,
        await mockToken.getAddress(),
        "Test Project",
        "Test Description",
        ["Milestone 1", "Milestone 2"],
        [MILESTONE_1_AMOUNT, MILESTONE_2_AMOUNT],
        [Math.floor(Date.now() / 1000) + 86400, Math.floor(Date.now() / 1000) + 172800]
      );

      await expect(tx).to.emit(escrow, "DealCreated");

      const deal = await escrow.getDeal(1);
      expect(deal.client).to.equal(client.address);
      expect(deal.freelancer).to.equal(freelancer.address);
      expect(deal.totalAmount).to.equal(DEAL_AMOUNT);
      expect(deal.status).to.equal(0); // Created
    });

    it("Should reject deal where client is freelancer", async function () {
      await expect(
        escrow.connect(client).createDeal(
          client.address, // Same as sender
          mediator.address,
          await mockToken.getAddress(),
          "Test",
          "Test",
          ["M1"],
          [DEAL_AMOUNT],
          [Math.floor(Date.now() / 1000) + 86400]
        )
      ).to.be.revertedWith("Cannot be own freelancer");
    });
  });

  describe("Deal Funding", function () {
    beforeEach(async function () {
      await escrow.connect(client).createDeal(
        freelancer.address,
        mediator.address,
        await mockToken.getAddress(),
        "Test Project",
        "Test Description",
        ["Milestone 1", "Milestone 2"],
        [MILESTONE_1_AMOUNT, MILESTONE_2_AMOUNT],
        [Math.floor(Date.now() / 1000) + 86400, Math.floor(Date.now() / 1000) + 172800]
      );
    });

    it("Should fund deal with correct amount + fee", async function () {
      const fee = (DEAL_AMOUNT * 200n) / 10000n; // 2%
      const totalRequired = DEAL_AMOUNT + fee;

      // Approve tokens
      await mockToken.connect(client).approve(await escrow.getAddress(), totalRequired);

      // Fund deal
      const tx = await escrow.connect(client).fundDeal(1);
      await expect(tx).to.emit(escrow, "DealFunded");

      const deal = await escrow.getDeal(1);
      expect(deal.status).to.equal(1); // Funded

      // Check fee was sent to recipient
      expect(await mockToken.balanceOf(feeRecipient.address)).to.equal(fee);
    });

    it("Should only allow client to fund", async function () {
      const fee = (DEAL_AMOUNT * 200n) / 10000n;
      const totalRequired = DEAL_AMOUNT + fee;
      await mockToken.connect(client).approve(await escrow.getAddress(), totalRequired);

      await expect(
        escrow.connect(freelancer).fundDeal(1)
      ).to.be.revertedWith("Not the client");
    });
  });

  describe("Milestone Flow", function () {
    beforeEach(async function () {
      // Create and fund deal
      await escrow.connect(client).createDeal(
        freelancer.address,
        mediator.address,
        await mockToken.getAddress(),
        "Test Project",
        "Test Description",
        ["Milestone 1", "Milestone 2"],
        [MILESTONE_1_AMOUNT, MILESTONE_2_AMOUNT],
        [Math.floor(Date.now() / 1000) + 86400, Math.floor(Date.now() / 1000) + 172800]
      );

      const fee = (DEAL_AMOUNT * 200n) / 10000n;
      await mockToken.connect(client).approve(await escrow.getAddress(), DEAL_AMOUNT + fee);
      await escrow.connect(client).fundDeal(1);
    });

    it("Should allow freelancer to submit milestone", async function () {
      const tx = await escrow.connect(freelancer).submitMilestone(1, 0);
      await expect(tx).to.emit(escrow, "MilestoneSubmitted");

      const milestone = await escrow.getMilestone(1, 0);
      expect(milestone.status).to.equal(2); // Submitted
    });

    it("CRITICAL: Should only allow CLIENT to approve (human-in-the-loop)", async function () {
      // Submit milestone
      await escrow.connect(freelancer).submitMilestone(1, 0);

      // Freelancer cannot approve
      await expect(
        escrow.connect(freelancer).approveMilestone(1, 0)
      ).to.be.revertedWith("Not the client");

      // Only client can approve
      const tx = await escrow.connect(client).approveMilestone(1, 0);
      await expect(tx).to.emit(escrow, "MilestoneApproved");

      // Check funds released to freelancer
      expect(await mockToken.balanceOf(freelancer.address)).to.equal(MILESTONE_1_AMOUNT);
    });

    it("Should allow client to reject milestone", async function () {
      await escrow.connect(freelancer).submitMilestone(1, 0);

      const tx = await escrow.connect(client).rejectMilestone(1, 0, "Needs revision");
      await expect(tx).to.emit(escrow, "MilestoneRejected");

      const milestone = await escrow.getMilestone(1, 0);
      expect(milestone.status).to.equal(4); // Rejected
    });
  });

  describe("Dispute Resolution", function () {
    beforeEach(async function () {
      // Create, fund, and submit milestone
      await escrow.connect(client).createDeal(
        freelancer.address,
        mediator.address,
        await mockToken.getAddress(),
        "Test Project",
        "Test Description",
        ["Milestone 1"],
        [DEAL_AMOUNT],
        [Math.floor(Date.now() / 1000) + 86400]
      );

      const fee = (DEAL_AMOUNT * 200n) / 10000n;
      await mockToken.connect(client).approve(await escrow.getAddress(), DEAL_AMOUNT + fee);
      await escrow.connect(client).fundDeal(1);
      await escrow.connect(freelancer).submitMilestone(1, 0);
    });

    it("Should allow either party to open dispute", async function () {
      const tx = await escrow.connect(client).openDispute(1, 0);
      await expect(tx).to.emit(escrow, "DisputeOpened");

      const deal = await escrow.getDeal(1);
      expect(deal.status).to.equal(4); // Disputed
    });

    it("CRITICAL: Should only allow MEDIATOR to resolve dispute (human decision)", async function () {
      await escrow.connect(client).openDispute(1, 0);

      // Client cannot resolve
      await expect(
        escrow.connect(client).resolveDispute(1, 0, freelancer.address, 5000)
      ).to.be.revertedWith("Not the mediator");

      // Freelancer cannot resolve
      await expect(
        escrow.connect(freelancer).resolveDispute(1, 0, freelancer.address, 5000)
      ).to.be.revertedWith("Not the mediator");

      // Only mediator can resolve (50/50 split)
      const tx = await escrow.connect(mediator).resolveDispute(1, 0, freelancer.address, 5000);
      await expect(tx).to.emit(escrow, "DisputeResolved");

      // Check split
      const halfAmount = DEAL_AMOUNT / 2n;
      expect(await mockToken.balanceOf(freelancer.address)).to.equal(halfAmount);
      expect(await mockToken.balanceOf(client.address)).to.be.gte(halfAmount);
    });
  });

  describe("Deal Completion", function () {
    it("Should complete deal when all milestones approved", async function () {
      await escrow.connect(client).createDeal(
        freelancer.address,
        ethers.ZeroAddress, // No mediator
        await mockToken.getAddress(),
        "Test",
        "Test",
        ["M1", "M2"],
        [MILESTONE_1_AMOUNT, MILESTONE_2_AMOUNT],
        [Math.floor(Date.now() / 1000) + 86400, Math.floor(Date.now() / 1000) + 172800]
      );

      const fee = (DEAL_AMOUNT * 200n) / 10000n;
      await mockToken.connect(client).approve(await escrow.getAddress(), DEAL_AMOUNT + fee);
      await escrow.connect(client).fundDeal(1);

      // Complete milestone 1
      await escrow.connect(freelancer).submitMilestone(1, 0);
      await escrow.connect(client).approveMilestone(1, 0);

      // Complete milestone 2
      await escrow.connect(freelancer).submitMilestone(1, 1);
      const tx = await escrow.connect(client).approveMilestone(1, 1);

      await expect(tx).to.emit(escrow, "DealCompleted");

      const deal = await escrow.getDeal(1);
      expect(deal.status).to.equal(3); // Completed
      expect(deal.releasedAmount).to.equal(DEAL_AMOUNT);
    });
  });
});
