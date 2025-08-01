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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client-side flag to prevent SSR issues
    setIsClient(true);
    
    // Check for existing connection only on client side
    const savedAddress = localStorage.getItem('algorand_address');
    if (savedAddress && savedAddress.length === 58) { // Only process valid addresses
      setAddress(savedAddress);
      setIsConnected(true);
      fetchBalance(savedAddress);
    }
  }, []);

  const fetchBalance = async (addr: string) => {
    if (!isClient) return; // Prevent SSR issues
    
    try {
      // Validate Algorand address format (58 characters, base32)
      if (!addr || addr.length !== 58) {
        console.warn('Invalid address format, skipping balance fetch');
        setBalance(0);
        return;
      }
      
      const accountInfo = await algodClient.accountInformation(addr).do();
      setBalance(Number(accountInfo.amount) / 1000000); // Convert microAlgos to Algos
    } catch (err) {
      console.error('Failed to fetch balance:', err);
      setBalance(0); // Set balance to 0 on error instead of throwing
    }
  };

  const connect = async () => {
    if (!isClient) return; // Prevent SSR issues
    
    setLoading(true);
    setError(null);

    try {
      // For development, we'll simulate connection without actual wallet integration
      // In production, this would integrate with Pera Wallet, MyAlgo, etc.
      
      // Use a valid TestNet address format for demonstration
      const demoAddress = "3YCNRIUFVGOIX4K7K2NLRTIAH23ULNC47NZT6IQTPRTOQUVCWEIFTGTNUA"; 
      
      setAddress(demoAddress);
      setIsConnected(true);
      localStorage.setItem('algorand_address', demoAddress);
      
      // Only fetch balance if we have a real address
      if (demoAddress.length === 58) { // Valid Algorand address length
        await fetchBalance(demoAddress);
      } else {
        setBalance(0); // Set demo balance
      }
    } catch (err) {
      setError('Failed to connect wallet');
      console.error('Connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    if (!isClient) return; // Prevent SSR issues
    
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
