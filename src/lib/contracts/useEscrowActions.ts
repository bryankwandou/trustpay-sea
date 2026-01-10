'use client';

/**
 * TrustPay SEA - Production-Ready Escrow Actions Hook
 * Real blockchain integration dengan Lisk Sepolia
 * Human-in-the-loop: Semua aksi finansial memerlukan konfirmasi user
 */

import { useState, useCallback } from 'react';
import { useAccount, useChainId, usePublicClient, useWalletClient } from 'wagmi';
import { parseUnits, formatUnits, encodeFunctionData, type Address } from 'viem';
import { 
  TRUSTPAY_ESCROW_ABI, 
  ERC20_ABI, 
  CONTRACT_ADDRESSES,
  SUPPORTED_TOKENS,
  PLATFORM_CONFIG,
  getExplorerUrl,
  type SupportedNetwork 
} from './config';

// ============================================
// TYPES
// ============================================

export interface TransactionState {
  status: 'idle' | 'preparing' | 'awaiting_approval' | 'pending' | 'success' | 'error';
  hash?: `0x${string}`;
  error?: string;
  explorerUrl?: string;
}

export interface CreateDealParams {
  freelancerAddress: Address;
  mediatorAddress?: Address;
  tokenSymbol: 'usdc' | 'usdt';
  title: string;
  description: string;
  milestones: {
    title: string;
    amount: number; // In human readable (e.g., 100 USDC)
    deadlineTimestamp: number;
  }[];
}

export interface MilestoneActionParams {
  dealId: bigint;
  milestoneIndex: bigint;
}

export interface DisputeResolutionParams {
  dealId: bigint;
  milestoneIndex: bigint;
  winner: Address;
  freelancerPercentage: number; // 0-100
}

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

function getNetworkConfig(chainId: number | undefined) {
  const network = NETWORK_MAP[chainId || 4202] || 'liskSepolia';
  return {
    network,
    addresses: CONTRACT_ADDRESSES[network],
  };
}

// ============================================
// MAIN HOOK
// ============================================

export function useEscrowActions() {
  const { address: userAddress } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [txState, setTxState] = useState<TransactionState>({ status: 'idle' });

  const { addresses } = getNetworkConfig(chainId);

  // Reset state
  const resetState = useCallback(() => {
    setTxState({ status: 'idle' });
  }, []);

  // ============================================
  // CREATE DEAL
  // ============================================
  const createDeal = useCallback(async (params: CreateDealParams) => {
    if (!walletClient || !userAddress || !publicClient) {
      setTxState({ status: 'error', error: 'Wallet not connected' });
      return null;
    }

    try {
      setTxState({ status: 'preparing' });

      const tokenAddress = addresses[params.tokenSymbol] as Address;
      const escrowAddress = addresses.escrow as Address;
      const tokenDecimals = SUPPORTED_TOKENS[params.tokenSymbol].decimals;
      
      // Zero address for no mediator
      const mediatorAddress = params.mediatorAddress || '0x0000000000000000000000000000000000000000' as Address;

      // Prepare milestone data
      const milestoneTitles = params.milestones.map(m => m.title);
      const milestoneAmounts = params.milestones.map(m => 
        parseUnits(m.amount.toString(), tokenDecimals)
      );
      const milestoneDeadlines = params.milestones.map(m => BigInt(m.deadlineTimestamp));

      setTxState({ status: 'awaiting_approval' });

      // Execute create deal transaction
      const hash = await walletClient.writeContract({
        address: escrowAddress,
        abi: TRUSTPAY_ESCROW_ABI,
        functionName: 'createDeal',
        args: [
          params.freelancerAddress,
          mediatorAddress,
          tokenAddress,
          params.title,
          params.description,
          milestoneTitles,
          milestoneAmounts,
          milestoneDeadlines
        ]
      });

      setTxState({ 
        status: 'pending', 
        hash,
        explorerUrl: getExplorerUrl(chainId, hash)
      });

      // Wait for confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === 'success') {
        setTxState({ 
          status: 'success', 
          hash,
          explorerUrl: getExplorerUrl(chainId, hash)
        });

        // Extract dealId from logs (DealCreated event)
        // Event signature: DealCreated(uint256 indexed dealId, address indexed client, address indexed freelancer, uint256 totalAmount)
        const dealCreatedLog = receipt.logs.find(log => {
          // In production, properly decode the event
          return log.topics.length >= 3;
        });

        if (dealCreatedLog && dealCreatedLog.topics[1]) {
          const dealId = BigInt(dealCreatedLog.topics[1]);
          return dealId;
        }
      } else {
        setTxState({ status: 'error', error: 'Transaction failed' });
      }

      return null;
    } catch (error: any) {
      console.error('Create deal error:', error);
      setTxState({ 
        status: 'error', 
        error: error.shortMessage || error.message || 'Transaction failed'
      });
      return null;
    }
  }, [walletClient, userAddress, publicClient, addresses, chainId]);

  // ============================================
  // FUND DEAL (2-step: Approve + Fund)
  // ============================================
  const fundDeal = useCallback(async (dealId: bigint, tokenAddress: Address, amount: bigint) => {
    if (!walletClient || !userAddress || !publicClient) {
      setTxState({ status: 'error', error: 'Wallet not connected' });
      return false;
    }

    try {
      const escrowAddress = addresses.escrow as Address;

      // Step 1: Check allowance
      setTxState({ status: 'preparing' });
      
      const currentAllowance = await publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [userAddress, escrowAddress]
      }) as bigint;

      // Step 2: Approve if needed
      if (currentAllowance < amount) {
        setTxState({ status: 'awaiting_approval' });
        
        const approveHash = await walletClient.writeContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [escrowAddress, amount]
        });

        setTxState({ status: 'pending', hash: approveHash });
        
        const approveReceipt = await publicClient.waitForTransactionReceipt({ 
          hash: approveHash 
        });

        if (approveReceipt.status !== 'success') {
          setTxState({ status: 'error', error: 'Token approval failed' });
          return false;
        }
      }

      // Step 3: Fund deal
      setTxState({ status: 'awaiting_approval' });

      const fundHash = await walletClient.writeContract({
        address: escrowAddress,
        abi: TRUSTPAY_ESCROW_ABI,
        functionName: 'fundDeal',
        args: [dealId]
      });

      setTxState({ 
        status: 'pending', 
        hash: fundHash,
        explorerUrl: getExplorerUrl(chainId, fundHash)
      });

      const fundReceipt = await publicClient.waitForTransactionReceipt({ hash: fundHash });

      if (fundReceipt.status === 'success') {
        setTxState({ 
          status: 'success', 
          hash: fundHash,
          explorerUrl: getExplorerUrl(chainId, fundHash)
        });
        return true;
      } else {
        setTxState({ status: 'error', error: 'Fund transaction failed' });
        return false;
      }
    } catch (error: any) {
      console.error('Fund deal error:', error);
      setTxState({ 
        status: 'error', 
        error: error.shortMessage || error.message || 'Transaction failed'
      });
      return false;
    }
  }, [walletClient, userAddress, publicClient, addresses, chainId]);

  // ============================================
  // SUBMIT MILESTONE (Freelancer)
  // ============================================
  const submitMilestone = useCallback(async ({ dealId, milestoneIndex }: MilestoneActionParams) => {
    if (!walletClient || !publicClient) {
      setTxState({ status: 'error', error: 'Wallet not connected' });
      return false;
    }

    try {
      setTxState({ status: 'awaiting_approval' });

      const hash = await walletClient.writeContract({
        address: addresses.escrow as Address,
        abi: TRUSTPAY_ESCROW_ABI,
        functionName: 'submitMilestone',
        args: [dealId, milestoneIndex]
      });

      setTxState({ 
        status: 'pending', 
        hash,
        explorerUrl: getExplorerUrl(chainId, hash)
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === 'success') {
        setTxState({ 
          status: 'success', 
          hash,
          explorerUrl: getExplorerUrl(chainId, hash)
        });
        return true;
      }
      
      setTxState({ status: 'error', error: 'Transaction failed' });
      return false;
    } catch (error: any) {
      setTxState({ 
        status: 'error', 
        error: error.shortMessage || error.message 
      });
      return false;
    }
  }, [walletClient, publicClient, addresses, chainId]);

  // ============================================
  // APPROVE MILESTONE (Client) - HUMAN-IN-THE-LOOP
  // This releases funds - ONLY human can trigger
  // ============================================
  const approveMilestone = useCallback(async ({ dealId, milestoneIndex }: MilestoneActionParams) => {
    if (!walletClient || !publicClient) {
      setTxState({ status: 'error', error: 'Wallet not connected' });
      return false;
    }

    try {
      setTxState({ status: 'awaiting_approval' });

      const hash = await walletClient.writeContract({
        address: addresses.escrow as Address,
        abi: TRUSTPAY_ESCROW_ABI,
        functionName: 'approveMilestone',
        args: [dealId, milestoneIndex]
      });

      setTxState({ 
        status: 'pending', 
        hash,
        explorerUrl: getExplorerUrl(chainId, hash)
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === 'success') {
        setTxState({ 
          status: 'success', 
          hash,
          explorerUrl: getExplorerUrl(chainId, hash)
        });
        return true;
      }

      setTxState({ status: 'error', error: 'Transaction failed' });
      return false;
    } catch (error: any) {
      setTxState({ 
        status: 'error', 
        error: error.shortMessage || error.message 
      });
      return false;
    }
  }, [walletClient, publicClient, addresses, chainId]);

  // ============================================
  // REJECT MILESTONE (Client)
  // ============================================
  const rejectMilestone = useCallback(async (
    { dealId, milestoneIndex }: MilestoneActionParams, 
    reason: string
  ) => {
    if (!walletClient || !publicClient) {
      setTxState({ status: 'error', error: 'Wallet not connected' });
      return false;
    }

    try {
      setTxState({ status: 'awaiting_approval' });

      const hash = await walletClient.writeContract({
        address: addresses.escrow as Address,
        abi: TRUSTPAY_ESCROW_ABI,
        functionName: 'rejectMilestone',
        args: [dealId, milestoneIndex, reason]
      });

      setTxState({ 
        status: 'pending', 
        hash,
        explorerUrl: getExplorerUrl(chainId, hash)
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === 'success') {
        setTxState({ 
          status: 'success', 
          hash,
          explorerUrl: getExplorerUrl(chainId, hash)
        });
        return true;
      }

      setTxState({ status: 'error', error: 'Transaction failed' });
      return false;
    } catch (error: any) {
      setTxState({ 
        status: 'error', 
        error: error.shortMessage || error.message 
      });
      return false;
    }
  }, [walletClient, publicClient, addresses, chainId]);

  // ============================================
  // OPEN DISPUTE
  // ============================================
  const openDispute = useCallback(async ({ dealId, milestoneIndex }: MilestoneActionParams) => {
    if (!walletClient || !publicClient) {
      setTxState({ status: 'error', error: 'Wallet not connected' });
      return false;
    }

    try {
      setTxState({ status: 'awaiting_approval' });

      const hash = await walletClient.writeContract({
        address: addresses.escrow as Address,
        abi: TRUSTPAY_ESCROW_ABI,
        functionName: 'openDispute',
        args: [dealId, milestoneIndex]
      });

      setTxState({ 
        status: 'pending', 
        hash,
        explorerUrl: getExplorerUrl(chainId, hash)
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === 'success') {
        setTxState({ 
          status: 'success', 
          hash,
          explorerUrl: getExplorerUrl(chainId, hash)
        });
        return true;
      }

      setTxState({ status: 'error', error: 'Transaction failed' });
      return false;
    } catch (error: any) {
      setTxState({ 
        status: 'error', 
        error: error.shortMessage || error.message 
      });
      return false;
    }
  }, [walletClient, publicClient, addresses, chainId]);

  // ============================================
  // RESOLVE DISPUTE (Mediator) - HUMAN DECISION
  // ============================================
  const resolveDispute = useCallback(async (params: DisputeResolutionParams) => {
    if (!walletClient || !publicClient) {
      setTxState({ status: 'error', error: 'Wallet not connected' });
      return false;
    }

    try {
      setTxState({ status: 'awaiting_approval' });

      const hash = await walletClient.writeContract({
        address: addresses.escrow as Address,
        abi: TRUSTPAY_ESCROW_ABI,
        functionName: 'resolveDispute',
        args: [
          params.dealId, 
          params.milestoneIndex, 
          params.winner,
          BigInt(params.freelancerPercentage)
        ]
      });

      setTxState({ 
        status: 'pending', 
        hash,
        explorerUrl: getExplorerUrl(chainId, hash)
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === 'success') {
        setTxState({ 
          status: 'success', 
          hash,
          explorerUrl: getExplorerUrl(chainId, hash)
        });
        return true;
      }

      setTxState({ status: 'error', error: 'Transaction failed' });
      return false;
    } catch (error: any) {
      setTxState({ 
        status: 'error', 
        error: error.shortMessage || error.message 
      });
      return false;
    }
  }, [walletClient, publicClient, addresses, chainId]);

  return {
    // State
    txState,
    isLoading: ['preparing', 'awaiting_approval', 'pending'].includes(txState.status),
    isSuccess: txState.status === 'success',
    isError: txState.status === 'error',
    
    // Actions
    createDeal,
    fundDeal,
    submitMilestone,
    approveMilestone,
    rejectMilestone,
    openDispute,
    resolveDispute,
    resetState,
    
    // Addresses
    escrowAddress: addresses.escrow,
    usdcAddress: addresses.usdc,
    usdtAddress: addresses.usdt,
  };
}

export default useEscrowActions;
