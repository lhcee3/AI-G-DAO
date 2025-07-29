'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import algosdk from 'algosdk';
import { algodClient } from '@/lib/algorand';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: number;
  connect: () => Promise<void>;
  disconnect: () => void;
  signTransaction: (txn: algosdk.Transaction) => Promise<Uint8Array>;
  loading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing connection
    const savedAddress = localStorage.getItem('algorand_address');
    if (savedAddress) {
      setAddress(savedAddress);
      setIsConnected(true);
      fetchBalance(savedAddress);
    }
  }, []);

  const fetchBalance = async (addr: string) => {
    try {
      const accountInfo = await algodClient.accountInformation(addr).do();
      setBalance(Number(accountInfo.amount) / 1000000); // Convert microAlgos to Algos
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
  };

  const connect = async () => {
    setLoading(true);
    setError(null);

    try {
      // For now, we'll use a simple connection method
      // In production, you'd use WalletConnect or other wallet providers
      const testAddress = 'TESTADDRESS123456789'; // Placeholder for development
      
      setAddress(testAddress);
      setIsConnected(true);
      localStorage.setItem('algorand_address', testAddress);
      
      await fetchBalance(testAddress);
    } catch (err) {
      setError('Failed to connect wallet');
      console.error('Connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setBalance(0);
    localStorage.removeItem('algorand_address');
  };

  const signTransaction = async (txn: algosdk.Transaction): Promise<Uint8Array> => {
    if (!address) {
      throw new Error('No wallet connected');
    }

    try {
      // In a real implementation, this would use the connected wallet to sign
      // For now, this is a placeholder
      throw new Error('Transaction signing not implemented yet - connect a real wallet');
    } catch (err) {
      throw new Error(`Failed to sign transaction: ${err}`);
    }
  };

  const value: WalletContextType = {
    isConnected,
    address,
    balance,
    connect,
    disconnect,
    signTransaction,
    loading,
    error,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
