'use client';

import { useState } from 'react';
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

  const getTotalProposals = async () => {
    try {
      // This would call the get_total_proposals method
      // For now, returning mock data
      return 5;
    } catch (err) {
      console.error('Failed to get total proposals:', err);
      return 0;
    }
  };

  return {
    joinDAO,
    submitProposal,
    voteOnProposal,
    getMemberTokens,
    getTotalProposals,
    loading,
    error,
  };
}
