'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, Shield, Sparkles, Users, Zap, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    description: 'Untuk freelancer individual',
    price: 'Gratis',
    priceNote: '+ 2% per transaksi',
    features: [
      'Unlimited deals',
      'Milestone escrow',
      'Basic AI recommendations',
      'Email notifications',
      'Community support'
    ],
    cta: 'Mulai Gratis',
    highlighted: false
  },
  {
    name: 'Professional',
    description: 'Untuk freelancer aktif & agency kecil',
    price: 'Rp 99.000',
    priceNote: '/bulan + 1.5% per transaksi',
    features: [
      'Semua fitur Starter',
      'Priority AI analysis',
      'Custom branding on invoices',
      'Advanced analytics',
      'Priority email support',
      'Batch milestone upload',
      'Team members (up to 5)'
    ],
    cta: 'Coba 14 Hari Gratis',
    highlighted: true
  },
  {
    name: 'Agency',
    description: 'Untuk tim dan agency besar',
    price: 'Rp 299.000',
    priceNote: '/bulan + 1% per transaksi',
    features: [
      'Semua fitur Professional',
      'Unlimited team members',
      'White-label solution',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'Priority dispute handling'
    ],
    cta: 'Hubungi Sales',
    highlighted: false
  }
];

const comparisons = [
  { feature: 'Platform Fee', trustpay: '1-2%', competitor1: '5-20%', competitor2: '3-5%' },
  { feature: 'Settlement Time', trustpay: 'Instant', competitor1: '3-14 hari', competitor2: '1-7 hari' },
  { feature: 'AI Advisory', trustpay: '✓', competitor1: '✗', competitor2: '✗' },
  { feature: 'Milestone Escrow', trustpay: '✓', competitor1: '✓', competitor2: '✗' },
  { feature: 'Dispute Resolution', trustpay: 'AI + Mediator', competitor1: 'Manual', competitor2: 'Manual' },
  { feature: 'Blockchain Security', trustpay: '✓', competitor1: '✗', competitor2: '✗' },
  { feature: 'Cross-border Ready', trustpay: '✓', competitor1: 'Terbatas', competitor2: 'Terbatas' },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Harga Transparan
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Bayar Hanya Saat{' '}
              <span className="text-emerald-600">Transaksi Sukses</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Tidak ada biaya tersembunyi. Platform fee rendah, 
              settlement instan, dan AI gratis untuk semua.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`
                  relative rounded-2xl p-8
                  ${plan.highlighted 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl scale-105' 
                    : 'bg-white border border-slate-200 shadow-sm'
                  }
                `}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-amber-400 text-amber-900 text-sm font-semibold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.highlighted ? 'text-blue-100' : 'text-slate-500'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <div className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}
                  </div>
                  <p className={`text-sm mt-1 ${plan.highlighted ? 'text-blue-200' : 'text-slate-500'}`}>
                    {plan.priceNote}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-emerald-300' : 'text-emerald-500'}`} />
                      <span className={`text-sm ${plan.highlighted ? 'text-blue-50' : 'text-slate-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.name === 'Agency' ? '/contact' : '/create'}
                  className={`
                    block w-full py-3 px-4 rounded-xl text-center font-semibold transition-colors
                    ${plan.highlighted 
                      ? 'bg-white text-blue-600 hover:bg-blue-50' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }
                  `}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fee Breakdown */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Breakdown Biaya yang Jelas
            </h2>
            <p className="text-slate-600">
              Tidak ada biaya tersembunyi. Anda tahu persis berapa yang dibayar.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Clients */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Untuk Client</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-600">Platform fee</span>
                  <span className="font-semibold text-slate-900">1-2% dari total deal</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-600">Biaya transaksi blockchain</span>
                  <span className="font-semibold text-slate-900">~Rp 500</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-slate-600">Biaya tersembunyi</span>
                  <span className="font-semibold text-emerald-600">Rp 0</span>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-700">
                  <strong>Contoh:</strong> Deal Rp 10 juta → Fee Rp 200rb (2%)
                </p>
              </div>
            </motion.div>

            {/* For Freelancers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Untuk Freelancer</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-600">Biaya menerima dana</span>
                  <span className="font-semibold text-emerald-600">GRATIS</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-600">Biaya withdraw</span>
                  <span className="font-semibold text-slate-900">~Rp 500</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-slate-600">Potongan platform</span>
                  <span className="font-semibold text-emerald-600">Rp 0</span>
                </div>
              </div>
              <div className="mt-4 p-4 bg-emerald-50 rounded-xl">
                <p className="text-sm text-emerald-700">
                  <strong>Terima 100%</strong> dari nilai milestone yang diapprove
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Bandingkan dengan Platform Lain
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Fitur</th>
                  <th className="text-center py-4 px-4 font-semibold text-blue-600">TrustPay</th>
                  <th className="text-center py-4 px-4 font-medium text-slate-500">Freelance Platform</th>
                  <th className="text-center py-4 px-4 font-medium text-slate-500">Payment Gateway</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="py-4 px-6 text-slate-700">{row.feature}</td>
                    <td className="py-4 px-4 text-center font-medium text-blue-600">{row.trustpay}</td>
                    <td className="py-4 px-4 text-center text-slate-500">{row.competitor1}</td>
                    <td className="py-4 px-4 text-center text-slate-500">{row.competitor2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Shield className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Uang Anda Aman, Selalu
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-8">
              Dana disimpan di smart contract blockchain, bukan di server kami. 
              Tidak ada yang bisa mengakses dana kecuali sesuai kesepakatan deal.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>Audited Smart Contract</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>Non-custodial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>Transparent on Blockchain</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Mulai Sekarang, Bayar Nanti
            </h2>
            <p className="text-slate-600 mb-8">
              Buat akun gratis dan mulai deal pertama Anda. 
              Bayar platform fee hanya saat transaksi sukses.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Buat Deal Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
