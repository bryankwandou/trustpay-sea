import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://trustpay-sea.vercel.app'),
  title: {
    default: 'TrustPay SEA — Secure Milestone Payments',
    template: '%s | TrustPay SEA'
  },
  description: 'Get paid safely for your work. AI-assisted escrow for freelancers and businesses in Southeast Asia.',
  keywords: ['escrow', 'freelancer', 'secure payment', 'milestone', 'Southeast Asia', 'UMKM'],
  openGraph: {
    title: 'TrustPay SEA — Secure Milestone Payments',
    description: 'AI-assisted escrow platform for freelancers and SMEs in Southeast Asia',
    type: 'website',
    siteName: 'TrustPay SEA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrustPay SEA — Secure Milestone Payments',
    description: 'AI-assisted escrow platform for freelancers and SMEs'
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-neutral-50 flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
