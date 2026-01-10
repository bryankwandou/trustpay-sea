'use client'

import * as React from 'react'
import { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Toast Types
type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  updateToast: (id: string, toast: Partial<Omit<Toast, 'id'>>) => void
  success: (title: string, description?: string) => string
  error: (title: string, description?: string) => string
  warning: (title: string, description?: string) => string
  info: (title: string, description?: string) => string
  loading: (title: string, description?: string) => string
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    }
  ) => Promise<T>
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Toast Icon Component
function ToastIcon({ type }: { type: ToastType }) {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-success-500" />
    case 'error':
      return <AlertCircle className="w-5 h-5 text-error-500" />
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-warning-500" />
    case 'info':
      return <Info className="w-5 h-5 text-primary-500" />
    case 'loading':
      return <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
    default:
      return null
  }
}

// Single Toast Component
function ToastItem({ 
  toast, 
  onRemove 
}: { 
  toast: Toast
  onRemove: (id: string) => void 
}) {
  const bgColors = {
    success: 'bg-success-50 border-success-200',
    error: 'bg-error-50 border-error-200',
    warning: 'bg-warning-50 border-warning-200',
    info: 'bg-primary-50 border-primary-200',
    loading: 'bg-neutral-50 border-neutral-200'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        relative flex items-start gap-3 p-4 rounded-xl border shadow-card
        backdrop-blur-sm max-w-md w-full pointer-events-auto
        ${bgColors[toast.type]}
      `}
    >
      <ToastIcon type={toast.type} />
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-neutral-900 text-sm">
          {toast.title}
        </p>
        {toast.description && (
          <p className="text-sm text-neutral-600 mt-1">
            {toast.description}
          </p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {toast.type !== 'loading' && (
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
        >
          <X className="w-4 h-4 text-neutral-400" />
        </button>
      )}
    </motion.div>
  )
}

// Toast Container
function ToastContainer({ 
  toasts, 
  onRemove 
}: { 
  toasts: Toast[]
  onRemove: (id: string) => void 
}) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Toast Provider
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const generateId = () => Math.random().toString(36).substring(2, 9)

  const addToast = useCallback((toast: Omit<Toast, 'id'>): string => {
    const id = generateId()
    const newToast: Toast = { ...toast, id }
    
    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration (default 5000ms, except loading)
    if (toast.type !== 'loading') {
      const duration = toast.duration || 5000
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const updateToast = useCallback((id: string, updates: Partial<Omit<Toast, 'id'>>) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    )
  }, [])

  const success = useCallback((title: string, description?: string) => {
    return addToast({ type: 'success', title, description })
  }, [addToast])

  const error = useCallback((title: string, description?: string) => {
    return addToast({ type: 'error', title, description })
  }, [addToast])

  const warning = useCallback((title: string, description?: string) => {
    return addToast({ type: 'warning', title, description })
  }, [addToast])

  const info = useCallback((title: string, description?: string) => {
    return addToast({ type: 'info', title, description })
  }, [addToast])

  const loading = useCallback((title: string, description?: string) => {
    return addToast({ type: 'loading', title, description })
  }, [addToast])

  const promise = useCallback(async <T,>(
    promiseToResolve: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ): Promise<T> => {
    const id = addToast({ type: 'loading', title: messages.loading })
    
    try {
      const result = await promiseToResolve
      updateToast(id, { type: 'success', title: messages.success })
      
      // Auto remove after success
      setTimeout(() => removeToast(id), 3000)
      
      return result
    } catch (err) {
      updateToast(id, { 
        type: 'error', 
        title: messages.error,
        description: err instanceof Error ? err.message : 'Unknown error'
      })
      
      // Auto remove after error
      setTimeout(() => removeToast(id), 5000)
      
      throw err
    }
  }, [addToast, updateToast, removeToast])

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        updateToast,
        success,
        error,
        warning,
        info,
        loading,
        promise
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

// Export individual components for direct use
export { ToastContainer, ToastItem }
