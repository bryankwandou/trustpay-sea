'use client';

import { motion } from 'framer-motion';

// Skeleton base component
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] rounded ${className}`}
    />
  );
}

// Card skeleton
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="flex justify-between">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

// Deal card skeleton
export function SkeletonDealCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

// Stats skeleton
export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
          <Skeleton className="h-3 w-16 mb-2" />
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
}

// Table skeleton
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="border-b border-slate-200 p-4">
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="border-b border-slate-100 p-4 last:border-0">
          <div className="flex gap-4">
            {[...Array(4)].map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Full page loading
export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative w-16 h-16 mx-auto mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border-4 border-blue-200 rounded-full"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full"
          />
        </div>
        <p className="text-slate-600 font-medium">Loading...</p>
      </motion.div>
    </div>
  );
}

// Button loading spinner
export function ButtonSpinner({ className = '' }: { className?: string }) {
  return (
    <svg 
      className={`animate-spin h-4 w-4 ${className}`} 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Transaction pending animation
export function TransactionPending() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="relative mb-6">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </motion.div>
        </motion.div>
        
        {/* Ripple effect */}
        <motion.div
          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 bg-blue-200 rounded-full"
        />
      </div>
      
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Processing Transaction</h3>
      <p className="text-slate-600 text-center max-w-xs">
        Please wait while we confirm your transaction on the blockchain...
      </p>
      
      <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
        <ButtonSpinner className="text-slate-400" />
        <span>This may take a few moments</span>
      </div>
    </motion.div>
  );
}

// Success animation
export function TransactionSuccess({ 
  title = 'Transaction Successful!',
  message = 'Your transaction has been confirmed.',
  txHash
}: { 
  title?: string;
  message?: string;
  txHash?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
      >
        <motion.svg 
          className="w-10 h-10 text-emerald-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={3} 
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </motion.svg>
      </motion.div>
      
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-center max-w-xs mb-4">{message}</p>
      
      {txHash && (
        <a 
          href={`https://sepolia-blockscout.lisk.com/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          View on Explorer
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </motion.div>
  );
}
