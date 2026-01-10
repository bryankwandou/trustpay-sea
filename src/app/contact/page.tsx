'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, send to API
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Pesan Terkirim!</h1>
          <p className="text-slate-600 mb-8">
            Terima kasih sudah menghubungi kami. Tim kami akan membalas dalam 1-2 hari kerja.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Kembali ke Home
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Hubungi Kami
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Ada pertanyaan atau butuh bantuan? Tim kami siap membantu.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Email */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
              <p className="text-slate-600 text-sm mb-2">Untuk pertanyaan umum</p>
              <a href="mailto:hello@trustpay.sea" className="text-blue-600 font-medium hover:underline">
                hello@trustpay.sea
              </a>
            </div>

            {/* Support */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Support</h3>
              <p className="text-slate-600 text-sm mb-2">Bantuan teknis & dispute</p>
              <a href="mailto:support@trustpay.sea" className="text-blue-600 font-medium hover:underline">
                support@trustpay.sea
              </a>
            </div>

            {/* Office */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Kantor</h3>
              <p className="text-slate-600 text-sm">
                Jakarta, Indonesia
                <br />
                <span className="text-xs text-slate-400">(Remote-first company)</span>
              </p>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
              <p className="text-sm text-slate-600">
                <strong className="text-slate-900">Waktu Respons:</strong>
                <br />
                Hari kerja: &lt; 24 jam
                <br />
                Weekend: &lt; 48 jam
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nama
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Nama Anda"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Kategori
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="general">Pertanyaan Umum</option>
                  <option value="support">Bantuan Teknis</option>
                  <option value="dispute">Masalah Dispute</option>
                  <option value="partnership">Partnership / Business</option>
                  <option value="feedback">Feedback & Saran</option>
                </select>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pesan
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  placeholder="Jelaskan pertanyaan atau masalah Anda..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Send className="w-5 h-5" />
                Kirim Pesan
              </button>

              <p className="text-xs text-slate-500 text-center mt-4">
                Dengan mengirim pesan, Anda menyetujui{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> kami.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
