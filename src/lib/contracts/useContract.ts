'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAccount, useChainId, usePublicClient, useWalletClient } from 'wagmi';
import { parseUnits, formatUnits, encodeFunctionData, type Hash } from 'viem';
import { TRUSTPAY_ESCROW_ABI, ERC20_ABI, CONTRACT_ADDRESSES, SUPPORTED_TOKENS, type SupportedNetwork } from './config';

// ============================================
// TYPES
// ============================================

export interface Deal {
  id: bigint;
  client: `0x${string}`;
  freelancer: `0x${string}`;
  mediator: `0x${string}`;
  token: `0x${string}`;
  title: string;
  description: string;
  totalAmount: bigint;
  fundedAmount: bigint;
  releasedAmount: bigint;
  status: number;
  createdAt: bigint;
  completedAt: bigint;
  milestoneCount: bigint;
}

export interface Milestone {
  title: string;
  amount: bigint;
  deadline: bigint;
  status: number;
  submittedAt: bigint;
  completedAt: bigint;
  rejectionReason: string;
}

export type TransactionStatus = 'idle' | 'preparing' | 'confirming' | 'success' | 'error';

export interface TransactionState {
  status: TransactionStatus;
  hash?: Hash;
  error?: string;
}

// ============================================
// UTILITIES
// ============================================

function getNetworkKey(chainId: number): SupportedNetwork {
  const networkMap: Record<number, SupportedNetwork> = {
    137: 'polygon',
    80001: 'polygonMumbai',
    42161: 'arbitrum',
    8453: 'base',
    84532: 'baseSepolia',
    4202: 'liskSepolia',
    31337: 'hardhat'
  };
  return networkMap[chainId] || 'liskSepolia';
}

export function getContractAddress(chainId: number): `0x${string}` {
  const network = getNetworkKey(chainId);
  return CONTRACT_ADDRESSES[network]?.escrow as `0x${string}` || '0x0000000000000000000000000000000000000000';
}

export function getTokenAddress(chainId: number, token: 'usdc' | 'usdt' | 'mockUsdc'): `0x${string}` {
  const network = getNetworkKey(chainId);
  const addresses = CONTRACT_ADDRESSES[network];
  return (addresses as any)?.[token] as `0x${string}` || '0x0000000000000000000000000000000000000000';
}

// ============================================
// MASTER CONTRACT HOOK
// ============================================

export function useTrustPayContract() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  
  const [txState, setTxState] = useState<TransactionState>({ status: 'idle' });

  const contractAddress = getContractAddress(chainId);
  const isLiskSepolia = chainId === 4202;

  // Reset transaction state
  const resetTx = useCallback(() => {
    setTxState({ status: 'idle' });
  }, []);

  // Generic transaction wrapper
  const executeTransaction = useCallback(async (
    functionName: string,
    args: any[],
    options?: { value?: bigint }
  ): Promise<Hash | null> => {
    if (!walletClient || !address || !publicClient) {
      setTxState({ status: 'error', error: 'Wallet not connected' });
      return null;
    }

    try {
      setTxState({ status: 'preparing' });

      // Simulate first
      const { request } = await publicClient.simulateContract({
        address: contractAddress,
        abi: TRUSTPAY_ESCROW_ABI,
        functionName,
        args,
        account: address,
        value: options?.value
      });

      setTxState({ status: 'confirming' });

      const hash = await walletClient.writeContract(request);
      
      setTxState({ status: 'confirming', hash });

      // Wait for confirmation
      await publicClient.waitForTransactionReceipt({ hash });
      
      setTxState({ status: 'success', hash });
      return hash;

    } catch (error: any) {
      console.error('Transaction error:', error);
      setTxState({ 
        status: 'error', 
        error: error?.shortMessage || error?.message || 'Transaction failed' 
      });
      return null;
    }
  }, [walletClient, address, publicClient, contractAddress]);

  // ==========================================
  // READ FUNCTIONS
  // ==========================================

  const getDeal = useCallback(async (dealId: bigint): Promise<Deal | null> => {
    if (!publicClient) return null;
    try {
      const result = await publicClient.readContract({
        address: contractAddress,
        abi: TRUSTPAY_ESCROW_ABI,
        functionName: 'getDeal',
        args: [dealId]
      }) as any;
      return result as Deal;
    } catch (error) {
      console.error('Error fetching deal:', error);
      return null;
    }
  }, [publicClient, contractAddress]);

  const getMilestones = useCallback(async (dealId: bigint): Promise<Milestone[]> => {
    if (!publicClient) return [];
    try {
      const result = await publicClient.readContract({
        address: contractAddress,
        abi: TRUSTPAY_ESCROW_ABI,
        functionName: 'getMilestones',
        args: [dealId]
      }) as any;
      return result as Milestone[];
    } catch (error) {
      console.error('Error fetching milestones:', error);
      return [];
    }
  }, [publicClient, contractAddress]);

  const getUserDeals = useCallback(async (userAddress?: `0x${string}`): Promise<bigint[]> => {
    if (!publicClient) return [];
    const targetAddress = userAddress || address;
    if (!targetAddress) return [];
    
    try {
      const result = await publicClient.readContract({
        address: contractAddress,
        abi: TRUSTPAY_ESCROW_ABI,
        functionName: 'getUserDeals',
        args: [targetAddress]
      }) as any;
      return result as bigint[];
    } catch (error) {
      console.error('Error fetching user deals:', error);
      return [];
    }
  }, [publicClient, contractAddress, address]);

  const getDealCount = useCallback(async (): Promise<bigint> => {
    if (!publicClient) return 0n;
    try {
      const result = await publicClient.readContract({
        address: contractAddress,
        abi: TRUSTPAY_ESCROW_ABI,
        functionName: 'getDealCount'
      }) as any;
      return result as bigint;
    } catch (error) {
      console.error('Error fetching deal count:', error);
      return 0n;
    }
  }, [publicClient, contractAddress]);

  const getTokenBalance = useCallback(async (tokenAddress: `0x${string}`): Promise<bigint> => {
    if (!publicClient || !address) return 0n;
    try {
      const result = await publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address]
      }) as any;
      return result as bigint;
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return 0n;
    }
  }, [publicClient, address]);

  const getTokenAllowance = useCallback(async (tokenAddress: `0x${string}`): Promise<bigint> => {
    if (!publicClient || !address) return 0n;
    try {
      const result = await publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address, contractAddress]
      }) as any;
      return result as bigint;
    } catch (error) {
      console.error('Error fetching allowance:', error);
      return 0n;
    }
  }, [publicClient, address, contractAddress]);

  // ==========================================
  // WRITE FUNCTIONS
  // ==========================================

  const approveToken = useCallback(async (
    tokenAddress: `0x${string}`,
    amount: bigint
  ): Promise<Hash | null> => {
    if (!walletClient || !address || !publicClient) return null;

    try {
      setTxState({ status: 'preparing' });

      const { request } = await publicClient.simulateContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [contractAddress, amount],
        account: address
      });

      setTxState({ status: 'confirming' });
      const hash = await walletClient.writeContract(request);
      
      setTxState({ status: 'confirming', hash });
      await publicClient.waitForTransactionReceipt({ hash });
      
      setTxState({ status: 'success', hash });
      return hash;

    } catch (error: any) {
      setTxState({ status: 'error', error: error?.shortMessage || 'Approval failed' });
      return null;
    }
  }, [walletClient, address, publicClient, contractAddress]);

  const createDeal = useCallback(async (params: {
    freelancer: `0x${string}`;
    mediator: `0x${string}`;
    token: `0x${string}`;
    title: string;
    description: string;
    milestoneTitles: string[];
    milestoneAmounts: bigint[];
    milestoneDeadlines: bigint[];
  }): Promise<Hash | null> => {
    return executeTransaction('createDeal', [
      params.freelancer,
      params.mediator,
      params.token,
      params.title,
      params.description,
      params.milestoneTitles,
      params.milestoneAmounts,
      params.milestoneDeadlines
    ]);
  }, [executeTransaction]);

  const fundDeal = useCallback(async (dealId: bigint): Promise<Hash | null> => {
    return executeTransaction('fundDeal', [dealId]);
  }, [executeTransaction]);

  const submitMilestone = useCallback(async (
    dealId: bigint, 
    milestoneIndex: bigint
  ): Promise<Hash | null> => {
    return executeTransaction('submitMilestone', [dealId, milestoneIndex]);
  }, [executeTransaction]);

  // CRITICAL: Human-only function
  const approveMilestone = useCallback(async (
    dealId: bigint,
    milestoneIndex: bigint
  ): Promise<Hash | null> => {
    return executeTransaction('approveMilestone', [dealId, milestoneIndex]);
  }, [executeTransaction]);

  const rejectMilestone = useCallback(async (
    dealId: bigint,
    milestoneIndex: bigint,
    reason: string
  ): Promise<Hash | null> => {
    return executeTransaction('rejectMilestone', [dealId, milestoneIndex, reason]);
  }, [executeTransaction]);

  const openDispute = useCallback(async (
    dealId: bigint,
    milestoneIndex: bigint
  ): Promise<Hash | null> => {
    return executeTransaction('openDispute', [dealId, milestoneIndex]);
  }, [executeTransaction]);

  // CRITICAL: Mediator-only function
  const resolveDispute = useCallback(async (
    dealId: bigint,
    milestoneIndex: bigint,
    winner: `0x${string}`,
    freelancerPercentage: bigint
  ): Promise<Hash | null> => {
    return executeTransaction('resolveDispute', [dealId, milestoneIndex, winner, freelancerPercentage]);
  }, [executeTransaction]);

  const cancelDeal = useCallback(async (dealId: bigint): Promise<Hash | null> => {
    return executeTransaction('cancelDeal', [dealId]);
  }, [executeTransaction]);

  return {
    // Connection state
    isConnected,
    address,
    chainId,
    isLiskSepolia,
    contractAddress,
    
    // Transaction state
    txState,
    resetTx,
    
    // Read functions
    getDeal,
    getMilestones,
    getUserDeals,
    getDealCount,
    getTokenBalance,
    getTokenAllowance,
    
    // Write functions
    approveToken,
    createDeal,
    fundDeal,
    submitMilestone,
    approveMilestone,    // Human-only
    rejectMilestone,
    openDispute,
    resolveDispute,      // Mediator-only
    cancelDeal,
    
    // Utilities
    getContractAddress: () => contractAddress,
    getTokenAddress: (token: 'usdc' | 'usdt' | 'mockUsdc') => getTokenAddress(chainId, token)
  };
}

// ============================================
// SPECIALIZED HOOKS
// ============================================

/**
 * Hook for managing deal creation flow
 */
export function useCreateDealFlow() {
  const contract = useTrustPayContract();
  const [step, setStep] = useState<'idle' | 'approving' | 'creating' | 'success' | 'error'>('idle');

  const createDealWithApproval = useCallback(async (params: {
    freelancer: `0x${string}`;
    mediator: `0x${string}`;
    token: `0x${string}`;
    title: string;
    description: string;
    milestoneTitles: string[];
    milestoneAmounts: bigint[];
    milestoneDeadlines: bigint[];
    totalAmount: bigint;
  }) => {
    try {
      // Check allowance
      const allowance = await contract.getTokenAllowance(params.token);
      const fee = (params.totalAmount * 200n) / 10000n; // 2% fee
      const totalRequired = params.totalAmount + fee;

      // Step 1: Approve if needed
      if (allowance < totalRequired) {
        setStep('approving');
        const approveHash = await contract.approveToken(params.token, totalRequired);
        if (!approveHash) {
          setStep('error');
          return null;
        }
      }

      // Step 2: Create deal
      setStep('creating');
      const createHash = await contract.createDeal({
        freelancer: params.freelancer,
        mediator: params.mediator,
        token: params.token,
        title: params.title,
        description: params.description,
        milestoneTitles: params.milestoneTitles,
        milestoneAmounts: params.milestoneAmounts,
        milestoneDeadlines: params.milestoneDeadlines
      });

      if (createHash) {
        setStep('success');
        return createHash;
      } else {
        setStep('error');
        return null;
      }

    } catch (error) {
      setStep('error');
      return null;
    }
  }, [contract]);

  const reset = useCallback(() => {
    setStep('idle');
    contract.resetTx();
  }, [contract]);

  return {
    step,
    txState: contract.txState,
    createDealWithApproval,
    reset
  };
}

/**
 * Hook for funding a deal
 */
export function useFundDealFlow() {
  const contract = useTrustPayContract();
  const [step, setStep] = useState<'idle' | 'approving' | 'funding' | 'success' | 'error'>('idle');

  const fundWithApproval = useCallback(async (
    dealId: bigint,
    tokenAddress: `0x${string}`,
    totalAmount: bigint
  ) => {
    try {
      const allowance = await contract.getTokenAllowance(tokenAddress);
      const fee = (totalAmount * 200n) / 10000n;
      const totalRequired = totalAmount + fee;

      if (allowance < totalRequired) {
        setStep('approving');
        const approveHash = await contract.approveToken(tokenAddress, totalRequired);
        if (!approveHash) {
          setStep('error');
          return null;
        }
      }

      setStep('funding');
      const fundHash = await contract.fundDeal(dealId);

      if (fundHash) {
        setStep('success');
        return fundHash;
      } else {
        setStep('error');
        return null;
      }

    } catch (error) {
      setStep('error');
      return null;
    }
  }, [contract]);

  const reset = useCallback(() => {
    setStep('idle');
    contract.resetTx();
  }, [contract]);

  return {
    step,
    txState: contract.txState,
    fundWithApproval,
    reset
  };
}

/**
 * Hook for fetching and managing user deals
 */
export function useUserDealsData() {
  const contract = useTrustPayContract();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeals = useCallback(async () => {
    if (!contract.isConnected) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const dealIds = await contract.getUserDeals();
      const dealPromises = dealIds.map(id => contract.getDeal(id));
      const dealResults = await Promise.all(dealPromises);
      
      setDeals(dealResults.filter((d): d is Deal => d !== null));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    fetchDeals();
  }, [contract.isConnected, contract.address]);

  return {
    deals,
    loading,
    error,
    refetch: fetchDeals
  };
}

// Export utilities
export { parseUnits, formatUnits };
