// Contract ABIs and addresses
export const TRUSTPAY_ESCROW_ABI = [
  // Events
  "event DealCreated(uint256 indexed dealId, address indexed client, address indexed freelancer, uint256 totalAmount)",
  "event DealFunded(uint256 indexed dealId, uint256 amount)",
  "event MilestoneSubmitted(uint256 indexed dealId, uint256 indexed milestoneIndex)",
  "event MilestoneApproved(uint256 indexed dealId, uint256 indexed milestoneIndex, uint256 amount)",
  "event MilestoneRejected(uint256 indexed dealId, uint256 indexed milestoneIndex, string reason)",
  "event DisputeOpened(uint256 indexed dealId, uint256 indexed milestoneIndex, address indexed openedBy)",
  "event DisputeResolved(uint256 indexed dealId, uint256 indexed milestoneIndex, address winner, uint256 freelancerAmount, uint256 clientAmount)",
  "event DealCompleted(uint256 indexed dealId)",
  "event DealCancelled(uint256 indexed dealId)",
  
  // Read Functions
  "function getDeal(uint256 dealId) external view returns (tuple(uint256 id, address client, address freelancer, address mediator, address token, string title, string description, uint256 totalAmount, uint256 fundedAmount, uint256 releasedAmount, uint8 status, uint256 createdAt, uint256 completedAt, uint256 milestoneCount))",
  "function getMilestone(uint256 dealId, uint256 milestoneIndex) external view returns (tuple(string title, uint256 amount, uint256 deadline, uint8 status, uint256 submittedAt, uint256 completedAt, string rejectionReason))",
  "function getMilestones(uint256 dealId) external view returns (tuple(string title, uint256 amount, uint256 deadline, uint8 status, uint256 submittedAt, uint256 completedAt, string rejectionReason)[])",
  "function getDealCount() external view returns (uint256)",
  "function getUserDeals(address user) external view returns (uint256[])",
  "function supportedTokens(address) external view returns (bool)",
  "function platformFee() external view returns (uint256)",
  
  // Write Functions
  "function createDeal(address freelancer, address mediator, address token, string memory title, string memory description, string[] memory milesttoneTitles, uint256[] memory milestoneAmounts, uint256[] memory milestoneDeadlines) external returns (uint256)",
  "function fundDeal(uint256 dealId) external",
  "function submitMilestone(uint256 dealId, uint256 milestoneIndex) external",
  "function approveMilestone(uint256 dealId, uint256 milestoneIndex) external",
  "function rejectMilestone(uint256 dealId, uint256 milestoneIndex, string memory reason) external",
  "function openDispute(uint256 dealId, uint256 milestoneIndex) external",
  "function resolveDispute(uint256 dealId, uint256 milestoneIndex, address winner, uint256 freelancerPercentage) external",
  "function cancelDeal(uint256 dealId) external",
  "function cancelFundedDeal(uint256 dealId) external"
] as const;

// ERC20 ABI for token interactions
export const ERC20_ABI = [
  "function name() external view returns (string)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)"
] as const;

// Contract addresses per network
export const CONTRACT_ADDRESSES = {
  // Mainnet
  polygon: {
    escrow: "0x0000000000000000000000000000000000000000", // Deploy address
    usdc: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    usdt: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
  },
  arbitrum: {
    escrow: "0x0000000000000000000000000000000000000000",
    usdc: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    usdt: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"
  },
  base: {
    escrow: "0x0000000000000000000000000000000000000000",
    usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    usdt: "0x0000000000000000000000000000000000000000" // Not available on Base yet
  },
  
  // Testnets
  polygonMumbai: {
    escrow: "0x0000000000000000000000000000000000000000",
    usdc: "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23",
    usdt: "0x0000000000000000000000000000000000000000"
  },
  baseSepolia: {
    escrow: "0x0000000000000000000000000000000000000000",
    usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    usdt: "0x0000000000000000000000000000000000000000"
  },
  // ============================================
  // LISK NETWORKS (PRIMARY TARGET FOR HACKATHON)
  // ============================================
  liskSepolia: {
    escrow: "0x0000000000000000000000000000000000000000", // UPDATE AFTER DEPLOYMENT
    usdc: "0x0000000000000000000000000000000000000000",   // Mock USDC - deployed with escrow
    usdt: "0x0000000000000000000000000000000000000000"    // Mock USDT - deployed with escrow
  },
  lisk: {
    escrow: "0x0000000000000000000000000000000000000000",
    usdc: "0x0000000000000000000000000000000000000000",
    usdt: "0x0000000000000000000000000000000000000000"
  },
  
  // Local Development
  hardhat: {
    escrow: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    usdc: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    usdt: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
  }
} as const;

export type SupportedNetwork = keyof typeof CONTRACT_ADDRESSES;

// Supported tokens info with user-friendly display
export const SUPPORTED_TOKENS = {
  usdc: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    icon: "💵",
    color: "#2775CA",
    displayName: "USD Coin",
    description: "Digital dollar - most stable"
  },
  usdt: {
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    icon: "💵",
    color: "#26A17B",
    displayName: "Tether",
    description: "Popular stablecoin"
  }
} as const;

export type SupportedToken = keyof typeof SUPPORTED_TOKENS;

// ============================================================
// DEAL & MILESTONE STATUS ENUMS (MATCHING CONTRACT)
// ============================================================
export enum DealStatusContract {
  Created = 0,
  Funded = 1,
  InProgress = 2,
  Completed = 3,
  Disputed = 4,
  Cancelled = 5,
}

export enum MilestoneStatusContract {
  Pending = 0,
  Active = 1,
  Submitted = 2,
  Approved = 3,
  Rejected = 4,
  Disputed = 5,
}

// Map contract status to UI-friendly status
export const DEAL_STATUS_MAP: Record<number, string> = {
  0: 'pending',
  1: 'funded',
  2: 'in_progress',
  3: 'completed',
  4: 'disputed',
  5: 'cancelled',
};

export const MILESTONE_STATUS_MAP: Record<number, string> = {
  0: 'pending',
  1: 'active',
  2: 'submitted',
  3: 'approved',
  4: 'rejected',
  5: 'disputed',
};

// ============================================================
// PLATFORM CONFIGURATION
// ============================================================
export const PLATFORM_CONFIG = {
  FEE_DENOMINATOR: 10000,
  DEFAULT_PLATFORM_FEE: 200, // 2%
  MAX_FEE: 500, // 5%
  DISPUTE_WINDOW_DAYS: 7,
  MIN_MILESTONE_AMOUNT: 1,
  MAX_MILESTONES_PER_DEAL: 10,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 2000,
  
  EXPLORER_URLS: {
    4202: 'https://sepolia-blockscout.lisk.com',
    1135: 'https://blockscout.lisk.com',
    137: 'https://polygonscan.com',
    42161: 'https://arbiscan.io',
    8453: 'https://basescan.org',
    80001: 'https://mumbai.polygonscan.com',
    84532: 'https://sepolia.basescan.org',
    31337: '#',
  } as Record<number, string>,
};

export function getExplorerUrl(chainId: number, txHash: string): string {
  const baseUrl = PLATFORM_CONFIG.EXPLORER_URLS[chainId] || '';
  return baseUrl ? `${baseUrl}/tx/${txHash}` : '#';
}

export function getAddressExplorerUrl(chainId: number, address: string): string {
  const baseUrl = PLATFORM_CONFIG.EXPLORER_URLS[chainId] || '';
  return baseUrl ? `${baseUrl}/address/${address}` : '#';
}
