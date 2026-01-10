'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface Step {
  id: number
  title: string
  description?: string
}

interface ProgressStepsProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function ProgressSteps({ steps, currentStep, className }: ProgressStepsProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id
        const isCurrent = currentStep === step.id
        const isLast = index === steps.length - 1

        return (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300',
                  isCompleted && 'bg-success-500 text-white',
                  isCurrent && 'bg-primary-500 text-white ring-4 ring-primary-100',
                  !isCompleted && !isCurrent && 'bg-neutral-100 text-neutral-400'
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              
              {/* Step Label - Only visible on md+ */}
              <div className="hidden md:block mt-2 text-center">
                <p className={cn(
                  'text-sm font-medium',
                  isCurrent ? 'text-primary-600' : isCompleted ? 'text-success-600' : 'text-neutral-400'
                )}>
                  {step.title}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div
                className={cn(
                  'w-16 md:w-24 h-1 mx-2 rounded-full transition-all duration-500',
                  isCompleted ? 'bg-success-500' : 'bg-neutral-200'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// Vertical variant for mobile or sidebar
export function ProgressStepsVertical({ steps, currentStep, className }: ProgressStepsProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id
        const isCurrent = currentStep === step.id
        const isLast = index === steps.length - 1

        return (
          <div key={step.id} className="flex">
            {/* Step indicator column */}
            <div className="flex flex-col items-center mr-4">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                  isCompleted && 'bg-success-500 text-white',
                  isCurrent && 'bg-primary-500 text-white',
                  !isCompleted && !isCurrent && 'bg-neutral-100 text-neutral-400'
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
              
              {/* Connector */}
              {!isLast && (
                <div
                  className={cn(
                    'w-0.5 h-8 my-1 transition-all duration-500',
                    isCompleted ? 'bg-success-500' : 'bg-neutral-200'
                  )}
                />
              )}
            </div>

            {/* Step content */}
            <div className={cn('pb-8', isLast && 'pb-0')}>
              <p className={cn(
                'font-medium',
                isCurrent ? 'text-primary-600' : isCompleted ? 'text-neutral-900' : 'text-neutral-400'
              )}>
                {step.title}
              </p>
              {step.description && (
                <p className="text-sm text-neutral-500 mt-0.5">{step.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
