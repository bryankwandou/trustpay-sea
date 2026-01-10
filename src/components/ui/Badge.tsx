'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'pending' | 'active' | 'completed' | 'disputed' | 'neutral' | 'warning'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-primary-100 text-primary-700',
      pending: 'bg-warning-100 text-warning-700',
      warning: 'bg-amber-100 text-amber-700',
      active: 'bg-primary-100 text-primary-700',
      completed: 'bg-success-100 text-success-700',
      disputed: 'bg-danger-100 text-danger-700',
      neutral: 'bg-neutral-100 text-neutral-600'
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full',
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'
