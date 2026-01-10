'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Upload, 
  AlertCircle,
  Shield,
  Sparkles,
  ExternalLink,
  FileText,
  Calendar,
  DollarSign,
  User,
  ChevronRight,
  MessageSquare,
  X
} from 'lucide-react'
import { Button, Card, Badge, Input } from '@/components/ui'
import { AIRecommendationBox } from '@/components/ai/AIRecommendationBox'
import { Footer } from '@/components/layout'
import { 
  formatAmount, 
  formatDate, 
  formatDeadline,
  getDealStatusLabel, 
  getMilestoneStatusLabel,
  calculateDealProgress,
  formatAddress
} from '@/lib/utils'
import { Deal, Milestone, MilestoneStatus } from '@/lib/types'

// Mock deal data
const MOCK_DEAL: Deal = {
  id: '1',
  title: 'E-commerce Website Development',
  description: 'Full stack e-commerce website with payment integration, user authentication, product management, and admin dashboard. Technologies: React, Node.js, PostgreSQL.',
  freelancer: '0x1234567890123456789012345678901234567890',
  client: '0x0987654321098765432109876543210987654321',
  totalAmount: 5000,
  currency: 'USDC',
  serviceFee: 100,
  status: 'in_progress',
  milestones: [
    { 
      id: 'm1', 
      title: 'Design Mockups', 
      description: 'Complete UI/UX design including homepage, product pages, cart, and checkout flow',
      amount: 1000, 
      currency: 'USDC', 
      deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), 
      status: 'approved', 
      order: 1, 
      createdAt: new Date(),
      approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      submission: {
        id: 's1',
        milestoneId: 'm1',
        description: 'All design mockups completed. Includes 15 screens for desktop and mobile.',
        attachments: [
          { id: 'a1', name: 'mockups-v1.fig', url: '#', type: 'application/figma', size: 2500000 }
        ],
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        submittedBy: '0x1234567890123456789012345678901234567890'
      }
    },
    { 
      id: 'm2', 
      title: 'Frontend Development', 
      description: 'React frontend with all pages, components, and responsive design',
      amount: 2000, 
      currency: 'USDC', 
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 
      status: 'submitted', 
      order: 2, 
      createdAt: new Date(),
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      submission: {
        id: 's2',
        milestoneId: 'm2',
        description: 'Frontend development completed. All pages implemented with responsive design. Deployed to staging environment for review.',
        attachments: [
          { id: 'a2', name: 'staging-link.txt', url: '#', type: 'text/plain', size: 100 },
          { id: 'a3', name: 'source-code.zip', url: '#', type: 'application/zip', size: 15000000 }
        ],
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        submittedBy: '0x1234567890123456789012345678901234567890'
      },
      aiAnalysis: {
        id: 'ai1',
        milestoneId: 'm2',
        recommendation: 'approve',
        confidence: 87,
        summary: 'The submission appears to meet the milestone requirements. Code quality is good and all requested features are implemented.',
        reasons: [
          'All 15 pages from design have been implemented',
          'Responsive design works on mobile and tablet',
          'Code follows React best practices',
          'Staging deployment is functional'
        ],
        concerns: [
          'Minor: Some loading states could be improved',
          'Consider adding more error handling'
        ],
        analyzedAt: new Date(),
        modelVersion: '1.0'
      }
    },
    { 
      id: 'm3', 
      title: 'Backend & Testing', 
      description: 'Node.js backend with API endpoints, database integration, and comprehensive testing',
      amount: 2000, 
      currency: 'USDC', 
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 
      status: 'pending', 
      order: 3, 
      createdAt: new Date()
    },
  ],
  createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  fundedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
}

export default function DealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [deal, setDeal] = useState<Deal>(MOCK_DEAL)
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)

  const progress = calculateDealProgress(deal.milestones)
  const currentMilestone = deal.milestones.find(m => 
    m.status === 'submitted' || m.status === 'active'
  ) || deal.milestones.find(m => m.status === 'pending')

  const handleApproveMilestone = (milestone: Milestone) => {
    // TODO: Call smart contract
    setDeal(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => 
        m.id === milestone.id 
          ? { ...m, status: 'approved' as MilestoneStatus, approvedAt: new Date() }
          : m
      )
    }))
    setShowApproveModal(false)
    setSelectedMilestone(null)
  }

  const handleRejectMilestone = (milestone: Milestone) => {
    setDeal(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => 
        m.id === milestone.id 
          ? { ...m, status: 'rejected' as MilestoneStatus }
          : m
      )
    }))
    setShowRejectModal(false)
    setSelectedMilestone(null)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-main py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Deals
          </button>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-neutral-900">
                  {deal.title}
                </h1>
                <Badge variant={deal.status === 'in_progress' ? 'active' : 'completed'}>
                  {getDealStatusLabel(deal.status)}
                </Badge>
              </div>
              <p className="text-neutral-600 max-w-2xl">
                {deal.description}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="secondary" leftIcon={<MessageSquare className="w-4 h-4" />}>
                Message
              </Button>
              {deal.status === 'disputed' && (
                <Link href={`/deal/${deal.id}/dispute`}>
                  <Button variant="danger">View Dispute</Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overall Progress */}
            <Card>
              <h2 className="font-semibold text-lg text-neutral-900 mb-4">Project Progress</h2>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-neutral-600 mb-2">
                  <span>{deal.milestones.filter(m => m.status === 'approved').length} of {deal.milestones.length} milestones completed</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <div className="progress-bar h-3">
                  <div 
                    className="progress-fill-success"
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>

              {/* Amount Released vs Remaining */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-success-50 rounded-xl">
                  <p className="text-sm text-success-700 mb-1">Released</p>
                  <p className="font-bold text-xl text-success-700">
                    {formatAmount(
                      deal.milestones.filter(m => m.status === 'approved').reduce((sum, m) => sum + m.amount, 0),
                      deal.currency
                    )}
                  </p>
                </div>
                <div className="p-4 bg-neutral-100 rounded-xl">
                  <p className="text-sm text-neutral-600 mb-1">In Escrow</p>
                  <p className="font-bold text-xl text-neutral-900">
                    {formatAmount(
                      deal.milestones.filter(m => m.status !== 'approved').reduce((sum, m) => sum + m.amount, 0),
                      deal.currency
                    )}
                  </p>
                </div>
              </div>
            </Card>

            {/* Milestones */}
            <Card>
              <h2 className="font-semibold text-lg text-neutral-900 mb-4">Milestones</h2>
              
              <div className="space-y-4">
                {deal.milestones.map((milestone, index) => (
                  <MilestoneCard 
                    key={milestone.id} 
                    milestone={milestone}
                    index={index}
                    isLast={index === deal.milestones.length - 1}
                    onApprove={() => {
                      setSelectedMilestone(milestone)
                      setShowApproveModal(true)
                    }}
                    onReject={() => {
                      setSelectedMilestone(milestone)
                      setShowRejectModal(true)
                    }}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Deal Summary */}
            <Card>
              <h3 className="font-semibold text-neutral-900 mb-4">Deal Summary</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Total Value</p>
                    <p className="font-semibold">{formatAmount(deal.totalAmount, deal.currency)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-success-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Started</p>
                    <p className="font-semibold">{formatDate(deal.fundedAt!)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-warning-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Freelancer</p>
                    <p className="font-semibold">{formatAddress(deal.freelancer)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Client</p>
                    <p className="font-semibold">{formatAddress(deal.client)}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Need Help */}
            <Card className="bg-ai-bg border-ai-border">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-ai-accent mt-0.5" />
                <div>
                  <p className="font-medium text-neutral-900">Having issues?</p>
                  <p className="text-sm text-neutral-600 mt-1 mb-3">
                    If you can't resolve a disagreement, you can open a dispute for review.
                  </p>
                  <Button variant="secondary" size="sm">
                    Learn About Disputes
                  </Button>
                </div>
              </div>
            </Card>

            {/* Security */}
            <Card>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-success-600 mt-0.5" />
                <div>
                  <p className="font-medium text-neutral-900">Funds Protected</p>
                  <p className="text-sm text-neutral-600 mt-1">
                    All payments are secured in escrow until work is approved.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && selectedMilestone && (
        <ApproveModal
          milestone={selectedMilestone}
          currency={deal.currency}
          onConfirm={() => handleApproveMilestone(selectedMilestone)}
          onClose={() => {
            setShowApproveModal(false)
            setSelectedMilestone(null)
          }}
        />
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedMilestone && (
        <RejectModal
          milestone={selectedMilestone}
          onConfirm={() => handleRejectMilestone(selectedMilestone)}
          onClose={() => {
            setShowRejectModal(false)
            setSelectedMilestone(null)
          }}
        />
      )}

      <Footer />
    </div>
  )
}

// Milestone Card Component
function MilestoneCard({ 
  milestone, 
  index, 
  isLast,
  onApprove,
  onReject 
}: { 
  milestone: Milestone
  index: number
  isLast: boolean
  onApprove: () => void
  onReject: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(milestone.status === 'submitted')
  const deadline = formatDeadline(milestone.deadline)
  
  const statusIcon = {
    pending: <Clock className="w-5 h-5 text-neutral-400" />,
    active: <Clock className="w-5 h-5 text-primary-500" />,
    submitted: <Upload className="w-5 h-5 text-warning-500" />,
    approved: <CheckCircle className="w-5 h-5 text-success-500" />,
    rejected: <AlertCircle className="w-5 h-5 text-danger-500" />,
    disputed: <AlertCircle className="w-5 h-5 text-danger-500" />,
  }

  return (
    <div className={`relative ${!isLast ? 'pb-4' : ''}`}>
      {/* Connector Line */}
      {!isLast && (
        <div className={`absolute left-[19px] top-10 w-0.5 h-full ${
          milestone.status === 'approved' ? 'bg-success-300' : 'bg-neutral-200'
        }`} />
      )}
      
      <div 
        className={`p-4 rounded-xl border transition-all cursor-pointer ${
          milestone.status === 'submitted' 
            ? 'bg-warning-50 border-warning-200' 
            : milestone.status === 'approved'
            ? 'bg-success-50 border-success-200'
            : 'bg-white border-neutral-200 hover:border-neutral-300'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            milestone.status === 'approved' ? 'bg-success-100' :
            milestone.status === 'submitted' ? 'bg-warning-100' :
            milestone.status === 'active' ? 'bg-primary-100' :
            'bg-neutral-100'
          }`}>
            {statusIcon[milestone.status]}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-neutral-900">
                {index + 1}. {milestone.title}
              </h4>
              <p className="font-semibold text-neutral-900">
                {formatAmount(milestone.amount, milestone.currency)}
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-1">
              <Badge variant={
                milestone.status === 'approved' ? 'completed' :
                milestone.status === 'submitted' ? 'pending' :
                milestone.status === 'rejected' || milestone.status === 'disputed' ? 'disputed' :
                'neutral'
              }>
                {getMilestoneStatusLabel(milestone.status)}
              </Badge>
              <span className={`text-sm ${deadline.isUrgent ? 'text-danger-600 font-medium' : 'text-neutral-500'}`}>
                {deadline.text}
              </span>
            </div>
          </div>
          
          <ChevronRight className={`w-5 h-5 text-neutral-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-neutral-200" onClick={e => e.stopPropagation()}>
            <p className="text-neutral-600 text-sm mb-4">{milestone.description}</p>
            
            {/* Submission */}
            {milestone.submission && (
              <div className="bg-white rounded-lg p-4 mb-4 border border-neutral-200">
                <p className="font-medium text-sm text-neutral-900 mb-2">Submission</p>
                <p className="text-sm text-neutral-600 mb-3">{milestone.submission.description}</p>
                
                {/* Attachments */}
                {milestone.submission.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {milestone.submission.attachments.map((att) => (
                      <a 
                        key={att.id}
                        href={att.url}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-lg text-sm hover:bg-neutral-200 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-neutral-500" />
                        {att.name}
                        <ExternalLink className="w-3 h-3 text-neutral-400" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* AI Recommendation - Only for submitted milestones */}
            {milestone.status === 'submitted' && milestone.aiAnalysis && (
              <div className="mb-4">
                <AIRecommendationBox analysis={milestone.aiAnalysis} />
              </div>
            )}

            {/* Action Buttons - Only for submitted */}
            {milestone.status === 'submitted' && (
              <div className="flex gap-3">
                <Button 
                  variant="success" 
                  onClick={onApprove}
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                >
                  Approve & Release Payment
                </Button>
                <Button 
                  variant="secondary"
                  onClick={onReject}
                >
                  Request Revision
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Approve Modal
function ApproveModal({ 
  milestone, 
  currency,
  onConfirm, 
  onClose 
}: { 
  milestone: Milestone
  currency: string
  onConfirm: () => void
  onClose: () => void 
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-slide-up">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-success-600" />
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <h3 className="font-display text-xl font-bold text-neutral-900 mb-2">
          Approve & Release Payment?
        </h3>
        
        <p className="text-neutral-600 mb-6">
          You're about to approve <strong>{milestone.title}</strong> and release{' '}
          <strong>{formatAmount(milestone.amount, currency)}</strong> to the freelancer.
        </p>
        
        <div className="p-4 bg-warning-50 border border-warning-200 rounded-xl mb-6">
          <p className="text-sm text-warning-800">
            <strong>This action cannot be undone.</strong> Make sure you've reviewed the work thoroughly.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="success" onClick={onConfirm} className="flex-1">
            Approve & Release
          </Button>
        </div>
      </div>
    </div>
  )
}

// Reject Modal
function RejectModal({ 
  milestone, 
  onConfirm, 
  onClose 
}: { 
  milestone: Milestone
  onConfirm: () => void
  onClose: () => void 
}) {
  const [reason, setReason] = useState('')
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-slide-up">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-warning-600" />
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <h3 className="font-display text-xl font-bold text-neutral-900 mb-2">
          Request Revision
        </h3>
        
        <p className="text-neutral-600 mb-4">
          Let the freelancer know what needs to be changed for <strong>{milestone.title}</strong>.
        </p>
        
        <textarea
          className="input min-h-[100px] resize-none mb-6"
          placeholder="Describe what changes are needed..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm} className="flex-1" disabled={!reason.trim()}>
            Send Feedback
          </Button>
        </div>
      </div>
    </div>
  )
}
