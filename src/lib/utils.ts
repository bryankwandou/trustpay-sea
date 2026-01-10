import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { DealStatus, MilestoneStatus } from './types'

// === CLASS UTILS ===

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// === FORMATTING ===

/**
 * Format amount untuk display
 * Tidak menampilkan desimal jika tidak perlu
 */
export function formatAmount(amount: number, currency: string = 'USDC'): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  }).format(amount)
  
  return `${formatted} ${currency}`
}

/**
 * Format currency untuk input
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value)
}

/**
 * Format wallet address - singkat dan tidak intimidating
 * "0x1234...5678" -> "Account ...5678"
 */
export function formatAddress(address: string): string {
  if (!address) return ''
  const last4 = address.slice(-4)
  return `Account ...${last4}`
}

/**
 * Format full address untuk copy
 */
export function formatFullAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Format date - friendly format
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`
    }
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
  }
  
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return formatDate(date)
}

/**
 * Format deadline - highlight jika mendekati
 */
export function formatDeadline(deadline: Date | string): { text: string; isUrgent: boolean } {
  const d = new Date(deadline)
  const now = new Date()
  const diffMs = d.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return { text: 'Overdue', isUrgent: true }
  }
  
  if (diffDays === 0) {
    return { text: 'Due today', isUrgent: true }
  }
  
  if (diffDays === 1) {
    return { text: 'Due tomorrow', isUrgent: true }
  }
  
  if (diffDays <= 3) {
    return { text: `Due in ${diffDays} days`, isUrgent: true }
  }
  
  return { text: formatDate(d), isUrgent: false }
}

// === STATUS HELPERS ===

/**
 * Get user-friendly status label
 * Tidak menggunakan istilah teknis
 */
export function getDealStatusLabel(status: DealStatus): string {
  const labels: Record<DealStatus, string> = {
    draft: 'Draft',
    pending: 'Waiting for Payment',
    funded: 'Ready to Start',
    in_progress: 'In Progress',
    completed: 'Completed',
    disputed: 'Under Review',
    cancelled: 'Cancelled'
  }
  return labels[status]
}

export function getMilestoneStatusLabel(status: MilestoneStatus): string {
  const labels: Record<MilestoneStatus, string> = {
    pending: 'Not Started',
    active: 'In Progress',
    submitted: 'Waiting for Approval',
    approved: 'Approved',
    rejected: 'Needs Revision',
    disputed: 'Under Review'
  }
  return labels[status]
}

/**
 * Get status color class
 */
export function getDealStatusColor(status: DealStatus): string {
  const colors: Record<DealStatus, string> = {
    draft: 'badge-pending',
    pending: 'badge-pending',
    funded: 'badge-active',
    in_progress: 'badge-active',
    completed: 'badge-completed',
    disputed: 'badge-disputed',
    cancelled: 'bg-neutral-100 text-neutral-600'
  }
  return colors[status]
}

export function getMilestoneStatusColor(status: MilestoneStatus): string {
  const colors: Record<MilestoneStatus, string> = {
    pending: 'bg-neutral-100 text-neutral-600',
    active: 'badge-active',
    submitted: 'badge-pending',
    approved: 'badge-completed',
    rejected: 'badge-disputed',
    disputed: 'badge-disputed'
  }
  return colors[status]
}

// === PROGRESS CALCULATION ===

/**
 * Calculate deal progress percentage
 */
export function calculateDealProgress(milestones: { status: MilestoneStatus }[]): number {
  if (milestones.length === 0) return 0
  
  const completed = milestones.filter(m => m.status === 'approved').length
  return Math.round((completed / milestones.length) * 100)
}

/**
 * Get current milestone index (0-based)
 */
export function getCurrentMilestoneIndex(milestones: { status: MilestoneStatus }[]): number {
  const activeIndex = milestones.findIndex(m => 
    m.status === 'active' || m.status === 'submitted'
  )
  
  if (activeIndex >= 0) return activeIndex
  
  // Find first pending milestone
  const pendingIndex = milestones.findIndex(m => m.status === 'pending')
  if (pendingIndex >= 0) return pendingIndex
  
  // All completed
  return milestones.length - 1
}

// === VALIDATION ===

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// === COPY TO CLIPBOARD ===

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// === ID GENERATION ===

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// === SERVICE FEE CALCULATION ===

export function calculateServiceFee(amount: number): number {
  // 2% fee
  return amount * 0.02
}

export function calculateTotalWithFee(amount: number): number {
  return amount + calculateServiceFee(amount)
}
