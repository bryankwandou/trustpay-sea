'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, http } from 'wagmi'
import { mainnet, polygon, polygonMumbai, arbitrum, base, baseSepolia, hardhat, type Chain } from 'wagmi/chains'
import { RainbowKitProvider, getDefaultConfig, lightTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { ReactNode, useState } from 'react'

// Define Lisk Sepolia Testnet
const liskSepolia: Chain = {
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
}

// Define Lisk Mainnet
const liskMainnet: Chain = {
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
}

// Configure chains - focus on low-fee chains for SEA users
// Lisk Sepolia as PRIMARY for hackathon demo
const config = getDefaultConfig({
  appName: 'TrustPay SEA',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || 'trustpay-sea-demo',
  chains: [
    liskSepolia,   // PRIMARY - Hackathon target
    liskMainnet,   // Lisk Mainnet
    polygon,       // Secondary - lowest fees
    base,          // Tertiary - Coinbase backed
    arbitrum,      // Fast transactions
    mainnet,       // Fallback
    // Include testnets in development
    ...(process.env.NODE_ENV === 'development' 
      ? [polygonMumbai, baseSepolia, hardhat] as const
      : []
    )
  ],
  transports: {
    [liskSepolia.id]: http('https://rpc.sepolia-api.lisk.com'),
    [liskMainnet.id]: http('https://rpc.api.lisk.com'),
    [polygon.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [mainnet.id]: http(),
    [polygonMumbai.id]: http(),
    [baseSepolia.id]: http(),
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
  ssr: true,
})

// Export chain definitions for use elsewhere
export { liskSepolia, liskMainnet }

// Network display info for UX (avoid showing technical names)
export const NETWORK_INFO = {
  [liskSepolia.id]: {
    name: 'Lisk Sepolia',
    displayName: 'Lisk Testnet',
    icon: '🔷',
    color: '#0057FF',
    description: 'Hackathon Demo Network',
    feeEstimate: 'Free (testnet)'
  },
  [liskMainnet.id]: {
    name: 'Lisk',
    displayName: 'Lisk Network',
    icon: '💎',
    color: '#0057FF',
    description: 'Lisk L2 - Low fees',
    feeEstimate: '< $0.01'
  },
  [polygon.id]: {
    name: 'Polygon',
    displayName: 'Main Network (Polygon)',
    icon: '🟣',
    color: '#8247E5',
    description: 'Recommended - Lowest fees',
    feeEstimate: '< $0.01'
  },
  [base.id]: {
    name: 'Base',
    displayName: 'Base Network',
    icon: '🔵',
    color: '#0052FF',
    description: 'Low fees, Coinbase backed',
    feeEstimate: '< $0.05'
  },
  [arbitrum.id]: {
    name: 'Arbitrum',
    displayName: 'Arbitrum Network',
    icon: '🔷',
    color: '#28A0F0',
    description: 'Fast transactions',
    feeEstimate: '< $0.10'
  },
  [polygonMumbai.id]: {
    name: 'Polygon Mumbai',
    displayName: 'Test Network (Mumbai)',
    icon: '🧪',
    color: '#8247E5',
    description: 'For testing only',
    feeEstimate: 'Free (test tokens)'
  },
  [baseSepolia.id]: {
    name: 'Base Sepolia',
    displayName: 'Test Network (Base)',
    icon: '🧪',
    color: '#0052FF',
    description: 'For testing only',
    feeEstimate: 'Free (test tokens)'
  },
  [hardhat.id]: {
    name: 'Local',
    displayName: 'Local Development',
    icon: '🔨',
    color: '#FFC107',
    description: 'Local testing',
    feeEstimate: 'Free'
  }
} as const

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: '#2563EB', // Blue-600 - trust color
            accentColorForeground: 'white',
            borderRadius: 'large',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
          modalSize="compact"
          coolMode // Fun confetti on successful connection
          showRecentTransactions={true}
          appInfo={{
            appName: 'TrustPay SEA',
            learnMoreUrl: '/about',
            disclaimer: ({ Text, Link }) => (
              <Text>
                By connecting your wallet, you agree to our{' '}
                <Link href="/terms">Terms of Service</Link> and{' '}
                <Link href="/privacy">Privacy Policy</Link>
              </Text>
            )
          }}
          locale="en"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
