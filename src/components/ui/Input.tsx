'use client'

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-3 rounded-xl border bg-white text-neutral-800 placeholder-neutral-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
              'transition-all duration-200',
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              error ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : 'border-neutral-200',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>
        {hint && !error && (
          <p className="text-sm text-neutral-500 mt-1.5">{hint}</p>
        )}
        {error && (
          <p className="text-sm text-danger-500 mt-1.5">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
