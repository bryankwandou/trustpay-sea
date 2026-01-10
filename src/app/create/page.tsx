'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Plus, Trash2, Calendar, DollarSign, User, FileText, Shield } from 'lucide-react'
import { Button, Input, Card, ProgressSteps } from '@/components/ui'
import { useCreateDealStore } from '@/lib/store'
import { formatAmount, calculateServiceFee, calculateTotalWithFee, generateId } from '@/lib/utils'

const STEPS = [
  { id: 1, title: 'Project Details' },
  { id: 2, title: 'Milestones' },
  { id: 3, title: 'Payment' },
  { id: 4, title: 'Review' }
]

export default function CreateDealPage() {
  const router = useRouter()
  const { 
    currentStep, 
    formData, 
    errors,
    nextStep, 
    prevStep, 
    updateFormData,
    addMilestone,
    updateMilestone,
    removeMilestone,
    setErrors,
    resetForm
  } = useCreateDealStore()

  const handleNext = () => {
    const stepErrors = validateStep(currentStep)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }
    setErrors({})
    nextStep()
  }

  const handleBack = () => {
    setErrors({})
    prevStep()
  }

  const validateStep = (step: number): Record<string, string> => {
    const errors: Record<string, string> = {}
    
    if (step === 1) {
      if (!formData.title.trim()) errors.title = 'Project name is required'
      if (!formData.description.trim()) errors.description = 'Description is required'
    }
    
    if (step === 2) {
      formData.milestones.forEach((m, i) => {
        if (!m.title.trim()) errors[`milestone_${i}_title`] = 'Title required'
        if (m.amount <= 0) errors[`milestone_${i}_amount`] = 'Amount must be greater than 0'
      })
    }
    
    return errors
  }

  const totalAmount = formData.milestones.reduce((sum, m) => sum + (m.amount || 0), 0)

  const handleSubmit = async () => {
    // TODO: Connect to smart contract
    const dealId = generateId()
    console.log('Creating deal:', { ...formData, id: dealId, totalAmount })
    
    // Reset and redirect
    resetForm()
    router.push(`/deal/${dealId}`)
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container-main">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="font-display text-3xl font-bold text-neutral-900">
            Create Secure Deal
          </h1>
          <p className="text-neutral-600 mt-2">
            Set up your project milestones and payment terms
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <ProgressSteps steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Form Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 1 && (
                    <StepProjectDetails 
                      formData={formData} 
                      errors={errors}
                      updateFormData={updateFormData} 
                    />
                  )}
                  {currentStep === 2 && (
                    <StepMilestones
                      milestones={formData.milestones}
                      errors={errors}
                      addMilestone={addMilestone}
                      updateMilestone={updateMilestone}
                      removeMilestone={removeMilestone}
                    />
                  )}
                  {currentStep === 3 && (
                    <StepPayment
                      formData={formData}
                      totalAmount={totalAmount}
                      updateFormData={updateFormData}
                    />
                  )}
                  {currentStep === 4 && (
                    <StepReview
                      formData={formData}
                      totalAmount={totalAmount}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-neutral-100">
                <Button
                  variant="secondary"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>

                {currentStep < 4 ? (
                  <Button
                    onClick={handleNext}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    onClick={handleSubmit}
                    rightIcon={<Shield className="w-4 h-4" />}
                  >
                    Create Secure Deal
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Side Summary - Always visible */}
          <div className="lg:col-span-1">
            <DealSummary formData={formData} totalAmount={totalAmount} />
          </div>
        </div>
      </div>
    </div>
  )
}

// === STEP 1: Project Details ===
function StepProjectDetails({ formData, errors, updateFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-neutral-900 mb-1">
          Project Details
        </h2>
        <p className="text-neutral-500 text-sm">
          Tell us about your project
        </p>
      </div>

      <Input
        label="Project Name"
        placeholder="e.g., Website Redesign for Company XYZ"
        value={formData.title}
        onChange={(e) => updateFormData({ title: e.target.value })}
        error={errors.title}
        leftIcon={<FileText className="w-5 h-5" />}
      />

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Project Description
        </label>
        <textarea
          className="input min-h-[120px] resize-none"
          placeholder="Describe the work to be done, deliverables, and any important requirements..."
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
        />
        {errors.description && (
          <p className="text-sm text-danger-500 mt-1">{errors.description}</p>
        )}
      </div>

      <Input
        label="Client Email or Account"
        placeholder="client@email.com or Account ID"
        value={formData.counterpartyEmail}
        onChange={(e) => updateFormData({ counterpartyEmail: e.target.value })}
        hint="We'll notify them when the deal is ready"
        leftIcon={<User className="w-5 h-5" />}
      />
    </div>
  )
}

// === STEP 2: Milestones ===
function StepMilestones({ milestones, errors, addMilestone, updateMilestone, removeMilestone }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-neutral-900 mb-1">
          Payment Milestones
        </h2>
        <p className="text-neutral-500 text-sm">
          Break your project into phases. Get paid as you complete each one.
        </p>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone: any, index: number) => (
          <div 
            key={index} 
            className="p-5 bg-neutral-50 rounded-xl border border-neutral-200"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-primary-600">
                Milestone {index + 1}
              </span>
              {milestones.length > 1 && (
                <button
                  onClick={() => removeMilestone(index)}
                  className="text-neutral-400 hover:text-danger-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Milestone title"
                value={milestone.title}
                onChange={(e) => updateMilestone(index, { title: e.target.value })}
                error={errors[`milestone_${index}_title`]}
              />
              <Input
                type="number"
                placeholder="Amount"
                value={milestone.amount || ''}
                onChange={(e) => updateMilestone(index, { amount: parseFloat(e.target.value) || 0 })}
                error={errors[`milestone_${index}_amount`]}
                leftIcon={<DollarSign className="w-5 h-5" />}
              />
            </div>

            <textarea
              className="input mt-4 min-h-[80px] resize-none text-sm"
              placeholder="What will be delivered in this milestone?"
              value={milestone.description}
              onChange={(e) => updateMilestone(index, { description: e.target.value })}
            />

            <div className="mt-4">
              <Input
                type="date"
                label="Deadline"
                value={milestone.deadline ? new Date(milestone.deadline).toISOString().split('T')[0] : ''}
                onChange={(e) => updateMilestone(index, { deadline: new Date(e.target.value) })}
                leftIcon={<Calendar className="w-5 h-5" />}
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="secondary"
        onClick={addMilestone}
        leftIcon={<Plus className="w-4 h-4" />}
        className="w-full"
      >
        Add Another Milestone
      </Button>
    </div>
  )
}

// === STEP 3: Payment ===
function StepPayment({ formData, totalAmount, updateFormData }: any) {
  const serviceFee = calculateServiceFee(totalAmount)
  const total = calculateTotalWithFee(totalAmount)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-neutral-900 mb-1">
          Payment Details
        </h2>
        <p className="text-neutral-500 text-sm">
          Review your payment structure
        </p>
      </div>

      {/* Currency Selection */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Payment Currency
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['USDC', 'USDT'].map((currency) => (
            <button
              key={currency}
              onClick={() => updateFormData({ currency })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.currency === currency
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <span className="font-semibold">{currency}</span>
              <p className="text-xs text-neutral-500 mt-1">
                {currency === 'USDC' ? 'US Dollar Coin' : 'Tether USD'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className="bg-neutral-50 rounded-xl p-6 space-y-4">
        <div className="flex justify-between text-neutral-600">
          <span>Milestones Total</span>
          <span>{formatAmount(totalAmount, formData.currency)}</span>
        </div>
        <div className="flex justify-between text-neutral-600">
          <span>Service Fee (2%)</span>
          <span>{formatAmount(serviceFee, formData.currency)}</span>
        </div>
        <div className="border-t border-neutral-200 pt-4 flex justify-between">
          <span className="font-semibold text-neutral-900">Total</span>
          <span className="font-bold text-xl text-primary-600">
            {formatAmount(total, formData.currency)}
          </span>
        </div>
      </div>

      {/* Optional Mediator */}
      <div className="p-4 bg-ai-bg border border-ai-border rounded-xl">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-ai-accent mt-0.5" />
          <div>
            <p className="font-medium text-neutral-900">Optional: Add a Mediator</p>
            <p className="text-sm text-neutral-600 mt-1">
              A trusted third party can help resolve disputes if they arise.
            </p>
            <Input
              className="mt-3"
              placeholder="Mediator email or account (optional)"
              value={formData.mediatorAddress}
              onChange={(e) => updateFormData({ mediatorAddress: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// === STEP 4: Review ===
function StepReview({ formData, totalAmount }: any) {
  const serviceFee = calculateServiceFee(totalAmount)
  const total = calculateTotalWithFee(totalAmount)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-neutral-900 mb-1">
          Review Your Deal
        </h2>
        <p className="text-neutral-500 text-sm">
          Make sure everything looks correct before creating
        </p>
      </div>

      {/* Project Info */}
      <div className="space-y-4">
        <div className="p-4 bg-neutral-50 rounded-xl">
          <p className="text-sm text-neutral-500 mb-1">Project Name</p>
          <p className="font-semibold text-neutral-900">{formData.title || '-'}</p>
        </div>

        <div className="p-4 bg-neutral-50 rounded-xl">
          <p className="text-sm text-neutral-500 mb-1">Description</p>
          <p className="text-neutral-700">{formData.description || '-'}</p>
        </div>

        <div className="p-4 bg-neutral-50 rounded-xl">
          <p className="text-sm text-neutral-500 mb-1">Client</p>
          <p className="font-medium text-neutral-900">{formData.counterpartyEmail || 'Not specified'}</p>
        </div>
      </div>

      {/* Milestones */}
      <div>
        <p className="text-sm text-neutral-500 mb-3">Milestones ({formData.milestones.length})</p>
        <div className="space-y-3">
          {formData.milestones.map((m: any, i: number) => (
            <div key={i} className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl">
              <div>
                <p className="font-medium text-neutral-900">{m.title || `Milestone ${i + 1}`}</p>
                {m.deadline && (
                  <p className="text-sm text-neutral-500">
                    Due: {new Date(m.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
              <p className="font-semibold text-primary-600">
                {formatAmount(m.amount, formData.currency)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="p-5 bg-primary-50 rounded-xl border border-primary-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-neutral-900">Total Deal Value</p>
            <p className="text-sm text-neutral-600">Including 2% service fee</p>
          </div>
          <p className="font-bold text-2xl text-primary-600">
            {formatAmount(total, formData.currency)}
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-3 p-4 bg-success-50 border border-success-200 rounded-xl">
        <Shield className="w-5 h-5 text-success-600 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-success-900">Your payment is protected</p>
          <p className="text-success-700 mt-1">
            Funds will be held securely and only released when you approve completed work.
          </p>
        </div>
      </div>
    </div>
  )
}

// === Side Summary Component ===
function DealSummary({ formData, totalAmount }: any) {
  const serviceFee = calculateServiceFee(totalAmount)
  const total = calculateTotalWithFee(totalAmount)

  return (
    <Card className="sticky top-24">
      <h3 className="font-display font-semibold text-lg text-neutral-900 mb-4">
        Deal Summary
      </h3>

      {formData.title ? (
        <p className="font-medium text-neutral-900 mb-2">{formData.title}</p>
      ) : (
        <p className="text-neutral-400 mb-2">Project name...</p>
      )}

      <div className="border-t border-neutral-100 pt-4 mt-4">
        <p className="text-sm text-neutral-500 mb-3">
          {formData.milestones.length} Milestone{formData.milestones.length > 1 ? 's' : ''}
        </p>

        <div className="space-y-2 mb-4">
          {formData.milestones.map((m: any, i: number) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-neutral-600 truncate mr-2">
                {m.title || `Milestone ${i + 1}`}
              </span>
              <span className="text-neutral-900 font-medium">
                {m.amount > 0 ? formatAmount(m.amount, formData.currency) : '-'}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-100 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Subtotal</span>
            <span>{formatAmount(totalAmount, formData.currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Fee (2%)</span>
            <span>{formatAmount(serviceFee, formData.currency)}</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t border-neutral-100">
            <span>Total</span>
            <span className="text-primary-600">{formatAmount(total, formData.currency)}</span>
          </div>
        </div>
      </div>

      {/* Trust indicator */}
      <div className="mt-6 p-3 bg-success-50 rounded-lg flex items-center gap-2">
        <Shield className="w-4 h-4 text-success-600" />
        <span className="text-sm text-success-700">Protected by escrow</span>
      </div>
    </Card>
  )
}
