'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygon, polygonMumbai, arbitrum, base, baseSepolia, hardhat, type Chain } from 'wagmi/chains';

// ==================================================
// LISK SEPOLIA TESTNET - Primary deployment target
// ==================================================
export const liskSepolia: Chain = {
  id: 4202,
  name: 'Lisk Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia-api.lisk.com'],
    },
    public: {
      http: ['https://rpc.sepolia-api.lisk.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Lisk Sepolia Explorer',
      url: 'https://sepolia-blockscout.lisk.com',
    },
  },
  testnet: true,
};

// ==================================================
// LISK MAINNET - Production deployment
// ==================================================
export const lisk: Chain = {
  id: 1135,
  name: 'Lisk',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.api.lisk.com'],
    },
    public: {
      http: ['https://rpc.api.lisk.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Lisk Explorer',
      url: 'https://blockscout.lisk.com',
    },
  },
  testnet: false,
};

// Configure chains - Lisk Sepolia as primary for hackathon
export const config = getDefaultConfig({
  appName: 'TrustPay SEA',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains: [
    // Primary: Lisk Sepolia for hackathon deployment
    liskSepolia,
    
    // Mainnets - sorted by lowest fees for SEA market
    lisk,        // Lisk Mainnet (future production)
    polygon,     // Recommended for SEA (lowest fees, fast)
    base,        // Second choice (low fees, Coinbase backing)
    arbitrum,    // Third choice (fast, moderate fees)
    
    // Other Testnets for development
    ...(process.env.NODE_ENV === 'development' 
      ? [polygonMumbai, baseSepolia, hardhat] 
      : []
    )
  ],
  ssr: true, // Enable server-side rendering support
});

// Network display info for UX (avoid showing technical names)
export const NETWORK_INFO: Record<number, {
  name: string;
  displayName: string;
  icon: string;
  color: string;
  description: string;
  feeEstimate: string;
  isTestnet: boolean;
}> = {
  [liskSepolia.id]: {
    name: 'Lisk Sepolia',
    displayName: 'Test Network (Lisk)',
    icon: '🔷',
    color: '#0052FF',
    description: 'Hackathon Demo - Free testing',
    feeEstimate: 'Free (test tokens)',
    isTestnet: true
  },
  [lisk.id]: {
    name: 'Lisk',
    displayName: 'Lisk Network',
    icon: '🔷',
    color: '#0052FF',
    description: 'Production network',
    feeEstimate: '< $0.01',
    isTestnet: false
  },
  [polygon.id]: {
    name: 'Polygon',
    displayName: 'Main Network (Polygon)',
    icon: '🟣',
    color: '#8247E5',
    description: 'Recommended - Lowest fees',
    feeEstimate: '< $0.01',
    isTestnet: false
  },
  [base.id]: {
    name: 'Base',
    displayName: 'Base Network',
    icon: '🔵',
    color: '#0052FF',
    description: 'Low fees, Coinbase backed',
    feeEstimate: '< $0.05',
    isTestnet: false
  },
  [arbitrum.id]: {
    name: 'Arbitrum',
    displayName: 'Arbitrum Network',
    icon: '🔷',
    color: '#28A0F0',
    description: 'Fast transactions',
    feeEstimate: '< $0.10',
    isTestnet: false
  },
  [polygonMumbai.id]: {
    name: 'Polygon Mumbai',
    displayName: 'Test Network (Mumbai)',
    icon: '🧪',
    color: '#8247E5',
    description: 'For testing only',
    feeEstimate: 'Free (test tokens)',
    isTestnet: true
  },
  [baseSepolia.id]: {
    name: 'Base Sepolia',
    displayName: 'Test Network (Base)',
    icon: '🧪',
    color: '#0052FF',
    description: 'For testing only',
    feeEstimate: 'Free (test tokens)',
    isTestnet: true
  },
  [hardhat.id]: {
    name: 'Local',
    displayName: 'Local Development',
    icon: '🔨',
    color: '#FFC107',
    description: 'Local testing',
    feeEstimate: 'Free',
    isTestnet: true
  }
} as const;

// Get default chain based on environment
export const getDefaultChain = () => {
  if (process.env.NODE_ENV === 'production') {
    return liskSepolia; // Use testnet for hackathon demo
  }
  return liskSepolia; // Default to Lisk Sepolia
};

// Export chain utilities
export const SUPPORTED_CHAIN_IDS = [
  liskSepolia.id,
  lisk.id,
  polygon.id,
  base.id,
  arbitrum.id,
  ...(process.env.NODE_ENV === 'development' ? [polygonMumbai.id, baseSepolia.id, hardhat.id] : [])
];
