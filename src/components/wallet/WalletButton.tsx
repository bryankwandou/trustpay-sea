'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { NETWORK_INFO } from '@/lib/wagmi';

/**
 * Custom wallet connect button with TrustPay SEA UX
 * - Shows friendly labels instead of addresses
 * - Displays balance in readable format
 * - Network indicator with recommendations
 */
export function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Wrong Network
                  </button>
                );
              }

              const networkInfo = NETWORK_INFO[chain.id as keyof typeof NETWORK_INFO];

              return (
                <div className="flex items-center gap-2">
                  {/* Network Selector */}
                  <button
                    onClick={openChainModal}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-sm"
                    title={networkInfo?.description}
                  >
                    <span>{networkInfo?.icon || '🌐'}</span>
                    <span className="font-medium text-slate-700 hidden sm:inline">
                      {chain.name}
                    </span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Account Button */}
                  <button
                    onClick={openAccountModal}
                    className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    {/* Balance */}
                    {account.displayBalance && (
                      <span className="text-sm font-medium text-slate-700 hidden sm:inline">
                        {account.displayBalance}
                      </span>
                    )}
                    
                    {/* Avatar & Address */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                      <span className="text-sm font-medium text-slate-900">
                        {formatFriendlyAddress(account.displayName)}
                      </span>
                    </div>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

/**
 * Compact wallet button for mobile/tight spaces
 */
export function WalletButtonCompact() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div {...(!ready && { style: { opacity: 0, pointerEvents: 'none' } })}>
            {!connected ? (
              <button
                onClick={openConnectModal}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={openAccountModal}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                <span className="text-sm font-medium text-slate-700">
                  {formatFriendlyAddress(account.displayName)}
                </span>
              </button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

/**
 * Format address to be more friendly (avoid hex intimidation)
 * Shows "Account ...XXXX" instead of "0x1234...5678"
 */
function formatFriendlyAddress(displayName: string): string {
  // If it's an ENS name, show it as is
  if (displayName.includes('.')) {
    return displayName;
  }
  
  // If it's a hex address, make it friendly
  if (displayName.startsWith('0x')) {
    const lastFour = displayName.slice(-4);
    return `...${lastFour}`;
  }
  
  return displayName;
}

/**
 * Hook to get current wallet state with friendly formatting
 */
export function useWalletState() {
  const { address, isConnected, isConnecting } = useAccount();
  const chainId = useChainId();
  
  return {
    address,
    isConnected,
    isConnecting,
    chainId,
    friendlyAddress: address ? `Account ...${address.slice(-4)}` : null,
    networkInfo: chainId ? NETWORK_INFO[chainId as keyof typeof NETWORK_INFO] : null
  };
}
