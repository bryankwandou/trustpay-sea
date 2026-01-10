'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, FileText, CheckCircle, Lock, Clock, Users, ArrowRight, Sparkles } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Buat Kesepakatan',
    description: 'Client dan freelancer membuat deal dengan milestone yang jelas. Seperti membuat invoice, tapi lebih aman.',
    icon: FileText,
    color: 'bg-blue-500',
    details: [
      'Tentukan scope pekerjaan',
      'Bagi ke beberapa milestone',
      'Set deadline per milestone',
      'Pilih mediator (opsional)'
    ]
  },
  {
    number: '02',
    title: 'Dana Terkunci Aman',
    description: 'Client mendepositkan dana ke smart contract. Dana terkunci sampai pekerjaan selesai.',
    icon: Lock,
    color: 'bg-emerald-500',
    details: [
      'Dana masuk ke escrow',
      'Tidak bisa ditarik sepihak',
      'Freelancer lihat dana ready',
      'Kerja dengan tenang'
    ]
  },
  {
    number: '03',
    title: 'Kerjakan & Submit',
    description: 'Freelancer mengerjakan milestone dan submit hasil. Progress terlihat real-time.',
    icon: Clock,
    color: 'bg-purple-500',
    details: [
      'Kerjakan per milestone',
      'Submit deliverable',
      'Client review hasil',
      'Revisi jika perlu'
    ]
  },
  {
    number: '04',
    title: 'Review & Approve',
    description: 'Client review hasil kerja. Jika sesuai, approve untuk release dana ke freelancer.',
    icon: CheckCircle,
    color: 'bg-amber-500',
    details: [
      'Client cek deliverable',
      'AI bantu analisis kualitas',
      'Approve jika puas',
      'Request revisi jika perlu'
    ]
  },
  {
    number: '05',
    title: 'Dana Terkirim',
    description: 'Setelah approve, dana otomatis terkirim ke freelancer. Aman, cepat, transparan.',
    icon: Shield,
    color: 'bg-green-500',
    details: [
      'Dana release otomatis',
      'Freelancer terima pembayaran',
      'Record di blockchain',
      'Lanjut milestone berikut'
    ]
  }
];

const faqs = [
  {
    q: 'Apakah aman? Bagaimana jika client tidak approve?',
    a: 'Dana terkunci di smart contract, bukan di TrustPay. Jika ada dispute, mediator yang dipilih bersama akan membantu menyelesaikan. AI memberikan analisis objektif, tapi keputusan final tetap di tangan manusia.'
  },
  {
    q: 'Berapa biaya menggunakan TrustPay?',
    a: 'Platform fee hanya 2% dari nilai transaksi, dibayar saat deal dibuat. Biaya transaksi blockchain sangat rendah (< Rp 500) karena kami menggunakan jaringan Polygon.'
  },
  {
    q: 'Apa peran AI di TrustPay?',
    a: 'AI membantu menganalisis deliverable, memberikan rekomendasi harga wajar, dan memberikan pre-analysis saat dispute. Tapi AI TIDAK pernah mengontrol dana atau membuat keputusan final - semua keputusan ada di tangan Anda.'
  },
  {
    q: 'Saya belum pernah pakai crypto, apakah bisa?',
    a: 'Sangat bisa! TrustPay didesain untuk pemula. Cukup connect wallet (kami guide step by step), dan sisanya seperti menggunakan marketplace biasa. Tidak perlu paham blockchain.'
  },
  {
    q: 'Mata uang apa yang didukung?',
    a: 'Saat ini kami mendukung USDC dan USDT (stablecoin yang nilainya = 1 USD). Tidak ada fluktuasi harga seperti Bitcoin, sehingga aman untuk transaksi bisnis.'
  },
  {
    q: 'Bagaimana jika ada dispute?',
    a: 'Kedua pihak bisa submit bukti dan argumen. AI akan memberikan pre-analysis objektif. Mediator (yang dipilih bersama di awal) akan membuat keputusan final berdasarkan bukti.'
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Cara Kerja TrustPay
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Transaksi Aman dalam{' '}
              <span className="text-blue-600">5 Langkah Mudah</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Tidak perlu paham blockchain. Cukup ikuti langkah-langkah sederhana 
              seperti menggunakan marketplace biasa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row gap-8 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl font-bold text-slate-200">{step.number}</span>
                    <div className={`w-12 h-12 ${step.color} rounded-xl flex items-center justify-center`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className="flex-1">
                  <div className={`aspect-video rounded-2xl ${step.color} bg-opacity-10 flex items-center justify-center`}>
                    <step.icon className={`w-24 h-24 ${step.color.replace('bg-', 'text-')} opacity-50`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Advisory Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Assisted
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              AI Membantu, Anda yang Memutuskan
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              AI kami memberikan analisis dan rekomendasi objektif, 
              tapi semua keputusan final tetap di tangan Anda.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Analisis Deliverable',
                desc: 'AI membantu review apakah hasil kerja sesuai dengan scope yang disepakati'
              },
              {
                title: 'Rekomendasi Harga',
                desc: 'Dapatkan insight harga wajar berdasarkan jenis pekerjaan dan market rate'
              },
              {
                title: 'Pre-Analysis Dispute',
                desc: 'Analisis objektif dari bukti kedua pihak untuk membantu mediator'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl"
          >
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-amber-900">AI Hanya Advisory</p>
                <p className="text-amber-700 text-sm mt-1">
                  AI tidak pernah mengontrol dana atau membuat keputusan final. 
                  Semua release dana membutuhkan persetujuan manual dari Anda.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Pertanyaan Umum
            </h2>
            <p className="text-slate-600">
              Belum jelas? Temukan jawabannya di sini
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
              >
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 md:p-12 text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Siap Transaksi Lebih Aman?
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Mulai lindungi pekerjaan dan pembayaran Anda sekarang. 
              Gratis untuk mendaftar, bayar hanya saat transaksi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
              >
                Buat Deal Pertama
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-400 transition-colors"
              >
                Lihat Demo Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
