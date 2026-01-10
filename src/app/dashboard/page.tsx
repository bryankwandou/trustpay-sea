'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  FileText,
  TrendingUp
} from 'lucide-react'
import { Button, Card, Badge, Input } from '@/components/ui'
import { Footer } from '@/components/layout'
import { 
  formatAmount, 
  formatRelativeTime, 
  getDealStatusLabel, 
  getDealStatusColor,
  calculateDealProgress 
} from '@/lib/utils'
import { Deal, DealStatus } from '@/lib/types'

// Mock data for demo
const MOCK_DEALS: Deal[] = [
  {
    id: '1',
    title: 'E-commerce Website Development',
    description: 'Full stack e-commerce website with payment integration',
    freelancer: '0x1234567890123456789012345678901234567890',
    client: '0x0987654321098765432109876543210987654321',
    totalAmount: 5000,
    currency: 'USDC',
    serviceFee: 100,
    status: 'in_progress',
    milestones: [
      { id: 'm1', title: 'Design Mockups', description: '', amount: 1000, currency: 'USDC', deadline: new Date(), status: 'approved', order: 1, createdAt: new Date() },
      { id: 'm2', title: 'Frontend Development', description: '', amount: 2000, currency: 'USDC', deadline: new Date(), status: 'submitted', order: 2, createdAt: new Date() },
      { id: 'm3', title: 'Backend & Testing', description: '', amount: 2000, currency: 'USDC', deadline: new Date(), status: 'pending', order: 3, createdAt: new Date() },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    fundedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Logo Design Package',
    description: 'Brand identity design including logo, colors, and typography',
    freelancer: '0x1234567890123456789012345678901234567890',
    client: '0x0987654321098765432109876543210987654321',
    totalAmount: 800,
    currency: 'USDC',
    serviceFee: 16,
    status: 'funded',
    milestones: [
      { id: 'm1', title: 'Initial Concepts', description: '', amount: 300, currency: 'USDC', deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: 'active', order: 1, createdAt: new Date() },
      { id: 'm2', title: 'Final Deliverables', description: '', amount: 500, currency: 'USDC', deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), status: 'pending', order: 2, createdAt: new Date() },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    fundedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Mobile App UI/UX Design',
    description: 'Complete UI/UX design for iOS and Android app',
    freelancer: '0x1234567890123456789012345678901234567890',
    client: '0x0987654321098765432109876543210987654321',
    totalAmount: 3500,
    currency: 'USDT',
    serviceFee: 70,
    status: 'completed',
    milestones: [
      { id: 'm1', title: 'Wireframes', description: '', amount: 1000, currency: 'USDT', deadline: new Date(), status: 'approved', order: 1, createdAt: new Date() },
      { id: 'm2', title: 'UI Design', description: '', amount: 1500, currency: 'USDT', deadline: new Date(), status: 'approved', order: 2, createdAt: new Date() },
      { id: 'm3', title: 'Prototype', description: '', amount: 1000, currency: 'USDT', deadline: new Date(), status: 'approved', order: 3, createdAt: new Date() },
    ],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    fundedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    title: 'Content Writing - Blog Series',
    description: '10 SEO-optimized blog articles',
    freelancer: '0x1234567890123456789012345678901234567890',
    client: '0x0987654321098765432109876543210987654321',
    totalAmount: 1200,
    currency: 'USDC',
    serviceFee: 24,
    status: 'disputed',
    milestones: [
      { id: 'm1', title: 'First 5 Articles', description: '', amount: 600, currency: 'USDC', deadline: new Date(), status: 'disputed', order: 1, createdAt: new Date() },
      { id: 'm2', title: 'Final 5 Articles', description: '', amount: 600, currency: 'USDC', deadline: new Date(), status: 'pending', order: 2, createdAt: new Date() },
    ],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    fundedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
  },
]

type FilterType = 'all' | 'active' | 'completed' | 'disputed'

export default function DashboardPage() {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const filteredDeals = deals.filter(deal => {
    // Search filter
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Status filter
    let matchesFilter = true
    if (activeFilter === 'active') {
      matchesFilter = ['funded', 'in_progress', 'pending'].includes(deal.status)
    } else if (activeFilter === 'completed') {
      matchesFilter = deal.status === 'completed'
    } else if (activeFilter === 'disputed') {
      matchesFilter = deal.status === 'disputed'
    }
    
    return matchesSearch && matchesFilter
  })

  // Stats
  const stats = {
    active: deals.filter(d => ['funded', 'in_progress', 'pending'].includes(d.status)).length,
    completed: deals.filter(d => d.status === 'completed').length,
    totalValue: deals.reduce((sum, d) => sum + d.totalAmount, 0),
    disputed: deals.filter(d => d.status === 'disputed').length,
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-main py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-neutral-900">
              My Deals
            </h1>
            <p className="text-neutral-600 mt-1">
              Manage your projects and payments
            </p>
          </div>
          <Link href="/create">
            <Button leftIcon={<Plus className="w-5 h-5" />}>
              Create New Deal
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{stats.active}</p>
                <p className="text-sm text-neutral-500">Active</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{stats.completed}</p>
                <p className="text-sm text-neutral-500">Completed</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">${stats.totalValue.toLocaleString()}</p>
                <p className="text-sm text-neutral-500">Total Value</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-danger-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-danger-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{stats.disputed}</p>
                <p className="text-sm text-neutral-500">Needs Attention</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'completed', 'disputed'] as FilterType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                  activeFilter === filter
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Deals List */}
        <div className="space-y-4">
          {filteredDeals.length === 0 ? (
            <Card className="text-center py-12">
              <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="font-semibold text-neutral-900 mb-2">No deals found</h3>
              <p className="text-neutral-500 mb-6">
                {searchQuery ? 'Try a different search term' : 'Create your first secure deal'}
              </p>
              <Link href="/create">
                <Button>Create New Deal</Button>
              </Link>
            </Card>
          ) : (
            filteredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

// Deal Card Component
function DealCard({ deal }: { deal: Deal }) {
  const progress = calculateDealProgress(deal.milestones)
  const completedMilestones = deal.milestones.filter(m => m.status === 'approved').length
  
  const statusVariantMap: Record<DealStatus, 'pending' | 'active' | 'completed' | 'disputed' | 'neutral'> = {
    draft: 'neutral',
    pending: 'pending',
    funded: 'active',
    in_progress: 'active',
    completed: 'completed',
    disputed: 'disputed',
    cancelled: 'neutral'
  }

  return (
    <Link href={`/deal/${deal.id}`}>
      <Card variant="hover" className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg text-neutral-900 truncate">
                {deal.title}
              </h3>
              <Badge variant={statusVariantMap[deal.status]}>
                {getDealStatusLabel(deal.status)}
              </Badge>
            </div>
            
            <p className="text-neutral-500 text-sm mb-3 line-clamp-1">
              {deal.description}
            </p>
            
            {/* Progress */}
            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-xs">
                <div className="flex justify-between text-xs text-neutral-500 mb-1">
                  <span>{completedMilestones} of {deal.milestones.length} milestones</span>
                  <span>{progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className={deal.status === 'completed' ? 'progress-fill-success' : 'progress-fill'}
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>
              <span className="text-xs text-neutral-400">
                {formatRelativeTime(deal.createdAt)}
              </span>
            </div>
          </div>

          {/* Right: Amount */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-xl text-neutral-900">
                {formatAmount(deal.totalAmount, deal.currency)}
              </p>
              <p className="text-sm text-neutral-500">Total Value</p>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400" />
          </div>
        </div>
      </Card>
    </Link>
  )
}
