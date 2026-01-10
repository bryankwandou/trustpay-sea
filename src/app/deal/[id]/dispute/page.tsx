'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui';
import { AIDisputeAnalysisBox } from '@/components/ai';

// Types
interface Evidence {
  id: string;
  type: 'file' | 'link' | 'text' | 'image';
  title: string;
  description: string;
  url?: string;
  uploadedAt: Date;
  uploadedBy: 'client' | 'freelancer';
}

interface DisputeData {
  id: string;
  dealId: string;
  milestoneIndex: number;
  status: 'open' | 'reviewing' | 'resolved';
  openedBy: 'client' | 'freelancer';
  openedAt: Date;
  clientArgument: string;
  freelancerArgument: string;
  clientEvidence: Evidence[];
  freelancerEvidence: Evidence[];
  resolution?: {
    decision: 'favor_client' | 'favor_freelancer' | 'split';
    splitPercentage?: number;
    reason: string;
    resolvedAt: Date;
    resolvedBy: string;
  };
}

// Mock dispute data - in production, fetch from blockchain/API
const mockDispute: DisputeData = {
  id: 'dispute-1',
  dealId: '1',
  milestoneIndex: 1,
  status: 'reviewing',
  openedBy: 'client',
  openedAt: new Date('2026-01-02'),
  clientArgument: `The delivered landing page does not match the agreed specifications. 
  
Key issues:
1. Mobile responsiveness was promised but the site breaks on screens below 768px
2. The hero animation is missing entirely
3. Contact form doesn't validate email addresses
4. Load time exceeds 3 seconds (specification was under 2 seconds)

I have provided screenshots and video evidence showing these issues.`,
  freelancerArgument: `I delivered all core requirements on time:

1. Mobile responsiveness: Works on all tested devices (iPhone 12, Samsung S21, iPad). Client's screenshots show a rare edge case I can fix quickly.
2. Hero animation: Implemented as shown in my screen recording. Might be a browser caching issue.
3. Form validation: Added - but client tested before deployment was complete.
4. Load time: 2.1s on my tests. Client's slow internet may be the cause.

I'm willing to make adjustments but the core work is complete.`,
  clientEvidence: [
    {
      id: 'ev-1',
      type: 'image',
      title: 'Mobile view broken.png',
      description: 'Screenshot showing layout issues on iPhone 12 Pro',
      url: '/evidence/screenshot1.png',
      uploadedAt: new Date('2026-01-02'),
      uploadedBy: 'client'
    },
    {
      id: 'ev-2',
      type: 'link',
      title: 'Page Speed Test',
      description: 'Google PageSpeed showing 3.2s load time',
      url: 'https://pagespeed.web.dev/report/...',
      uploadedAt: new Date('2026-01-02'),
      uploadedBy: 'client'
    }
  ],
  freelancerEvidence: [
    {
      id: 'ev-3',
      type: 'file',
      title: 'Demo_recording.mp4',
      description: 'Video showing working mobile view and animations',
      url: '/evidence/demo.mp4',
      uploadedAt: new Date('2026-01-03'),
      uploadedBy: 'freelancer'
    },
    {
      id: 'ev-4',
      type: 'image',
      title: 'Mobile_test_results.png',
      description: 'BrowserStack test results on 10+ devices',
      url: '/evidence/browserstack.png',
      uploadedAt: new Date('2026-01-03'),
      uploadedBy: 'freelancer'
    }
  ]
};

const mockMilestone = {
  title: 'Landing Page Design & Development',
  amount: 2500000,
  currency: 'USDC'
};

const mockDeal = {
  title: 'E-commerce Website Redesign',
  client: { name: 'PT Maju Bersama', address: '0x1234...5678' },
  freelancer: { name: 'Sarah Designer', address: '0x8765...4321' }
};

export default function DisputeResolutionPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'client' | 'freelancer' | 'ai'>('overview');
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  
  // In production, these would trigger actual contract calls
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispute = mockDispute;
  const milestone = mockMilestone;
  const deal = mockDeal;

  const handleViewEvidence = (evidence: Evidence) => {
    setSelectedEvidence(evidence);
    setShowEvidenceModal(true);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href={`/deal/${params.id}`}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Dispute Resolution</h1>
                <p className="text-sm text-slate-500">{deal.title}</p>
              </div>
            </div>
            <Badge variant="warning">Under Review</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dispute Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card variant="elevated">
            <CardBody className="p-6">
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Milestone</p>
                  <p className="font-medium text-slate-900">{milestone.title}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Amount at Stake</p>
                  <p className="font-semibold text-lg text-slate-900">{formatCurrency(milestone.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Opened By</p>
                  <p className="font-medium text-slate-900 capitalize">{dispute.openedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Opened On</p>
                  <p className="font-medium text-slate-900">{formatDate(dispute.openedAt)}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'client', label: 'Client Side' },
            { id: 'freelancer', label: 'Freelancer Side' },
            { id: 'ai', label: 'AI Analysis' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${activeTab === tab.id 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              {/* Client Summary */}
              <Card>
                <CardHeader className="border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">C</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{deal.client.name}</h3>
                      <p className="text-sm text-slate-500">Client</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="p-4">
                  <p className="text-slate-700 whitespace-pre-line line-clamp-6">{dispute.clientArgument}</p>
                  <button 
                    onClick={() => setActiveTab('client')}
                    className="text-blue-600 text-sm font-medium mt-3 hover:underline"
                  >
                    Read full argument & evidence →
                  </button>
                </CardBody>
              </Card>

              {/* Freelancer Summary */}
              <Card>
                <CardHeader className="border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-semibold">F</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{deal.freelancer.name}</h3>
                      <p className="text-sm text-slate-500">Freelancer</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="p-4">
                  <p className="text-slate-700 whitespace-pre-line line-clamp-6">{dispute.freelancerArgument}</p>
                  <button 
                    onClick={() => setActiveTab('freelancer')}
                    className="text-blue-600 text-sm font-medium mt-3 hover:underline"
                  >
                    Read full argument & evidence →
                  </button>
                </CardBody>
              </Card>
            </motion.div>
          )}

          {activeTab === 'client' && (
            <motion.div
              key="client"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader className="border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">C</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{deal.client.name}</h3>
                      <p className="text-sm text-slate-500">Client's Position</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">Argument</h4>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-slate-700 whitespace-pre-line">{dispute.clientArgument}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                      Evidence ({dispute.clientEvidence.length} items)
                    </h4>
                    <div className="space-y-3">
                      {dispute.clientEvidence.map((evidence) => (
                        <div 
                          key={evidence.id}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`
                              w-10 h-10 rounded-lg flex items-center justify-center
                              ${evidence.type === 'image' ? 'bg-purple-100 text-purple-600' : ''}
                              ${evidence.type === 'file' ? 'bg-blue-100 text-blue-600' : ''}
                              ${evidence.type === 'link' ? 'bg-emerald-100 text-emerald-600' : ''}
                              ${evidence.type === 'text' ? 'bg-slate-200 text-slate-600' : ''}
                            `}>
                              {evidence.type === 'image' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              )}
                              {evidence.type === 'file' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              )}
                              {evidence.type === 'link' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{evidence.title}</p>
                              <p className="text-sm text-slate-500">{evidence.description}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleViewEvidence(evidence)}
                            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}

          {activeTab === 'freelancer' && (
            <motion.div
              key="freelancer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader className="border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-bold text-lg">F</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{deal.freelancer.name}</h3>
                      <p className="text-sm text-slate-500">Freelancer's Position</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">Argument</h4>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-slate-700 whitespace-pre-line">{dispute.freelancerArgument}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                      Evidence ({dispute.freelancerEvidence.length} items)
                    </h4>
                    <div className="space-y-3">
                      {dispute.freelancerEvidence.map((evidence) => (
                        <div 
                          key={evidence.id}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`
                              w-10 h-10 rounded-lg flex items-center justify-center
                              ${evidence.type === 'image' ? 'bg-purple-100 text-purple-600' : ''}
                              ${evidence.type === 'file' ? 'bg-blue-100 text-blue-600' : ''}
                              ${evidence.type === 'link' ? 'bg-emerald-100 text-emerald-600' : ''}
                            `}>
                              {evidence.type === 'image' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              )}
                              {evidence.type === 'file' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{evidence.title}</p>
                              <p className="text-sm text-slate-500">{evidence.description}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleViewEvidence(evidence)}
                            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AIDisputeAnalysisBox
                summary="Berdasarkan analisis bukti kedua belah pihak, terdapat miskomunikasi tentang definisi 'selesai'. Freelancer telah mengirimkan deliverable utama, namun beberapa detail spesifikasi tidak terpenuhi sepenuhnya."
                clientStrengths={[
                  "Bukti PageSpeed menunjukkan load time melebihi spesifikasi",
                  "Screenshot mobile view menunjukkan masalah layout yang valid",
                  "Spesifikasi awal tercatat dengan jelas"
                ]}
                freelancerStrengths={[
                  "Video demo menunjukkan fungsionalitas dasar berfungsi",
                  "Testing di BrowserStack menunjukkan effort untuk quality assurance",
                  "Respons proaktif untuk memperbaiki issues"
                ]}
                suggestedResolution="Freelancer telah menyelesaikan ~80% deliverable dengan kualitas baik. Issues yang ada bersifat fixable dan bukan fundamental. Rekomendasi: 70% payment ke freelancer sekarang, 30% setelah fixes selesai dalam 3 hari kerja."
                confidence={78}
                disclaimer="This AI analysis is for informational purposes only. The final decision must be made by a human mediator after reviewing all evidence."
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Section - Only for Mediator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card variant="elevated" className="bg-gradient-to-br from-slate-900 to-slate-800">
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Mediator Decision Required</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    As the assigned mediator, you have the authority to resolve this dispute. 
                    Review all evidence carefully before making your final decision.
                  </p>
                  
                  {/* Decision Warning */}
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="text-amber-200 font-medium text-sm">This action is irreversible</p>
                        <p className="text-amber-200/70 text-xs mt-1">
                          Once you submit your decision, funds will be distributed accordingly and the dispute will be closed permanently.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Resolution Options */}
                  <div className="grid sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => {}}
                      disabled={isSubmitting}
                      className="group p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl transition-all text-left"
                    >
                      <span className="text-blue-400 font-semibold block mb-1">Favor Client</span>
                      <span className="text-slate-400 text-xs">100% refund to client</span>
                    </button>
                    <button
                      onClick={() => {}}
                      disabled={isSubmitting}
                      className="group p-4 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl transition-all text-left"
                    >
                      <span className="text-emerald-400 font-semibold block mb-1">Favor Freelancer</span>
                      <span className="text-slate-400 text-xs">100% payment to freelancer</span>
                    </button>
                    <button
                      onClick={() => {}}
                      disabled={isSubmitting}
                      className="group p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl transition-all text-left"
                    >
                      <span className="text-purple-400 font-semibold block mb-1">Split Payment</span>
                      <span className="text-slate-400 text-xs">Custom % division</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Back to Deal Button */}
        <div className="mt-6 flex justify-center">
          <Link href={`/deal/${params.id}`}>
            <Button variant="ghost">
              ← Back to Deal Details
            </Button>
          </Link>
        </div>
      </main>

      {/* Evidence Modal */}
      <AnimatePresence>
        {showEvidenceModal && selectedEvidence && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEvidenceModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <div>
                  <h3 className="font-semibold text-slate-900">{selectedEvidence.title}</h3>
                  <p className="text-sm text-slate-500">{selectedEvidence.description}</p>
                </div>
                <button 
                  onClick={() => setShowEvidenceModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                {selectedEvidence.type === 'image' && (
                  <div className="bg-slate-100 rounded-xl aspect-video flex items-center justify-center">
                    <span className="text-slate-400">Image Preview</span>
                  </div>
                )}
                {selectedEvidence.type === 'file' && (
                  <div className="bg-slate-100 rounded-xl p-8 text-center">
                    <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-slate-600 font-medium">{selectedEvidence.title}</p>
                    <Button variant="primary" size="sm" className="mt-4">
                      Download File
                    </Button>
                  </div>
                )}
                {selectedEvidence.type === 'link' && (
                  <div className="bg-slate-100 rounded-xl p-6">
                    <p className="text-slate-600 mb-4">External Link:</p>
                    <a 
                      href={selectedEvidence.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {selectedEvidence.url}
                    </a>
                    <Button variant="primary" size="sm" className="mt-4">
                      Open in New Tab
                    </Button>
                  </div>
                )}
              </div>
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  Uploaded by <span className="capitalize">{selectedEvidence.uploadedBy}</span> on {formatDate(selectedEvidence.uploadedAt)}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
