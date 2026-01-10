// Complete ABI for TrustPayEscrow Contract
// Auto-generated from contracts/TrustPayEscrow.sol

export const TRUSTPAY_ESCROW_ABI = [
  // ============ EVENTS ============
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "dealId", type: "uint256" },
      { indexed: true, internalType: "address", name: "client", type: "address" },
      { indexed: true, internalType: "address", name: "freelancer", type: "address" },
      { indexed: false, internalType: "address", name: "paymentToken", type: "address" },
      { indexed: false, internalType: "uint256", name: "totalAmount", type: "uint256" }
    ],
    name: "DealCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "dealId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "DealFunded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "dealId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "milestoneIndex", type: "uint256" }
    ],
    name: "MilestoneSubmitted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "dealId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "milestoneIndex", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "MilestoneApproved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "dealId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "milestoneIndex", type: "uint256" },
      { indexed: false, internalType: "string", name: "reason", type: "string" }
    ],
    name: "MilestoneRejected",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "dealId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "milestoneIndex", type: "uint256" },
      { indexed: false, internalType: "address", name: "initiator", type: "address" }
    ],
    name: "DisputeOpened",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "dealId", type: "uint256" },
      { indexed: false, internalType: "address", name: "winner", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "DisputeResolved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "dealId", type: "uint256" }
    ],
    name: "DealCancelled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "dealId", type: "uint256" }
    ],
    name: "DealCompleted",
    type: "event"
  },

  // ============ READ FUNCTIONS ============
  {
    inputs: [{ internalType: "uint256", name: "_dealId", type: "uint256" }],
    name: "getDeal",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "client", type: "address" },
          { internalType: "address", name: "freelancer", type: "address" },
          { internalType: "address", name: "mediator", type: "address" },
          { internalType: "address", name: "paymentToken", type: "address" },
          { internalType: "uint256", name: "totalAmount", type: "uint256" },
          { internalType: "uint256", name: "releasedAmount", type: "uint256" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "uint256", name: "fundedAt", type: "uint256" },
          { internalType: "uint8", name: "status", type: "uint8" },
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "description", type: "string" }
        ],
        internalType: "struct TrustPayEscrow.Deal",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_dealId", type: "uint256" }],
    name: "getMilestones",
    outputs: [
      {
        components: [
          { internalType: "string", name: "title", type: "string" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
          { internalType: "uint8", name: "status", type: "uint8" },
          { internalType: "bool", name: "fundsReleased", type: "bool" }
        ],
        internalType: "struct TrustPayEscrow.Milestone[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_dealId", type: "uint256" },
      { internalType: "uint256", name: "_index", type: "uint256" }
    ],
    name: "getMilestone",
    outputs: [
      {
        components: [
          { internalType: "string", name: "title", type: "string" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
          { internalType: "uint8", name: "status", type: "uint8" },
          { internalType: "bool", name: "fundsReleased", type: "bool" }
        ],
        internalType: "struct TrustPayEscrow.Milestone",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_dealId", type: "uint256" }],
    name: "getMilestoneCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_dealId", type: "uint256" }],
    name: "getRemainingBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "dealCounter",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "platformFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "supportedTokens",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },

  // ============ WRITE FUNCTIONS ============
  {
    inputs: [
      { internalType: "address", name: "_freelancer", type: "address" },
      { internalType: "address", name: "_mediator", type: "address" },
      { internalType: "address", name: "_paymentToken", type: "address" },
      { internalType: "string", name: "_title", type: "string" },
      { internalType: "string", name: "_description", type: "string" },
      { internalType: "string[]", name: "_milestoneTitles", type: "string[]" },
      { internalType: "uint256[]", name: "_milestoneAmounts", type: "uint256[]" },
      { internalType: "uint256[]", name: "_milestoneDeadlines", type: "uint256[]" }
    ],
    name: "createDeal",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_dealId", type: "uint256" }],
    name: "fundDeal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_dealId", type: "uint256" },
      { internalType: "uint256", name: "_milestoneIndex", type: "uint256" }
    ],
    name: "submitMilestone",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_dealId", type: "uint256" },
      { internalType: "uint256", name: "_milestoneIndex", type: "uint256" }
    ],
    name: "approveMilestone",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_dealId", type: "uint256" },
      { internalType: "uint256", name: "_milestoneIndex", type: "uint256" },
      { internalType: "string", name: "_reason", type: "string" }
    ],
    name: "rejectMilestone",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_dealId", type: "uint256" },
      { internalType: "uint256", name: "_milestoneIndex", type: "uint256" }
    ],
    name: "openDispute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_dealId", type: "uint256" },
      { internalType: "uint256", name: "_milestoneIndex", type: "uint256" },
      { internalType: "address", name: "_winner", type: "address" },
      { internalType: "uint256", name: "_freelancerShare", type: "uint256" }
    ],
    name: "resolveDispute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_dealId", type: "uint256" }],
    name: "cancelDeal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_dealId", type: "uint256" }],
    name: "cancelFundedDeal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  // ============ ADMIN FUNCTIONS ============
  {
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "bool", name: "_supported", type: "bool" }
    ],
    name: "setSupportedToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_fee", type: "uint256" }],
    name: "setPlatformFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;

export const ERC20_ABI = [
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: true, internalType: "address", name: "spender", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" }
    ],
    name: "Transfer",
    type: "event"
  }
] as const;

// Deal Status Enum mapping
export const DealStatus = {
  Created: 0,
  Funded: 1,
  InProgress: 2,
  Completed: 3,
  Disputed: 4,
  Cancelled: 5
} as const;

// Milestone Status Enum mapping
export const MilestoneStatus = {
  Pending: 0,
  Active: 1,
  Submitted: 2,
  Approved: 3,
  Rejected: 4,
  Disputed: 5
} as const;

export type DealStatusType = typeof DealStatus[keyof typeof DealStatus];
export type MilestoneStatusType = typeof MilestoneStatus[keyof typeof MilestoneStatus];
