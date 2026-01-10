'use client'

import Link from 'next/link'
import { Shield, Menu, X, ChevronDown, LayoutDashboard, Plus, HelpCircle, DollarSign, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { NETWORK_INFO } from '@/lib/wagmi'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isConnected, address } = useAccount()
  const chainId = useChainId()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Get network info for display
  const networkInfo = chainId ? NETWORK_INFO[chainId] : null

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-neutral-200' 
        : 'bg-white/80 backdrop-blur-lg border-b border-neutral-100'
    }`}>
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl text-neutral-900 leading-tight">
                TrustPay
              </span>
              <span className="text-[10px] text-primary-500 font-medium tracking-wide uppercase">
                SEA Escrow
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <NavLink href="/how-it-works" icon={<HelpCircle className="w-4 h-4" />}>
              How It Works
            </NavLink>
            <NavLink href="/pricing" icon={<DollarSign className="w-4 h-4" />}>
              Pricing
            </NavLink>
            <NavLink href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />}>
              My Deals
            </NavLink>
          </div>

          {/* Right Side - Wallet & CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Network Indicator */}
            {isConnected && networkInfo && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                networkInfo.isTestnet 
                  ? 'bg-warning-50 text-warning-700 border border-warning-200' 
                  : 'bg-success-50 text-success-700 border border-success-200'
              }`}>
                <span>{networkInfo.icon}</span>
                <span>{networkInfo.name}</span>
              </div>
            )}
            
            {/* Wallet Connect - RainbowKit */}
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted
                const connected = ready && account && chain

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
                            className="btn-secondary py-2 px-4 text-sm"
                          >
                            Connect Wallet
                          </button>
                        )
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            className="bg-danger-100 text-danger-700 py-2 px-4 rounded-xl text-sm font-medium"
                          >
                            Wrong Network
                          </button>
                        )
                      }

                      return (
                        <button
                          onClick={openAccountModal}
                          className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 py-2 px-3 rounded-xl transition-colors"
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600" />
                          <span className="text-sm font-medium text-neutral-700">
                            {account.displayName}
                          </span>
                          <ChevronDown className="w-4 h-4 text-neutral-500" />
                        </button>
                      )
                    })()}
                  </div>
                )
              }}
            </ConnectButton.Custom>

            {/* Create Deal CTA */}
            <Link 
              href="/create" 
              className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Deal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 hover:bg-neutral-100 rounded-xl transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-100 animate-fade-in">
            <div className="flex flex-col gap-1">
              <MobileNavLink href="/how-it-works" icon={<HelpCircle className="w-5 h-5" />}>
                How It Works
              </MobileNavLink>
              <MobileNavLink href="/pricing" icon={<DollarSign className="w-5 h-5" />}>
                Pricing
              </MobileNavLink>
              <MobileNavLink href="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />}>
                My Deals
              </MobileNavLink>
              
              <div className="pt-4 mt-2 border-t border-neutral-100 space-y-3">
                {/* Network Badge */}
                {isConnected && networkInfo && (
                  <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                    networkInfo.isTestnet 
                      ? 'bg-warning-50 text-warning-700 border border-warning-200' 
                      : 'bg-success-50 text-success-700 border border-success-200'
                  }`}>
                    <span>{networkInfo.icon}</span>
                    <span>{networkInfo.name}</span>
                    {networkInfo.isTestnet && <span className="text-xs">(Testnet)</span>}
                  </div>
                )}
                
                {/* Wallet Connect */}
                <div className="flex justify-center">
                  <ConnectButton />
                </div>
                
                {/* Create Deal CTA */}
                <Link 
                  href="/create" 
                  className="btn-primary text-center w-full flex items-center justify-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Plus className="w-5 h-5" />
                  Create Deal
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Desktop Nav Link Component
function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 font-medium rounded-xl transition-all"
    >
      {icon && <span className="text-neutral-400">{icon}</span>}
      {children}
    </Link>
  )
}

// Mobile Nav Link Component
function MobileNavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 font-medium rounded-xl transition-all"
    >
      {icon && <span className="text-neutral-400">{icon}</span>}
      {children}
    </Link>
  )
}
