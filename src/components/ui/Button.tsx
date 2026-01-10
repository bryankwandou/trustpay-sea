'use client'

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const variants = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-card hover:shadow-card-hover',
      secondary: 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300',
      success: 'bg-success-500 text-white hover:bg-success-600 active:bg-success-700 shadow-card hover:shadow-card-hover',
      danger: 'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700',
      ghost: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800'
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'
