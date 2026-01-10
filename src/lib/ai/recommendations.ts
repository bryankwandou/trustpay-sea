'use client';

/**
 * TRUSTPAY SEA - AI RECOMMENDATION ENGINE
 * 
 * CRITICAL PRINCIPLES:
 * 1. AI NEVER controls funds or makes final decisions
 * 2. AI only provides ADVISORY recommendations
 * 3. All final decisions require HUMAN action
 * 4. AI explains reasoning transparently
 */

// ============================================
// TYPES
// ============================================

export interface AIRecommendation {
  type: 'approve' | 'reject' | 'review' | 'neutral';
  confidence: number; // 0-100
  title: string;
  description: string;
  reasoning: string[];
  suggestedAction?: string;
  riskLevel: 'low' | 'medium' | 'high';
  disclaimer: string;
}

export interface MilestoneAnalysis {
  completeness: number;
  qualityIndicators: string[];
  potentialIssues: string[];
  timeAnalysis: {
    onTime: boolean;
    daysRemaining: number;
    urgency: 'low' | 'medium' | 'high';
  };
}

export interface DisputeAnalysis {
  summary: string;
  clientPerspective: string[];
  freelancerPerspective: string[];
  recommendedResolution: string;
  confidence: number;
  reasoning: string[];
}

// ============================================
// AI RECOMMENDATION FUNCTIONS
// ============================================

/**
 * Analyze milestone submission and provide recommendation
 * NOTE: This is ADVISORY only - final decision is human's
 */
export function analyzeMilestoneSubmission(
  milestoneTitle: string,
  milestoneDescription: string,
  submissionNotes: string,
  deadline: Date,
  amount: number
): AIRecommendation {
  // Simulated AI analysis (in production, this would call an AI API)
  const now = new Date();
  const isOnTime = now <= deadline;
  const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // Simple heuristic analysis
  const hasDescription = submissionNotes.length > 50;
  const hasDetails = submissionNotes.toLowerCase().includes('completed') || 
                    submissionNotes.toLowerCase().includes('finished') ||
                    submissionNotes.toLowerCase().includes('done');
  
  let confidence = 50;
  let type: AIRecommendation['type'] = 'review';
  let riskLevel: AIRecommendation['riskLevel'] = 'medium';
  const reasoning: string[] = [];

  // Build analysis
  if (isOnTime) {
    confidence += 15;
    reasoning.push('Submission is within the deadline');
  } else {
    confidence -= 10;
    reasoning.push(`Submission is ${Math.abs(daysRemaining)} days past deadline`);
    riskLevel = 'high';
  }

  if (hasDescription) {
    confidence += 20;
    reasoning.push('Detailed submission notes provided');
  } else {
    reasoning.push('Submission notes are brief - consider requesting more details');
  }

  if (hasDetails) {
    confidence += 15;
    reasoning.push('Submission indicates completion status');
    type = 'approve';
    riskLevel = 'low';
  }

  // Cap confidence
  confidence = Math.min(95, Math.max(20, confidence));

  // Determine recommendation type based on confidence
  if (confidence >= 70) {
    type = 'approve';
    riskLevel = 'low';
  } else if (confidence >= 50) {
    type = 'review';
    riskLevel = 'medium';
  } else {
    type = 'reject';
    riskLevel = 'high';
  }

  return {
    type,
    confidence,
    title: type === 'approve' 
      ? 'Looks Good to Approve' 
      : type === 'review' 
        ? 'Review Recommended' 
        : 'Consider Requesting Revisions',
    description: type === 'approve'
      ? 'Based on the submission details, this milestone appears to meet the requirements.'
      : type === 'review'
        ? 'Some aspects may need verification before approval.'
        : 'The submission may need additional work or clarification.',
    reasoning,
    suggestedAction: type === 'approve'
      ? 'Review the deliverables and approve if satisfied'
      : type === 'review'
        ? 'Request additional details or screenshots of completed work'
        : 'Provide specific feedback on what needs improvement',
    riskLevel,
    disclaimer: '⚠️ AI Recommendation Only — Final decision is yours. Review the actual deliverables before deciding.'
  };
}

/**
 * Analyze dispute and provide mediation recommendation
 * NOTE: This is ADVISORY only - mediator makes final decision
 */
export function analyzeDispute(
  dealTitle: string,
  milestoneTitle: string,
  clientClaim: string,
  freelancerClaim: string,
  amount: number,
  evidenceProvided: boolean
): DisputeAnalysis {
  // Simulated analysis
  const clientKeywords = extractKeyPoints(clientClaim);
  const freelancerKeywords = extractKeyPoints(freelancerClaim);
  
  let confidence = 40;
  const reasoning: string[] = [];

  // Analyze claims
  if (clientClaim.length > 100 && freelancerClaim.length > 100) {
    confidence += 10;
    reasoning.push('Both parties have provided detailed explanations');
  }

  if (evidenceProvided) {
    confidence += 20;
    reasoning.push('Evidence has been submitted for review');
  } else {
    reasoning.push('No evidence provided - recommend requesting documentation');
  }

  // Detect common dispute patterns
  const hasQualityIssue = clientClaim.toLowerCase().includes('quality') || 
                          clientClaim.toLowerCase().includes('not as expected');
  const hasDeliveryIssue = clientClaim.toLowerCase().includes('late') || 
                           clientClaim.toLowerCase().includes('deadline');
  const hasScopeIssue = clientClaim.toLowerCase().includes('scope') ||
                        clientClaim.toLowerCase().includes('different');

  if (hasQualityIssue) {
    reasoning.push('Quality concerns mentioned - recommend reviewing deliverables');
  }
  if (hasDeliveryIssue) {
    reasoning.push('Timeline issues mentioned - check milestone deadlines');
  }
  if (hasScopeIssue) {
    reasoning.push('Scope disagreement detected - review original requirements');
  }

  // Generate recommendation
  let recommendedResolution = 'Further review needed';
  
  if (confidence >= 60 && evidenceProvided) {
    if (hasQualityIssue) {
      recommendedResolution = 'Consider partial payment (70-80%) if work was delivered but needs improvements';
    } else if (hasDeliveryIssue) {
      recommendedResolution = 'If work quality is acceptable, consider full payment with timeline discussion';
    } else if (hasScopeIssue) {
      recommendedResolution = 'Review original agreement and consider split based on completed scope';
    }
  }

  return {
    summary: `Dispute regarding "${milestoneTitle}" in project "${dealTitle}"`,
    clientPerspective: clientKeywords,
    freelancerPerspective: freelancerKeywords,
    recommendedResolution,
    confidence: Math.min(85, confidence),
    reasoning
  };
}

/**
 * Analyze deal creation for potential issues
 */
export function analyzeDealSetup(
  title: string,
  description: string,
  totalAmount: number,
  milestones: Array<{ title: string; amount: number; deadline: Date }>
): {
  isValid: boolean;
  warnings: string[];
  suggestions: string[];
  score: number;
} {
  const warnings: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Check title
  if (title.length < 10) {
    warnings.push('Project title is very short - consider being more descriptive');
    score -= 10;
  }

  // Check description
  if (description.length < 50) {
    warnings.push('Description is brief - detailed descriptions prevent disputes');
    score -= 15;
  }

  // Check amount
  if (totalAmount < 50) {
    suggestions.push('Small project amount - consider combining milestones for efficiency');
  }

  // Check milestones
  if (milestones.length === 1) {
    suggestions.push('Single milestone deal - consider splitting into phases for better tracking');
  }

  if (milestones.length > 5) {
    suggestions.push('Many milestones - ensure each has clear, distinct deliverables');
  }

  // Check milestone distribution
  const amounts = milestones.map(m => m.amount);
  const maxAmount = Math.max(...amounts);
  const minAmount = Math.min(...amounts);
  
  if (maxAmount > totalAmount * 0.7) {
    warnings.push('One milestone has most of the payment - consider more balanced distribution');
    score -= 10;
  }

  // Check deadlines
  const now = new Date();
  const shortDeadlines = milestones.filter(m => {
    const days = Math.ceil((m.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return days < 3;
  });

  if (shortDeadlines.length > 0) {
    warnings.push('Some milestones have very short deadlines (< 3 days)');
    score -= 10;
  }

  return {
    isValid: score >= 50 && warnings.length < 3,
    warnings,
    suggestions,
    score: Math.max(0, score)
  };
}

/**
 * Get contextual tips based on user role and deal status
 */
export function getContextualTips(
  userRole: 'client' | 'freelancer' | 'mediator',
  dealStatus: string,
  milestoneStatus?: string
): string[] {
  const tips: string[] = [];

  if (userRole === 'client') {
    switch (dealStatus) {
      case 'created':
        tips.push('Fund the escrow to start the project');
        tips.push('Review all milestone details before funding');
        break;
      case 'funded':
        tips.push('Freelancer can now start working');
        tips.push('You\'ll be notified when milestones are submitted');
        break;
      case 'in_progress':
        if (milestoneStatus === 'submitted') {
          tips.push('Review the submitted work carefully');
          tips.push('Approve to release payment, or provide feedback for revisions');
          tips.push('Only approve when you\'re satisfied with the work');
        }
        break;
    }
  }

  if (userRole === 'freelancer') {
    switch (dealStatus) {
      case 'created':
        tips.push('Wait for client to fund the escrow');
        tips.push('Review milestone requirements before starting');
        break;
      case 'funded':
        tips.push('Start working on the first milestone');
        tips.push('Submit when ready for client review');
        break;
      case 'in_progress':
        if (milestoneStatus === 'rejected') {
          tips.push('Review client feedback carefully');
          tips.push('Address all concerns before resubmitting');
        }
        break;
    }
  }

  return tips;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function extractKeyPoints(text: string): string[] {
  const points: string[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  // Extract first 3 meaningful sentences as key points
  sentences.slice(0, 3).forEach(sentence => {
    const trimmed = sentence.trim();
    if (trimmed.length > 0) {
      points.push(trimmed);
    }
  });

  return points;
}

/**
 * Generate human-readable status message
 */
export function getStatusMessage(
  status: string,
  userRole: 'client' | 'freelancer'
): { message: string; actionRequired: boolean } {
  const messages: Record<string, { client: string; freelancer: string; action: boolean }> = {
    'created': {
      client: 'Fund the escrow to begin the project',
      freelancer: 'Waiting for client to fund the escrow',
      action: true
    },
    'funded': {
      client: 'Project is funded. Waiting for work to begin.',
      freelancer: 'Escrow funded! You can start working.',
      action: false
    },
    'in_progress': {
      client: 'Work in progress',
      freelancer: 'Keep up the great work!',
      action: false
    },
    'submitted': {
      client: 'Milestone submitted for your review',
      freelancer: 'Waiting for client review',
      action: true
    },
    'completed': {
      client: 'Project completed successfully',
      freelancer: 'Project completed! Payment released.',
      action: false
    },
    'disputed': {
      client: 'Dispute in progress - mediator will review',
      freelancer: 'Dispute in progress - mediator will review',
      action: false
    }
  };

  const config = messages[status] || messages['in_progress'];
  
  return {
    message: userRole === 'client' ? config.client : config.freelancer,
    actionRequired: config.action
  };
}
