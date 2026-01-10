'use client'

import { Sparkles, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { AIAnalysis } from '@/lib/types'

interface AIRecommendationBoxProps {
  analysis: AIAnalysis
}

/**
 * AI Recommendation Box
 * 
 * CRITICAL UX PRINCIPLES:
 * 1. AI adalah ADVISORY saja, bukan decision maker
 * 2. Selalu ada disclaimer bahwa keputusan final ada di tangan user
 * 3. Warna netral, tidak mendominasi UI
 * 4. Confidence score harus jelas dan explainable
 * 5. Reasoning harus transparan
 */
export function AIRecommendationBox({ analysis }: AIRecommendationBoxProps) {
  const recommendationConfig = {
    approve: {
      icon: CheckCircle,
      label: 'Looks Good',
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200'
    },
    review_needed: {
      icon: Info,
      label: 'Review Suggested',
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200'
    },
    reject_suggested: {
      icon: AlertTriangle,
      label: 'Issues Found',
      color: 'text-danger-600',
      bgColor: 'bg-danger-50',
      borderColor: 'border-danger-200'
    }
  }

  const config = recommendationConfig[analysis.recommendation]
  const Icon = config.icon

  // Determine confidence level text
  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'High confidence'
    if (confidence >= 60) return 'Moderate confidence'
    return 'Low confidence'
  }

  return (
    <div className="ai-box">
      {/* Header with AI label */}
      <div className="flex items-center justify-between mb-3">
        <div className="ai-label">
          <Sparkles className="w-3.5 h-3.5" />
          AI Analysis
        </div>
        <span className="text-xs text-neutral-400">
          {getConfidenceLabel(analysis.confidence)}
        </span>
      </div>

      {/* Recommendation Badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} ${config.borderColor} border mb-3`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
        <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
      </div>

      {/* Summary */}
      <p className="text-neutral-700 mb-4">{analysis.summary}</p>

      {/* Confidence Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-neutral-500">Match Score</span>
          <span className={`font-semibold ${
            analysis.confidence >= 80 ? 'text-success-600' : 
            analysis.confidence >= 60 ? 'text-warning-600' : 
            'text-danger-600'
          }`}>
            {analysis.confidence}%
          </span>
        </div>
        <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              analysis.confidence >= 80 ? 'bg-success-500' : 
              analysis.confidence >= 60 ? 'bg-warning-500' : 
              'bg-danger-500'
            }`}
            style={{ width: `${analysis.confidence}%` }}
          />
        </div>
      </div>

      {/* Reasons */}
      {analysis.reasons.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-neutral-700 mb-2">Why this recommendation:</p>
          <ul className="space-y-1.5">
            {analysis.reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                <CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0 mt-0.5" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Concerns (if any) */}
      {analysis.concerns && analysis.concerns.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-neutral-700 mb-2">Things to consider:</p>
          <ul className="space-y-1.5">
            {analysis.concerns.map((concern, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                <AlertTriangle className="w-4 h-4 text-warning-500 flex-shrink-0 mt-0.5" />
                {concern}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CRITICAL: Human-in-the-loop disclaimer */}
      <div className="mt-4 pt-4 border-t border-ai-border">
        <div className="flex items-start gap-2 p-3 bg-neutral-100 rounded-lg">
          <Info className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-neutral-600">
            <strong>AI recommendation only.</strong> This analysis is meant to help you, 
            not replace your judgment. The final decision is always yours.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Compact version for list views
 */
export function AIRecommendationBadge({ analysis }: { analysis: AIAnalysis }) {
  const config = {
    approve: { label: 'AI: Looks good', color: 'bg-success-100 text-success-700' },
    review_needed: { label: 'AI: Review suggested', color: 'bg-warning-100 text-warning-700' },
    reject_suggested: { label: 'AI: Issues found', color: 'bg-danger-100 text-danger-700' }
  }

  const { label, color } = config[analysis.recommendation]

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      <Sparkles className="w-3 h-3" />
      {label}
      <span className="opacity-70">({analysis.confidence}%)</span>
    </div>
  )
}

/**
 * AI Analysis for Disputes
 * Shows balanced view of both parties
 */
export function AIDisputeAnalysisBox({ 
  summary,
  freelancerStrengths,
  clientStrengths,
  suggestedResolution,
  confidence,
  disclaimer
}: {
  summary: string
  freelancerStrengths: string[]
  clientStrengths: string[]
  suggestedResolution: string
  confidence: number
  disclaimer: string
}) {
  return (
    <div className="ai-box">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="ai-label">
          <Sparkles className="w-3.5 h-3.5" />
          AI Pre-Analysis
        </div>
        <span className="text-xs text-neutral-400">
          For reference only
        </span>
      </div>

      {/* Summary */}
      <p className="text-neutral-700 mb-6">{summary}</p>

      {/* Two-column analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Freelancer side */}
        <div className="p-4 bg-white rounded-lg border border-neutral-200">
          <p className="text-sm font-medium text-neutral-900 mb-3">Freelancer's Position</p>
          <ul className="space-y-2">
            {freelancerStrengths.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Client side */}
        <div className="p-4 bg-white rounded-lg border border-neutral-200">
          <p className="text-sm font-medium text-neutral-900 mb-3">Client's Position</p>
          <ul className="space-y-2">
            {clientStrengths.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                <div className="w-1.5 h-1.5 bg-warning-500 rounded-full mt-1.5 flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggested resolution */}
      <div className="p-4 bg-neutral-50 rounded-lg mb-4">
        <p className="text-sm font-medium text-neutral-900 mb-1">AI Suggested Resolution</p>
        <p className="text-sm text-neutral-600">{suggestedResolution}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-neutral-500">Confidence:</span>
          <span className={`text-xs font-medium ${
            confidence >= 70 ? 'text-success-600' : 'text-warning-600'
          }`}>
            {confidence}%
          </span>
        </div>
      </div>

      {/* CRITICAL Disclaimer */}
      <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-danger-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-danger-700">
            <strong>Important:</strong> {disclaimer}
          </p>
        </div>
      </div>
    </div>
  )
}
