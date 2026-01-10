'use client';

import { ReactNode, useEffect, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, lightTheme, type Theme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { config, liskSepolia } from '@/lib/wagmi';

// Create query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

// Custom theme that matches TrustPay SEA branding - Clean, Professional, Trust-focused
const trustPayTheme: Theme = {
  ...lightTheme(),
  colors: {
    ...lightTheme().colors,
    accentColor: '#0ea5e9', // Primary brand blue - trust & reliability
    accentColorForeground: 'white',
    connectButtonBackground: '#ffffff',
    connectButtonBackgroundError: '#ef4444',
    connectButtonInnerBackground: '#f5f5f5',
    connectButtonText: '#262626',
    connectButtonTextError: '#ffffff',
    connectionIndicator: '#22c55e',
    downloadBottomCardBackground: 'linear-gradient(126deg, rgba(14, 165, 233, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%)',
    downloadTopCardBackground: 'linear-gradient(126deg, rgba(14, 165, 233, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%)',
    error: '#ef4444',
    generalBorder: '#e5e5e5',
    generalBorderDim: '#f5f5f5',
    menuItemBackground: '#f5f5f5',
    modalBackdrop: 'rgba(0, 0, 0, 0.4)',
    modalBackground: '#ffffff',
    modalBorder: 'transparent',
    modalText: '#262626',
    modalTextDim: '#737373',
    modalTextSecondary: '#525252',
    profileAction: '#f5f5f5',
    profileActionHover: '#e5e5e5',
    profileForeground: '#ffffff',
    selectedOptionBorder: '#0ea5e9',
    standby: '#f59e0b',
  },
  fonts: {
    body: 'Inter, system-ui, sans-serif',
  },
  radii: {
    ...lightTheme().radii,
    actionButton: '12px',
    connectButton: '12px',
    menuButton: '12px',
    modal: '16px',
    modalMobile: '16px',
  },
  shadows: {
    connectButton: '0 1px 3px rgba(0, 0, 0, 0.1)',
    dialog: '0 10px 25px rgba(0, 0, 0, 0.15)',
    profileDetailsAction: '0 1px 2px rgba(0, 0, 0, 0.05)',
    selectedOption: '0 0 0 2px rgba(14, 165, 233, 0.3)',
    selectedWallet: '0 0 0 2px rgba(14, 165, 233, 0.3)',
    walletLogo: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
};

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={trustPayTheme}
          locale="en"
          coolMode // Fun confetti on successful connection
          modalSize="compact"
          showRecentTransactions={true}
          initialChain={liskSepolia} // Default to Lisk Sepolia for hackathon
          appInfo={{
            appName: 'TrustPay SEA',
            learnMoreUrl: '/how-it-works',
            disclaimer: ({ Text, Link }) => (
              <Text>
                By connecting, you agree to TrustPay SEA&apos;s{' '}
                <Link href="/terms">Terms of Service</Link> and{' '}
                <Link href="/privacy">Privacy Policy</Link>
              </Text>
            ),
          }}
        >
          {mounted ? children : null}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
