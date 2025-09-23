'use client';

import { useState, useCallback } from 'react';
import algosdk from 'algosdk';
import { algodClient, getSuggestedParams, waitForConfirmation, CONTRACT_IDS } from '@/lib/algorand';
import { TransactionBuilder, confirmTransaction, calculateTransactionCosts, TransactionResult } from '@/lib/transaction-builder';
import { useWalletContext } from './use-wallet';

export function useClimateDAO() {
  const { address, signTransaction, isConnected } = useWalletContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinDAO = async (membershipFee: number) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const suggestedParams = await getSuggestedParams();
      
      // Create payment transaction for membership fee
      const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: address,
        receiver: algosdk.getApplicationAddress(CONTRACT_IDS.CLIMATE_DAO),
        amount: membershipFee * 1000000, // Convert to microAlgos
        suggestedParams,
      });

      // Create application call transaction
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        sender: address,
        appIndex: CONTRACT_IDS.CLIMATE_DAO,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [new Uint8Array(Buffer.from('join_dao'))],
        foreignAssets: [], // Add DAO token ID here when available
        suggestedParams,
      });

      // Group transactions
      const txnGroup = [paymentTxn, appCallTxn];
      algosdk.assignGroupID(txnGroup);

      // Sign transactions
      const signedPayment = await signTransaction(paymentTxn);
      const signedAppCall = await signTransaction(appCallTxn);

      // Submit transactions
      const response = await algodClient.sendRawTransaction([signedPayment, signedAppCall]).do();
      const txId = response.txid;
      
      // Wait for confirmation
      await waitForConfirmation(txId);
      
      return txId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Submit a proposal to the blockchain with reduced ALGO costs
   * Only requires 0.1 ALGO deposit instead of 1 ALGO
   */
  const submitProposal = async (proposalData: {
    title: string
    description: string
    category: string
    fundingAmount: number
    expectedImpact: string
    location: string
  }): Promise<TransactionResult> => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const suggestedParams = await getSuggestedParams();
      
      // Calculate costs - reduced from 1 ALGO to 0.1 ALGO deposit
      const depositAmount = 0.1; // ALGO
      const costs = calculateTransactionCosts(2); // Payment + App call
      
      console.log('Transaction costs:', costs);
      
      // Create transaction group with reduced deposit
      const txnGroup = TransactionBuilder.createProposalWithDeposit(
        { sender: address, suggestedParams },
        CONTRACT_IDS.CLIMATE_DAO,
        proposalData,
        depositAmount
      );

      // Sign all transactions in group
      const signedTxns = [];
      for (const txn of txnGroup) {
        const signedTxn = await signTransaction(txn);
        signedTxns.push(signedTxn);
      }

      // Submit transaction group
      const response = await algodClient.sendRawTransaction(signedTxns).do();
      const txId = response.txid;
      
      console.log('Proposal submitted with txId:', txId);
      
      // Wait for confirmation with detailed results
      const result = await confirmTransaction(algodClient, txId);
      
      console.log('Proposal confirmed:', result);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Proposal submission failed';
      console.error('Proposal submission error:', err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Vote on a proposal with micro-transaction cost (0.001 ALGO + fee)
   * Much cheaper than traditional voting systems
   */
  const voteOnProposal = async (proposalId: number, vote: 'for' | 'against'): Promise<TransactionResult> => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const suggestedParams = await getSuggestedParams();
      
      // Calculate costs - minimal voting cost
      const costs = calculateTransactionCosts(1); // Single app call
      console.log('Voting costs:', costs);
      
      // Create voting transaction
      const voteTxn = TransactionBuilder.createVoteTransaction(
        { sender: address, suggestedParams },
        CONTRACT_IDS.CLIMATE_DAO,
        proposalId,
        vote
      );

      // Sign transaction
      const signedTxn = await signTransaction(voteTxn);
      
      // Submit transaction
      const response = await algodClient.sendRawTransaction(signedTxn).do();
      const txId = response.txid;
      
      console.log('Vote submitted with txId:', txId);
      
      // Wait for confirmation with detailed results
      const result = await confirmTransaction(algodClient, txId);
      
      console.log('Vote confirmed:', result);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Voting failed';
      console.error('Voting error:', err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Read-only methods
  const getMemberTokens = async (memberAddress?: string) => {
    try {
      const targetAddress = memberAddress || address;
      if (!targetAddress) return 0;

      // This would call the get_member_tokens method
      // For now, returning mock data
      return 1000;
    } catch (err) {
      console.error('Failed to get member tokens:', err);
      return 0;
    }
  };

  const getTotalProposals = useCallback(async () => {
    try {
      // This would call the get_total_proposals method
      // For now, returning mock data
      return 5;
    } catch (err) {
      console.error('Failed to get total proposals:', err);
      return 0;
    }
  }, []);

  /**
   * Get proposal details from blockchain by ID
   */
  const getProposal = async (proposalId: number): Promise<{
    id: number;
    title: string;
    description: string;
    creator: string;
    fundingAmount: number;
    voteYes: number;
    voteNo: number;
    status: 'active' | 'passed' | 'rejected' | 'expired';
    endTime: number;
    category: string;
    aiScore?: number;
  } | null> => {
    try {
      // This would call the get_proposal method from smart contract
      // For now, returning mock data based on proposalId
      const mockProposals = [
        {
          id: 1,
          title: "Solar Farm Initiative - Kenya",
          description: "Large-scale solar installation to provide clean energy to rural communities in Kenya. This project aims to install 50MW of solar capacity across multiple villages.",
          creator: "KENYASOLXYZ...ABC123",
          fundingAmount: 500000,
          voteYes: 85,
          voteNo: 12,
          status: 'active' as const,
          endTime: Date.now() + (2 * 24 * 60 * 60 * 1000), // 2 days from now
          category: "renewable-energy",
          aiScore: 8.7
        },
        {
          id: 2,
          title: "Ocean Cleanup Technology - Pacific",
          description: "Deploy advanced cleanup technology to remove plastic waste from the Pacific Ocean. Targeting 1000 tons of plastic removal annually.",
          creator: "OCEANCLNXYZ...DEF456",
          fundingAmount: 750000,
          voteYes: 120,
          voteNo: 8,
          status: 'active' as const,
          endTime: Date.now() + (5 * 24 * 60 * 60 * 1000), // 5 days from now
          category: "ocean-cleanup",
          aiScore: 9.2
        },
        {
          id: 3,
          title: "Urban Forest Expansion - São Paulo",
          description: "Plant 10,000 native trees across São Paulo to improve air quality and urban biodiversity. Includes maintenance and monitoring systems.",
          creator: "FORESTSPXYZ...GHI789",
          fundingAmount: 125000,
          voteYes: 95,
          voteNo: 15,
          status: 'active' as const,
          endTime: Date.now() + (1 * 24 * 60 * 60 * 1000), // 1 day from now
          category: "reforestation",
          aiScore: 7.8
        },
        {
          id: 4,
          title: "Green Hydrogen Production - Chile",
          description: "Establish green hydrogen production facility using renewable energy sources. Target production of 500 tons annually.",
          creator: "HYDROGENXYZ...JKL012",
          fundingAmount: 2000000,
          voteYes: 145,
          voteNo: 25,
          status: 'passed' as const,
          endTime: Date.now() - (1 * 24 * 60 * 60 * 1000), // 1 day ago
          category: "clean-energy",
          aiScore: 8.9
        },
        {
          id: 5,
          title: "Carbon Capture Research - Iceland",
          description: "Research and develop direct air capture technology using geothermal energy. Pilot project for 100 tons CO2 annually.",
          creator: "CARBONCPXYZ...MNO345",
          fundingAmount: 300000,
          voteYes: 65,
          voteNo: 45,
          status: 'rejected' as const,
          endTime: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 days ago
          category: "carbon-capture",
          aiScore: 6.5
        }
      ];

      const proposal = mockProposals.find(p => p.id === proposalId);
      return proposal || null;
    } catch (err) {
      console.error('Failed to get proposal:', err);
      return null;
    }
  };

  /**
   * Get all proposals with optional filtering
   */
  const getProposals = useCallback(async (filters?: {
    status?: 'active' | 'passed' | 'rejected' | 'expired';
    category?: string;
    creator?: string;
  }): Promise<Array<{
    id: number;
    title: string;
    description: string;
    creator: string;
    fundingAmount: number;
    voteYes: number;
    voteNo: number;
    status: 'active' | 'passed' | 'rejected' | 'expired';
    endTime: number;
    category: string;
    aiScore?: number;
  }>> => {
    try {
      // This would call contract methods to get all proposals
      // For now, using the same mock data from getProposal
      const mockProposals = [
        {
          id: 1,
          title: "Solar Farm Initiative - Kenya",
          description: "Large-scale solar installation to provide clean energy to rural communities in Kenya. This project aims to install 50MW of solar capacity across multiple villages.",
          creator: "KENYASOLXYZ...ABC123",
          fundingAmount: 500000,
          voteYes: 85,
          voteNo: 12,
          status: 'active' as const,
          endTime: Date.now() + (2 * 24 * 60 * 60 * 1000),
          category: "renewable-energy",
          aiScore: 8.7
        },
        {
          id: 2,
          title: "Ocean Cleanup Technology - Pacific",
          description: "Deploy advanced cleanup technology to remove plastic waste from the Pacific Ocean. Targeting 1000 tons of plastic removal annually.",
          creator: "OCEANCLNXYZ...DEF456",
          fundingAmount: 750000,
          voteYes: 120,
          voteNo: 8,
          status: 'active' as const,
          endTime: Date.now() + (5 * 24 * 60 * 60 * 1000),
          category: "ocean-cleanup",
          aiScore: 9.2
        },
        {
          id: 3,
          title: "Urban Forest Expansion - São Paulo",
          description: "Plant 10,000 native trees across São Paulo to improve air quality and urban biodiversity. Includes maintenance and monitoring systems.",
          creator: "FORESTSPXYZ...GHI789",
          fundingAmount: 125000,
          voteYes: 95,
          voteNo: 15,
          status: 'active' as const,
          endTime: Date.now() + (1 * 24 * 60 * 60 * 1000),
          category: "reforestation",
          aiScore: 7.8
        },
        {
          id: 4,
          title: "Green Hydrogen Production - Chile",
          description: "Establish green hydrogen production facility using renewable energy sources. Target production of 500 tons annually.",
          creator: "HYDROGENXYZ...JKL012",
          fundingAmount: 2000000,
          voteYes: 145,
          voteNo: 25,
          status: 'passed' as const,
          endTime: Date.now() - (1 * 24 * 60 * 60 * 1000),
          category: "clean-energy",
          aiScore: 8.9
        },
        {
          id: 5,
          title: "Carbon Capture Research - Iceland",
          description: "Research and develop direct air capture technology using geothermal energy. Pilot project for 100 tons CO2 annually.",
          creator: "CARBONCPXYZ...MNO345",
          fundingAmount: 300000,
          voteYes: 65,
          voteNo: 45,
          status: 'rejected' as const,
          endTime: Date.now() - (3 * 24 * 60 * 60 * 1000),
          category: "carbon-capture",
          aiScore: 6.5
        }
      ];

      // Apply filters if provided
      let filteredProposals = mockProposals;
      if (filters) {
        if (filters.status) {
          filteredProposals = filteredProposals.filter(p => p.status === filters.status);
        }
        if (filters.category) {
          filteredProposals = filteredProposals.filter(p => p.category === filters.category);
        }
        if (filters.creator) {
          filteredProposals = filteredProposals.filter(p => p.creator === filters.creator);
        }
      }

      return filteredProposals;
    } catch (err) {
      console.error('Failed to get proposals:', err);
      return [];
    }
  }, []);

  return {
    joinDAO,
    submitProposal,
    voteOnProposal,
    getMemberTokens,
    getTotalProposals,
    getProposal,
    getProposals,
    loading,
    error,
  };
}
