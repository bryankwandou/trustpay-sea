// Types untuk TrustPay SEA
// Semua naming menggunakan bahasa bisnis, bukan crypto jargon

export type DealStatus = 
  | 'draft'           // Deal belum dikirim
  | 'pending'         // Menunggu client fund
  | 'funded'          // Dana sudah masuk escrow
  | 'in_progress'     // Ada milestone aktif
  | 'completed'       // Semua milestone selesai
  | 'disputed'        // Ada dispute
  | 'cancelled'       // Deal dibatalkan

export type MilestoneStatus =
  | 'pending'         // Belum mulai
  | 'active'          // Sedang dikerjakan
  | 'submitted'       // Sudah disubmit, menunggu review
  | 'approved'        // Disetujui, dana direlease
  | 'rejected'        // Ditolak, perlu revisi
  | 'disputed'        // Ada dispute

export type UserRole = 'freelancer' | 'client'

// === CORE ENTITIES ===

export interface User {
  address: string           // Wallet address (internal only)
  displayName?: string      // Nama tampilan (opsional)
  email?: string            // Email untuk notifikasi
  avatar?: string
  role?: UserRole
  createdAt: Date
}

export interface Milestone {
  id: string
  title: string
  description: string
  amount: number            // Dalam USDC/USDT
  currency: 'USDC' | 'USDT'
  deadline: Date
  status: MilestoneStatus
  order: number             // Urutan milestone
  
  // Submission
  submission?: MilestoneSubmission
  
  // AI Analysis (optional, readonly)
  aiAnalysis?: AIAnalysis
  
  // Timestamps
  createdAt: Date
  startedAt?: Date
  submittedAt?: Date
  approvedAt?: Date
  releasedAt?: Date
}

export interface MilestoneSubmission {
  id: string
  milestoneId: string
  description: string
  attachments: Attachment[]
  submittedAt: Date
  submittedBy: string       // Address
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string              // MIME type
  size: number              // In bytes
}

export interface Deal {
  id: string
  title: string
  description: string
  
  // Parties
  freelancer: string        // Wallet address
  client: string            // Wallet address
  mediator?: string         // Optional mediator address
  
  // Financial
  totalAmount: number
  currency: 'USDC' | 'USDT'
  serviceFee: number        // Platform fee
  
  // Status
  status: DealStatus
  
  // Milestones
  milestones: Milestone[]
  
  // Dispute (if any)
  dispute?: Dispute
  
  // Contract reference
  contractAddress?: string
  chainId?: number
  
  // Timestamps
  createdAt: Date
  fundedAt?: Date
  completedAt?: Date
}

// === AI ANALYSIS ===
// AI hanya memberi rekomendasi, TIDAK membuat keputusan

export interface AIAnalysis {
  id: string
  milestoneId: string
  
  // Recommendation - bukan keputusan
  recommendation: 'approve' | 'review_needed' | 'reject_suggested'
  confidence: number        // 0-100
  
  // Reasoning - harus explainable
  summary: string
  reasons: string[]
  concerns?: string[]
  
  // Metadata
  analyzedAt: Date
  modelVersion: string
}

// === DISPUTE ===

export interface Dispute {
  id: string
  dealId: string
  milestoneId: string
  
  status: 'open' | 'under_review' | 'resolved'
  
  // Pihak yang memulai dispute
  initiatedBy: string       // Address
  initiatedAt: Date
  
  // Arguments dari kedua pihak
  freelancerArgument?: DisputeArgument
  clientArgument?: DisputeArgument
  
  // AI Pre-analysis (read-only, untuk info saja)
  aiPreAnalysis?: AIDisputeAnalysis
  
  // Resolution (keputusan MANUSIA)
  resolution?: DisputeResolution
}

export interface DisputeArgument {
  description: string
  evidence: Attachment[]
  submittedAt: Date
}

export interface AIDisputeAnalysis {
  summary: string
  freelancerStrengths: string[]
  clientStrengths: string[]
  suggestedResolution: string
  confidence: number
  disclaimer: string        // WAJIB: "This is AI analysis only. Final decision is made by human."
}

export interface DisputeResolution {
  decision: 'favor_freelancer' | 'favor_client' | 'split'
  splitPercentage?: {
    freelancer: number
    client: number
  }
  reason: string
  resolvedBy: string        // Mediator atau mutual agreement
  resolvedAt: Date
}

// === FORM TYPES ===

export interface CreateDealForm {
  title: string
  description: string
  counterpartyEmail?: string
  counterpartyAddress?: string
  milestones: CreateMilestoneForm[]
  mediatorAddress?: string
  currency: 'USDC' | 'USDT'
}

export interface CreateMilestoneForm {
  title: string
  description: string
  amount: number
  deadline: Date
}

// === UI STATE ===

export interface DealFilters {
  status?: DealStatus[]
  role?: UserRole
  dateRange?: {
    from: Date
    to: Date
  }
}

export interface Notification {
  id: string
  type: 'deal_created' | 'deal_funded' | 'milestone_submitted' | 'milestone_approved' | 'dispute_opened'
  title: string
  message: string
  dealId?: string
  read: boolean
  createdAt: Date
}

// === MARKETPLACE TYPES ===

export type ServiceCategory = 
  | 'design'
  | 'development'
  | 'writing'
  | 'marketing'
  | 'video'
  | 'translation'
  | 'consulting'
  | 'other'

export type ServiceStatus = 'active' | 'paused' | 'draft'

export interface Service {
  id: string
  title: string
  description: string
  shortDescription: string
  
  // Provider
  providerId: string        // Wallet address
  providerName: string
  providerAvatar?: string
  providerRating: number    // 0-5
  providerReviewCount: number
  
  // Categorization
  category: ServiceCategory
  tags: string[]
  
  // Pricing
  startingPrice: number
  currency: 'USDC' | 'USDT'
  pricingType: 'fixed' | 'hourly' | 'milestone'
  
  // Packages (for fixed pricing)
  packages?: ServicePackage[]
  
  // Media
  thumbnail: string
  gallery: string[]
  
  // Stats
  completedOrders: number
  responseTime: string      // e.g., "< 1 hour"
  
  // Status
  status: ServiceStatus
  featured: boolean
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}

export interface ServicePackage {
  id: string
  name: string              // Basic, Standard, Premium
  description: string
  price: number
  deliveryDays: number
  revisions: number
  features: string[]
}

export interface ServiceReview {
  id: string
  serviceId: string
  dealId: string
  
  reviewerId: string        // Client wallet
  reviewerName: string
  
  rating: number            // 1-5
  comment: string
  
  // Response from provider
  response?: string
  respondedAt?: Date
  
  createdAt: Date
}

export interface ServiceFilters {
  category?: ServiceCategory
  minPrice?: number
  maxPrice?: number
  minRating?: number
  deliveryDays?: number
  search?: string
  sortBy?: 'popular' | 'newest' | 'price_low' | 'price_high' | 'rating'
}

// === MESSAGING TYPES ===

export interface Conversation {
  id: string
  participants: string[]    // Wallet addresses
  dealId?: string           // Optional link to deal
  
  lastMessage?: Message
  unreadCount: number
  
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  conversationId: string
  
  senderId: string          // Wallet address
  senderName?: string
  
  content: string
  attachments?: Attachment[]
  
  // Status
  read: boolean
  readAt?: Date
  
  // For system messages
  isSystem: boolean
  systemType?: 'deal_created' | 'milestone_submitted' | 'payment_released'
  
  createdAt: Date
}

// === DASHBOARD STATS ===

export interface UserStats {
  totalDeals: number
  activeDeals: number
  completedDeals: number
  disputedDeals: number
  
  totalEarnings: number     // As freelancer
  totalSpent: number        // As client
  pendingPayments: number
  
  averageRating: number
  reviewCount: number
  
  responseRate: number      // Percentage
  completionRate: number    // Percentage
  
  // Time-based
  thisMonthEarnings: number
  thisMonthDeals: number
}

export interface ActivityItem {
  id: string
  type: 'deal' | 'milestone' | 'payment' | 'dispute' | 'review'
  action: string
  description: string
  amount?: number
  dealId?: string
  timestamp: Date
}
