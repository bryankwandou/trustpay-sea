'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { TRUSTPAY_ESCROW_ABI, ERC20_ABI, CONTRACT_ADDRESSES, type SupportedNetwork } from './config';

// Network mapping - Maps chain IDs to network names
const NETWORK_MAP: Record<number, SupportedNetwork> = {
  // Mainnets
  137: 'polygon',
  42161: 'arbitrum',
  8453: 'base',
  1135: 'lisk',
  
  // Testnets
  80001: 'polygonMumbai',
  84532: 'baseSepolia',
  4202: 'liskSepolia', // Lisk Sepolia Testnet
  
  // Local
  31337: 'hardhat'
};

// Helper to get network name from chain ID
function getNetworkFromChainId(chainId: number | undefined): SupportedNetwork {
  return NETWORK_MAP[chainId || 4202] || 'liskSepolia'; // Default to Lisk Sepolia
}

// Helper to get contract address based on chain
function getContractAddress(chainId: number | undefined): `0x${string}` {
  const network = getNetworkFromChainId(chainId);
  return CONTRACT_ADDRESSES[network].escrow as `0x${string}`;
}

function getTokenAddress(chainId: number | undefined, token: 'usdc' | 'usdt'): `0x${string}` {
  const network = getNetworkFromChainId(chainId);
  return CONTRACT_ADDRESSES[network][token] as `0x${string}`;
}

// ============================================
// READ HOOKS
// ============================================

/**
 * Get deal details by ID
 */
export function useDeal(dealId: bigint | undefined, chainId: number | undefined) {
  return useReadContract({
    address: getContractAddress(chainId),
    abi: TRUSTPAY_ESCROW_ABI,
    functionName: 'getDeal',
    args: dealId ? [dealId] : undefined,
    query: {
      enabled: !!dealId
    }
  });
}

/**
 * Get milestones for a deal
 */
export function useMilestones(dealId: bigint | undefined, chainId: number | undefined) {
  return useReadContract({
    address: getContractAddress(chainId),
    abi: TRUSTPAY_ESCROW_ABI,
    functionName: 'getMilestones',
    args: dealId ? [dealId] : undefined,
    query: {
      enabled: !!dealId
    }
  });
}

/**
 * Get user's deal IDs
 */
export function useUserDeals(userAddress: `0x${string}` | undefined, chainId: number | undefined) {
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
 * Get total deal count
 */
export function useDealCount(chainId: number | undefined) {
  return useReadContract({
    address: getContractAddress(chainId),
    abi: TRUSTPAY_ESCROW_ABI,
    functionName: 'getDealCount'
  });
}

/**
 * Get token balance
 */
export function useTokenBalance(
  tokenAddress: `0x${string}` | undefined,
  userAddress: `0x${string}` | undefined
) {
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
 * Get token allowance for escrow contract
 */
export function useTokenAllowance(
  tokenAddress: `0x${string}` | undefined,
  ownerAddress: `0x${string}` | undefined,
  chainId: number | undefined
) {
  return useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: ownerAddress ? [ownerAddress, getContractAddress(chainId)] : undefined,
    query: {
      enabled: !!tokenAddress && !!ownerAddress
    }
  });
}

// ============================================
// WRITE HOOKS
// ============================================

interface CreateDealParams {
  freelancer: `0x${string}`;
  mediator: `0x${string}`;
  token: `0x${string}`;
  title: string;
  description: string;
  milestoneTitles: string[];
  milestoneAmounts: bigint[];
  milestoneDeadlines: bigint[];
}

/**
 * Hook for creating a new deal
 */
export function useCreateDeal() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const createDeal = (chainId: number, params: CreateDealParams) => {
    writeContract({
      address: getContractAddress(chainId),
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
  };

  return {
    createDeal,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error
  };
}

/**
 * Hook for funding a deal
 */
export function useFundDeal() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const fundDeal = (chainId: number, dealId: bigint) => {
    writeContract({
      address: getContractAddress(chainId),
      abi: TRUSTPAY_ESCROW_ABI,
      functionName: 'fundDeal',
      args: [dealId]
    });
  };

  return {
    fundDeal,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error
  };
}

/**
 * Hook for approving token spending
 */
export function useApproveToken() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const approve = (tokenAddress: `0x${string}`, spender: `0x${string}`, amount: bigint) => {
    writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spender, amount]
    });
  };

  return {
    approve,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error
  };
}

/**
 * Hook for submitting milestone (freelancer only)
 */
export function useSubmitMilestone() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const submitMilestone = (chainId: number, dealId: bigint, milestoneIndex: bigint) => {
    writeContract({
      address: getContractAddress(chainId),
      abi: TRUSTPAY_ESCROW_ABI,
      functionName: 'submitMilestone',
      args: [dealId, milestoneIndex]
    });
  };

  return {
    submitMilestone,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error
  };
}

/**
 * Hook for approving milestone (client only - CRITICAL human-in-the-loop)
 * This releases funds to freelancer - ONLY human can trigger this
 */
export function useApproveMilestone() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const approveMilestone = (chainId: number, dealId: bigint, milestoneIndex: bigint) => {
    writeContract({
      address: getContractAddress(chainId),
      abi: TRUSTPAY_ESCROW_ABI,
      functionName: 'approveMilestone',
      args: [dealId, milestoneIndex]
    });
  };

  return {
    approveMilestone,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error
  };
}

/**
 * Hook for rejecting milestone (client only)
 */
export function useRejectMilestone() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const rejectMilestone = (chainId: number, dealId: bigint, milestoneIndex: bigint, reason: string) => {
    writeContract({
      address: getContractAddress(chainId),
      abi: TRUSTPAY_ESCROW_ABI,
      functionName: 'rejectMilestone',
      args: [dealId, milestoneIndex, reason]
    });
  };

  return {
    rejectMilestone,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error
  };
}

/**
 * Hook for opening a dispute
 */
export function useOpenDispute() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const openDispute = (chainId: number, dealId: bigint, milestoneIndex: bigint) => {
    writeContract({
      address: getContractAddress(chainId),
      abi: TRUSTPAY_ESCROW_ABI,
      functionName: 'openDispute',
      args: [dealId, milestoneIndex]
    });
  };

  return {
    openDispute,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error
  };
}

/**
 * Hook for resolving dispute (mediator only - CRITICAL human decision)
 */
export function useResolveDispute() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const resolveDispute = (
    chainId: number,
    dealId: bigint,
    milestoneIndex: bigint,
    winner: `0x${string}`,
    freelancerPercentage: bigint
  ) => {
    writeContract({
      address: getContractAddress(chainId),
      abi: TRUSTPAY_ESCROW_ABI,
      functionName: 'resolveDispute',
      args: [dealId, milestoneIndex, winner, freelancerPercentage]
    });
  };

  return {
    resolveDispute,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error
  };
}

// ============================================
// UTILITY HOOKS
// ============================================

/**
 * Combined hook for fund deal flow (approve + fund)
 */
export function useFundDealFlow() {
  const approveHook = useApproveToken();
  const fundHook = useFundDeal();
  
  return {
    // Step 1: Approve
    approve: approveHook.approve,
    isApproving: approveHook.isPending || approveHook.isConfirming,
    approveSuccess: approveHook.isSuccess,
    approveError: approveHook.error,
    
    // Step 2: Fund
    fund: fundHook.fundDeal,
    isFunding: fundHook.isPending || fundHook.isConfirming,
    fundSuccess: fundHook.isSuccess,
    fundError: fundHook.error,
    
    // Combined status
    isProcessing: approveHook.isPending || approveHook.isConfirming || fundHook.isPending || fundHook.isConfirming,
    isComplete: fundHook.isSuccess
  };
}

// Export utilities
export { parseUnits, formatUnits, getContractAddress, getTokenAddress };
