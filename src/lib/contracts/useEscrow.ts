'use client';

/**
 * TRUSTPAY SEA - PRODUCTION ESCROW HOOKS
 * Complete hooks for smart contract interaction
 * Lisk Sepolia Testnet Ready
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt,
  useAccount,
  useChainId,
  usePublicClient
} from 'wagmi';
import { parseUnits, formatUnits, type Address } from 'viem';
import { TRUSTPAY_ESCROW_ABI, ERC20_ABI, CONTRACT_ADDRESSES, SUPPORTED_TOKENS, type SupportedNetwork } from './config';

// ============================================
// NETWORK HELPERS
// ============================================

const NETWORK_MAP: Record<number, SupportedNetwork> = {
  137: 'polygon',
  42161: 'arbitrum',
  8453: 'base',
  1135: 'lisk',
  80001: 'polygonMumbai',
  84532: 'baseSepolia',
  4202: 'liskSepolia',
  31337: 'hardhat'
};

export function getNetworkFromChainId(chainId: number | undefined): SupportedNetwork {
  return NETWORK_MAP[chainId || 4202] || 'liskSepolia';
}

export function getContractAddress(chainId: number | undefined): Address {
  const network = getNetworkFromChainId(chainId);
  return CONTRACT_ADDRESSES[network].escrow as Address;
}

export function getTokenAddress(chainId: number | undefined, token: 'usdc' | 'usdt'): Address {
  const network = getNetworkFromChainId(chainId);
  return CONTRACT_ADDRESSES[network][token] as Address;
}

// ============================================
// TYPES
// ============================================

export interface DealData {
  id: bigint;
  client: Address;
  freelancer: Address;
  mediator: Address;
  paymentToken: Address;
  totalAmount: bigint;
  releasedAmount: bigint;
  createdAt: bigint;
  fundedAt: bigint;
  status: number;
  title: string;
  description: string;
}

export interface MilestoneData {
  title: string;
  amount: bigint;
  deadline: bigint;
  status: number;
  fundsReleased: boolean;
}

export interface CreateDealParams {
  freelancer: Address;
  mediator: Address;
  token: Address;
  title: string;
  description: string;
  milestoneTitles: string[];
  milestoneAmounts: bigint[];
  milestoneDeadlines: bigint[];
}

// ============================================
// READ HOOKS
// ============================================

/**
 * Get deal details by ID
 */
export function useDeal(dealId: bigint | undefined) {
  const chainId = useChainId();
  
  return useReadContract({
    address: getContractAddress(chainId),
    abi: TRUSTPAY_ESCROW_ABI,
    functionName: 'getDeal',
    args: dealId !== undefined ? [dealId] : undefined,
    query: {
      enabled: dealId !== undefined
    }
  });
}

/**
 * Get all milestones for a deal
 */
export function useMilestones(dealId: bigint | undefined) {
  const chainId = useChainId();
  
  return useReadContract({
    address: getContractAddress(chainId),
    abi: TRUSTPAY_ESCROW_ABI,
    functionName: 'getMilestones',
    args: dealId !== undefined ? [dealId] : undefined,
    query: {
      enabled: dealId !== undefined
    }
  });
}

/**
 * Get single milestone
 */
export function useMilestone(dealId: bigint | undefined, index: bigint | undefined) {
  const chainId = useChainId();
  
  return useReadContract({
    address: getContractAddress(chainId),
    abi: TRUSTPAY_ESCROW_ABI,
    functionName: 'getMilestone',
    args: dealId !== undefined && index !== undefined ? [dealId, index] : undefined,
    query: {
      enabled: dealId !== undefined && index !== undefined
    }
  });
}

/**
 * Get user's deals
 */
export function useUserDeals(userAddress: Address | undefined) {
  const chainId = useChainId();
  
  return useReadContract({
    address: getContractAddress(chainId),
    abi: TRUSTPAY_ESCROW_ABI,
    functionName: 'getUserDeals',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress
    }
  });
}

/**
 * Get deal count
 */
export function useDealCount() {
  const chainId = useChainId();
  
  return useReadContract({
    address: getContractAddress(chainId),
    abi: TRUSTPAY_ESCROW_ABI,
    functionName: 'getDealCount'
  });
}

/**
 * Get platform fee
 */
export function usePlatformFee() {
  const chainId = useChainId();
  
  return useReadContract({
    address: getContractAddress(chainId),
    abi: TRUSTPAY_ESCROW_ABI,
    functionName: 'platformFee'
  });
}

/**
 * Check if token is supported
 */
export function useIsSupportedToken(tokenAddress: Address | undefined) {
  const chainId = useChainId();
  
  return useReadContract({
    address: getContractAddress(chainId),
    abi: TRUSTPAY_ESCROW_ABI,
    functionName: 'supportedTokens',
    args: tokenAddress ? [tokenAddress] : undefined,
    query: {
      enabled: !!tokenAddress
    }
  });
}

/**
 * Get token balance
 */
export function useTokenBalance(tokenAddress: Address | undefined, userAddress: Address | undefined) {
  return useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!tokenAddress && !!userAddress
    }
  });
}

/**
 * Get token allowance
 */
export function useTokenAllowance(
  tokenAddress: Address | undefined, 
  ownerAddress: Address | undefined
) {
  const chainId = useChainId();
  const spender = getContractAddress(chainId);
  
  return useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: ownerAddress ? [ownerAddress, spender] : undefined,
    query: {
      enabled: !!tokenAddress && !!ownerAddress
    }
  });
}

// ============================================
// WRITE HOOKS
// ============================================

/**
 * Hook for creating a new deal
 * HUMAN ACTION: Creates escrow deal structure
 */
export function useCreateDeal() {
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash
  });

  const createDeal = useCallback((params: CreateDealParams) => {
    const contractAddress = getContractAddress(chainId);
    
    writeContract({
      address: contractAddress,
      abi: TRUSTPAY_ESCROW_ABI,
      functionName: 'createDeal',
      args: [
        params.freelancer,
        params.mediator,
        params.token,
        params.title,
        params.description,
        params.milestoneTitles,
        params.milestoneAmounts,
        params.milestoneDeadlines
      ]
    });
  }, [chainId, writeContract]);

  return {
    createDeal,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    receipt,
    reset
  };
}

/**
 * Hook for funding a deal
 * HUMAN ACTION: Client deposits funds into escrow
 */
export function useFundDeal() {
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash
  });

  const fundDeal = useCallback((dealId: bigint) => {
    writeContract({
      address: getContractAddress(chainId),
      abi: TRUSTPAY_ESCROW_ABI,
      functionName: 'fundDeal',
      args: [dealId]
    });
  }, [chainId, writeContract]);

  return {
    fundDeal,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    receipt,
    reset
  };
}

/**
 * Hook for approving token spending
 * Required before funding a deal
 */
export function useApproveToken() {
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const approve = useCallback((tokenAddress: Address, amount: bigint) => {
    const spender = getContractAddress(chainId);
    
    writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spender, amount]
    });
  }, [chainId, writeContract]);

  return {
    approve,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset
  };
}

/**
 * Hook for submitting milestone
 * HUMAN ACTION: Freelancer marks milestone as complete
 */
export function useSubmitMilestone() {
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const submitMilestone = useCallback((dealId: bigint, milestoneIndex: bigint) => {
    writeContract({
      address: getContractAddress(chainId),
      abi: TRUSTPAY_ESCROW_ABI,
      functionName: 'submitMilestone',
      args: [dealId, milestoneIndex]
    });
  }, [chainId, writeContract]);

  return {
    submitMilestone,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset
  };
}

/**
 * Hook for approving milestone - CRITICAL HUMAN-IN-THE-LOOP
 * HUMAN ACTION: Client approves and releases funds
 * ⚠️ This is the ONLY way to release funds - requires human click
 */
export function useApproveMilestone() {
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const approveMilestone = useCallback((dealId: bigint, milestoneIndex: bigint) => {
    writeContract({
      address: getContractAddress(chainId),
      abi: TRUSTPAY_ESCROW_ABI,
      functionName: 'approveMilestone',
      args: [dealId, milestoneIndex]
    });
  }, [chainId, writeContract]);

  return {
    approveMilestone,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset
  };
}

/**
 * Hook for rejecting milestone
 * HUMAN ACTION: Client requests revisions
 */
export function useRejectMilestone() {
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const rejectMilestone = useCallback((dealId: bigint, milestoneIndex: bigint, reason: string) => {
    writeContract({
      address: getContractAddress(chainId),
      abi: TRUSTPAY_ESCROW_ABI,
      functionName: 'rejectMilestone',
      args: [dealId, milestoneIndex, reason]
    });
  }, [chainId, writeContract]);

  return {
    rejectMilestone,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset
  };
}

/**
 * Hook for opening dispute
 * HUMAN ACTION: Either party can open dispute
 */
export function useOpenDispute() {
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const openDispute = useCallback((dealId: bigint, milestoneIndex: bigint) => {
    writeContract({
      address: getContractAddress(chainId),
      abi: TRUSTPAY_ESCROW_ABI,
      functionName: 'openDispute',
      args: [dealId, milestoneIndex]
    });
  }, [chainId, writeContract]);

  return {
    openDispute,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset
  };
}

/**
 * Hook for resolving dispute
 * HUMAN ACTION: Mediator resolves dispute
 */
export function useResolveDispute() {
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const resolveDispute = useCallback((
    dealId: bigint, 
    milestoneIndex: bigint,
    winner: Address,
    freelancerPercentage: bigint
  ) => {
    writeContract({
      address: getContractAddress(chainId),
      abi: TRUSTPAY_ESCROW_ABI,
      functionName: 'resolveDispute',
      args: [dealId, milestoneIndex, winner, freelancerPercentage]
    });
  }, [chainId, writeContract]);

  return {
    resolveDispute,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset
  };
}

/**
 * Hook for cancelling unfunded deal
 * HUMAN ACTION: Cancel before funding
 */
export function useCancelDeal() {
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const cancelDeal = useCallback((dealId: bigint) => {
    writeContract({
      address: getContractAddress(chainId),
      abi: TRUSTPAY_ESCROW_ABI,
      functionName: 'cancelDeal',
      args: [dealId]
    });
  }, [chainId, writeContract]);

  return {
    cancelDeal,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset
  };
}

// ============================================
// COMPOSITE HOOKS
// ============================================

/**
 * Complete deal data with milestones
 */
export function useFullDeal(dealId: bigint | undefined) {
  const { data: deal, isLoading: isDealLoading, error: dealError, refetch: refetchDeal } = useDeal(dealId);
  const { data: milestones, isLoading: isMilestonesLoading, error: milestonesError, refetch: refetchMilestones } = useMilestones(dealId);
  
  const refetch = useCallback(() => {
    refetchDeal();
    refetchMilestones();
  }, [refetchDeal, refetchMilestones]);

  return {
    deal: deal as DealData | undefined,
    milestones: milestones as MilestoneData[] | undefined,
    isLoading: isDealLoading || isMilestonesLoading,
    error: dealError || milestonesError,
    refetch
  };
}

/**
 * Fund deal with approval flow
 */
export function useFundDealWithApproval() {
  const [step, setStep] = useState<'idle' | 'approving' | 'funding' | 'success' | 'error'>('idle');
  const chainId = useChainId();
  
  const { 
    approve, 
    isPending: isApproving, 
    isConfirming: isApprovalConfirming, 
    isSuccess: isApproved,
    error: approveError,
    reset: resetApprove
  } = useApproveToken();
  
  const {
    fundDeal,
    isPending: isFunding,
    isConfirming: isFundConfirming,
    isSuccess: isFunded,
    error: fundError,
    reset: resetFund
  } = useFundDeal();

  // Auto-progress from approval to funding
  useEffect(() => {
    if (isApproved && step === 'approving') {
      setStep('funding');
    }
  }, [isApproved, step]);

  useEffect(() => {
    if (isFunded) {
      setStep('success');
    }
  }, [isFunded]);

  useEffect(() => {
    if (approveError || fundError) {
      setStep('error');
    }
  }, [approveError, fundError]);

  const startFunding = useCallback((
    tokenAddress: Address,
    dealId: bigint,
    amount: bigint,
    currentAllowance: bigint
  ) => {
    // Check if approval needed
    if (currentAllowance < amount) {
      setStep('approving');
      approve(tokenAddress, amount);
    } else {
      setStep('funding');
      fundDeal(dealId);
    }
  }, [approve, fundDeal]);

  const executeFund = useCallback((dealId: bigint) => {
    fundDeal(dealId);
  }, [fundDeal]);

  const reset = useCallback(() => {
    setStep('idle');
    resetApprove();
    resetFund();
  }, [resetApprove, resetFund]);

  return {
    step,
    startFunding,
    executeFund,
    isApproving: isApproving || isApprovalConfirming,
    isFunding: isFunding || isFundConfirming,
    isSuccess: isFunded,
    error: approveError || fundError,
    reset
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Parse token amount to bigint
 */
export function parseTokenAmount(amount: string | number, decimals: number = 6): bigint {
  return parseUnits(String(amount), decimals);
}

/**
 * Format token amount from bigint
 */
export function formatTokenAmount(amount: bigint, decimals: number = 6): string {
  return formatUnits(amount, decimals);
}

/**
 * Calculate platform fee
 */
export function calculateFee(amount: bigint, feePercent: number = 200): bigint {
  return (amount * BigInt(feePercent)) / BigInt(10000);
}

/**
 * Calculate total with fee
 */
export function calculateTotalWithFee(amount: bigint, feePercent: number = 200): bigint {
  const fee = calculateFee(amount, feePercent);
  return amount + fee;
}
