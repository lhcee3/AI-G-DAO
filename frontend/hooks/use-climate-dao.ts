'use client';

import { useState } from 'react';
import algosdk from 'algosdk';
import { algodClient, getSuggestedParams, waitForConfirmation, CONTRACT_IDS } from '@/lib/algorand';
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

  const submitProposal = async (
    title: string,
    description: string,
    fundingAmount: number,
    impactScore: number
  ) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const suggestedParams = await getSuggestedParams();
      
      // Encode arguments
      const titleEncoded = new Uint8Array(Buffer.from(title));
      const descriptionEncoded = new Uint8Array(Buffer.from(description));
      const fundingEncoded = algosdk.encodeUint64(fundingAmount);
      const impactEncoded = algosdk.encodeUint64(impactScore);

      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        sender: address,
        appIndex: CONTRACT_IDS.CLIMATE_DAO,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('submit_proposal')),
          titleEncoded,
          descriptionEncoded,
          fundingEncoded,
          impactEncoded,
        ],
        suggestedParams,
      });

      const signedTxn = await signTransaction(appCallTxn);
      const response = await algodClient.sendRawTransaction(signedTxn).do();
      const txId = response.txid;
      
      await waitForConfirmation(txId);
      
      return txId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Proposal submission failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const voteOnProposal = async (proposalId: number, vote: boolean) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const suggestedParams = await getSuggestedParams();
      
      const proposalIdEncoded = algosdk.encodeUint64(proposalId);
      const voteEncoded = new Uint8Array([vote ? 1 : 0]);

      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        sender: address,
        appIndex: CONTRACT_IDS.CLIMATE_DAO,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('vote_on_proposal')),
          proposalIdEncoded,
          voteEncoded,
        ],
        suggestedParams,
      });

      const signedTxn = await signTransaction(appCallTxn);
      const response = await algodClient.sendRawTransaction(signedTxn).do();
      const txId = response.txid;
      
      await waitForConfirmation(txId);
      
      await waitForConfirmation(txId);
      
      return txId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Voting failed';
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
