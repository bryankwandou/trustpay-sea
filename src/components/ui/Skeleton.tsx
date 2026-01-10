'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export function Skeleton({ className = '', animate = true }: SkeletonProps) {
  return (
    <div
      className={`
        bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200
        rounded-lg
        ${animate ? 'animate-shimmer bg-[length:200%_100%]' : ''}
        ${className}
      `}
    />
  );
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center gap-4 pt-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
}

// Deal Card Skeleton
export function DealCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      
      {/* Amount */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-28 rounded-xl" />
      </div>
    </div>
  );
}

// Dashboard Stats Skeleton
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

// Milestone Card Skeleton
export function MilestoneSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

// Profile Skeleton
export function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

// Full Page Loading
export function PageLoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-8"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        {/* Stats */}
        <StatsSkeleton />

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <DealCardSkeleton />
            <DealCardSkeleton />
            <DealCardSkeleton />
          </div>
          <div className="space-y-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Button Loading State
export function ButtonLoading({ text = 'Processing...' }: { text?: string }) {
  return (
    <span className="flex items-center gap-2">
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </motion.span>
      {text}
    </span>
  );
}
