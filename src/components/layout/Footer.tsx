import Link from 'next/link'
import { Shield, Heart, Globe, Github, Twitter, Linkedin, Mail, ExternalLink } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-neutral-900 text-white">
      {/* Main Footer */}
      <div className="container-main py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl text-white leading-tight">
                  TrustPay
                </span>
                <span className="text-[10px] text-primary-400 font-medium tracking-wide uppercase">
                  SEA Escrow
                </span>
              </div>
            </div>
            <p className="text-neutral-400 text-sm mb-6 max-w-sm">
              AI-assisted milestone escrow for freelancers and SMEs in Southeast Asia. 
              Secure payments, transparent processes, human decisions.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-neutral-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-neutral-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-neutral-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="mailto:hello@trustpay.sea" 
                className="w-9 h-9 bg-neutral-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/how-it-works" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  Create a Deal
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <a 
                  href="https://sepolia-blockscout.lisk.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-primary-400 transition-colors inline-flex items-center gap-1"
                >
                  Block Explorer
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://lisk.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-primary-400 transition-colors inline-flex items-center gap-1"
                >
                  Lisk Network
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Network Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-full text-sm">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
            <span className="text-neutral-400">Deployed on</span>
            <span className="font-semibold text-white">Lisk Sepolia Testnet</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-sm">
            © {currentYear} TrustPay SEA. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-danger-400" />
            <span>for</span>
            <Globe className="w-4 h-4 text-primary-400" />
            <span className="text-primary-400 font-medium">Southeast Asia</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
