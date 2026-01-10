'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'pending' | 'confirming' | 'success' | 'error';
  title?: string;
  message?: string;
  txHash?: string;
  explorerUrl?: string;
  onRetry?: () => void;
}

export function TransactionModal({
  isOpen,
  onClose,
  status,
  title,
  message,
  txHash,
  explorerUrl = 'https://sepolia-blockscout.lisk.com',
  onRetry
}: TransactionModalProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (status === 'pending' || status === 'confirming') {
      const interval = setInterval(() => {
        setDots(d => d.length >= 3 ? '' : d + '.');
      }, 500);
      return () => clearInterval(interval);
    }
  }, [status]);

  const statusConfig = {
    pending: {
      icon: (
        <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
      ),
      title: title || 'Waiting for Confirmation',
      message: message || `Please confirm in your wallet${dots}`,
      color: 'blue'
    },
    confirming: {
      icon: (
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      ),
      title: title || 'Processing Transaction',
      message: message || `Waiting for blockchain confirmation${dots}`,
      color: 'amber'
    },
    success: {
      icon: (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center"
        >
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-8 h-8 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        </motion.div>
      ),
      title: title || 'Transaction Successful!',
      message: message || 'Your transaction has been confirmed.',
      color: 'emerald'
    },
    error: {
      icon: (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center"
        >
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.div>
      ),
      title: title || 'Transaction Failed',
      message: message || 'Something went wrong. Please try again.',
      color: 'red'
    }
  };

  const config = statusConfig[status];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={status === 'success' || status === 'error' ? onClose : undefined}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-sm w-full p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-6">
              {config.icon}
            </div>

            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {config.title}
            </h3>

            <p className="text-slate-600 mb-6">
              {config.message}
            </p>

            {txHash && (
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <p className="text-xs text-slate-500 mb-1">Transaction ID</p>
                <a
                  href={`${explorerUrl}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline font-mono break-all"
                >
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </a>
              </div>
            )}

            <div className="flex gap-3">
              {status === 'error' && onRetry && (
                <button
                  onClick={onRetry}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
                >
                  Try Again
                </button>
              )}
              
              {(status === 'success' || status === 'error') && (
                <button
                  onClick={onClose}
                  className={`flex-1 py-3 px-4 font-medium rounded-xl transition-colors ${
                    status === 'success'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {status === 'success' ? 'Done' : 'Close'}
                </button>
              )}
            </div>

            {(status === 'pending' || status === 'confirming') && (
              <p className="text-xs text-slate-400 mt-4">
                Do not close this window
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Simple confirmation modal
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'default';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false
}: ConfirmModalProps) {
  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-amber-500 hover:bg-amber-600',
    default: 'bg-blue-600 hover:bg-blue-700'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {title}
            </h3>
            <p className="text-slate-600 mb-6">
              {message}
            </p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 text-white font-medium rounded-xl transition-colors disabled:opacity-50 ${variantStyles[variant]}`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
