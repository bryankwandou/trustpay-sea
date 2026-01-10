// Real blockchain read hooks for TrustPay SEA
// Optimized for Lisk Sepolia Testnet
'use client';

import { useReadContract, useChainId } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACT_ADDRESSES, TRUSTPAY_ESCROW_ABI } from './config';

// Helper hook to get current contract address
function useEscrowAddress(): `0x${string}` {
  const chainId = useChainId();
  
  // Map chain ID to network key
  const networkMap: Record<number, keyof typeof CONTRACT_ADDRESSES> = {
    4202: 'liskSepolia',
    1135: 'lisk',
    137: 'polygon',
    42161: 'arbitrum',
    8453: 'base',
    80001: 'polygonMumbai',
    84532: 'baseSepolia',
    31337: 'hardhat',
  };
  
  const network = networkMap[chainId] || 'liskSepolia';
  return CONTRACT_ADDRESSES[network].escrow as `0x${string}`;
}

// Types
export interface DealData {
  id: bigint;
  client: `0x${string}`;
  freelancer: `0x${string}`;
  totalAmount: bigint;
  releasedAmount: bigint;
  milestoneCount: bigint;
  completedMilestones: bigint;
  status: number;
  createdAt: bigint;
  deadline: bigint;
  title: string;
  description: string;
}

export interface MilestoneData {
  amount: bigint;
  deadline: bigint;
  status: number;
  title: string;
  description: string;
  submission: string;
  submittedAt: bigint;
}

export interface FormattedDeal {
  id: string;
  client: string;
  freelancer: string;
  totalAmount: string;
  totalAmountRaw: bigint;
  releasedAmount: string;
  releasedAmountRaw: bigint;
  milestoneCount: number;
  completedMilestones: number;
  status: DealStatus;
  statusLabel: string;
  createdAt: Date;
  deadline: Date;
  title: string;
  description: string;
  progress: number;
}

export interface FormattedMilestone {
  index: number;
  amount: string;
  amountRaw: bigint;
  deadline: Date;
  status: MilestoneStatus;
  statusLabel: string;
  title: string;
  description: string;
  submission: string;
  submittedAt: Date | null;
  isOverdue: boolean;
}

export enum DealStatus {
  Created = 0,
  Funded = 1,
  InProgress = 2,
  Completed = 3,
  Disputed = 4,
  Cancelled = 5,
  Refunded = 6
}

export enum MilestoneStatus {
  Pending = 0,
  Submitted = 1,
  Approved = 2,
  Rejected = 3,
  Disputed = 4
}

// Status label helpers
export const getDealStatusLabel = (status: DealStatus): string => {
  const labels: Record<DealStatus, string> = {
    [DealStatus.Created]: 'Menunggu Pembayaran',
    [DealStatus.Funded]: 'Dana Tersimpan',
    [DealStatus.InProgress]: 'Sedang Dikerjakan',
    [DealStatus.Completed]: 'Selesai',
    [DealStatus.Disputed]: 'Dalam Sengketa',
    [DealStatus.Cancelled]: 'Dibatalkan',
    [DealStatus.Refunded]: 'Dana Dikembalikan'
  };
  return labels[status] || 'Unknown';
};

export const getMilestoneStatusLabel = (status: MilestoneStatus): string => {
  const labels: Record<MilestoneStatus, string> = {
    [MilestoneStatus.Pending]: 'Menunggu',
    [MilestoneStatus.Submitted]: 'Sudah Dikirim',
    [MilestoneStatus.Approved]: 'Disetujui',
    [MilestoneStatus.Rejected]: 'Ditolak',
    [MilestoneStatus.Disputed]: 'Sengketa'
  };
  return labels[status] || 'Unknown';
};

// Format deal data from contract
export const formatDealData = (data: DealData): FormattedDeal => {
  const status = Number(data.status) as DealStatus;
  const milestoneCount = Number(data.milestoneCount);
  const completedMilestones = Number(data.completedMilestones);
  
  return {
    id: data.id.toString(),
    client: data.client,
    freelancer: data.freelancer,
    totalAmount: formatEther(data.totalAmount),
    totalAmountRaw: data.totalAmount,
    releasedAmount: formatEther(data.releasedAmount),
    releasedAmountRaw: data.releasedAmount,
    milestoneCount,
    completedMilestones,
    status,
    statusLabel: getDealStatusLabel(status),
    createdAt: new Date(Number(data.createdAt) * 1000),
    deadline: new Date(Number(data.deadline) * 1000),
    title: data.title,
    description: data.description,
    progress: milestoneCount > 0 ? Math.round((completedMilestones / milestoneCount) * 100) : 0
  };
};

// Format milestone data from contract
export const formatMilestoneData = (data: MilestoneData, index: number): FormattedMilestone => {
  const status = Number(data.status) as MilestoneStatus;
  const deadline = new Date(Number(data.deadline) * 1000);
  const now = new Date();
  
  return {
    index,
    amount: formatEther(data.amount),
    amountRaw: data.amount,
    deadline,
    status,
    statusLabel: getMilestoneStatusLabel(status),
    title: data.title,
    description: data.description,
    submission: data.submission,
    submittedAt: Number(data.submittedAt) > 0 ? new Date(Number(data.submittedAt) * 1000) : null,
    isOverdue: deadline < now && status === MilestoneStatus.Pending
  };
};

// Hook: Get total deal count
export function useDealCount() {
  const escrowAddress = useEscrowAddress();
  
  const { data, isLoading, error, refetch } = useReadContract({
    address: escrowAddress,
    abi: TRUSTPAY_ESCROW_ABI,
    functionName: 'dealCounter',
  });

  return {
    count: data ? Number(data) : 0,
    isLoading,
    error,
    refetch
  };
}

// Hook: Get single deal by ID - renamed to avoid conflict with hooks.ts
export function useDealRead(dealId: string | number | undefined) {
  const escrowAddress = useEscrowAddress();
  
  const { data, isLoading, error, refetch } = useReadContract({
    address: escrowAddress,
    abi: TRUSTPAY_ESCROW_ABI,
    functionName: 'getDeal',
    args: dealId !== undefined ? [BigInt(dealId)] : undefined,
    query: {
      enabled: dealId !== undefined,
    }
  });

  return {
    deal: data ? formatDealData(data as DealData) : null,
    rawDeal: data as DealData | undefined,
    isLoading,
    error,
    refetch
  };
}

// Hook: Get milestone by deal ID and index
export function useMilestone(dealId: string | number | undefined, milestoneIndex: number | undefined) {
  const escrowAddress = useEscrowAddress();
  
  const { data, isLoading, error, refetch } = useReadContract({
    address: escrowAddress,
    abi: TRUSTPAY_ESCROW_ABI,
    functionName: 'getMilestone',
    args: dealId !== undefined && milestoneIndex !== undefined 
      ? [BigInt(dealId), BigInt(milestoneIndex)] 
      : undefined,
    query: {
      enabled: dealId !== undefined && milestoneIndex !== undefined,
    }
  });

  return {
    milestone: data ? formatMilestoneData(data as MilestoneData, milestoneIndex || 0) : null,
    rawMilestone: data as MilestoneData | undefined,
    isLoading,
    error,
    refetch
  };
}

// Hook: Get all milestones for a deal
// Note: Uses multiple individual calls for better type safety
export function useDealMilestones(dealId: string | number | undefined, milestoneCount: number) {
  const escrowAddress = useEscrowAddress();
  
  // For now, use getMilestones function that returns all at once
  const { data, isLoading, error, refetch } = useReadContract({
    address: escrowAddress,
    abi: TRUSTPAY_ESCROW_ABI,
    functionName: 'getMilestones',
    args: dealId !== undefined ? [BigInt(dealId)] : undefined,
    query: {
      enabled: dealId !== undefined && milestoneCount > 0,
    }
  });

  const milestones: FormattedMilestone[] = [];
  if (data && Array.isArray(data)) {
    (data as MilestoneData[]).forEach((milestone, index) => {
      milestones.push(formatMilestoneData(milestone, index));
    });
  }

  return {
    milestones,
    isLoading,
    error,
    refetch
  };
}

// Hook: Get deals by user (as client)
export function useUserDealsAsClient(address: `0x${string}` | undefined) {
  const escrowAddress = useEscrowAddress();
  
  const { data, isLoading, error, refetch } = useReadContract({
    address: escrowAddress,
    abi: TRUSTPAY_ESCROW_ABI,
    functionName: 'getClientDeals',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });

  return {
    dealIds: data ? (data as bigint[]).map(id => id.toString()) : [],
    isLoading,
    error,
    refetch
  };
}

// Hook: Get deals by user (as freelancer)
export function useUserDealsAsFreelancer(address: `0x${string}` | undefined) {
  const escrowAddress = useEscrowAddress();
  
  const { data, isLoading, error, refetch } = useReadContract({
    address: escrowAddress,
    abi: TRUSTPAY_ESCROW_ABI,
    functionName: 'getFreelancerDeals',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });

  return {
    dealIds: data ? (data as bigint[]).map(id => id.toString()) : [],
    isLoading,
    error,
    refetch
  };
}

// Hook: Get platform fee
export function usePlatformFee() {
  const escrowAddress = useEscrowAddress();
  
  const { data, isLoading, error } = useReadContract({
    address: escrowAddress,
    abi: TRUSTPAY_ESCROW_ABI,
    functionName: 'platformFee',
  });

  return {
    fee: data ? Number(data) / 100 : 2.5, // Default 2.5%
    feeRaw: data as bigint | undefined,
    isLoading,
    error
  };
}

// Hook: Check if user is deal participant
export function useIsDealParticipant(dealId: string | number | undefined, address: `0x${string}` | undefined) {
  const { deal } = useDealRead(dealId);
  
  if (!deal || !address) {
    return { isClient: false, isFreelancer: false, isParticipant: false };
  }

  const isClient = deal.client.toLowerCase() === address.toLowerCase();
  const isFreelancer = deal.freelancer.toLowerCase() === address.toLowerCase();

  return {
    isClient,
    isFreelancer,
    isParticipant: isClient || isFreelancer
  };
}
