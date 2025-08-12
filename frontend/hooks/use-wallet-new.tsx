'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import algosdk from 'algosdk';
import { algodClient } from '@/lib/algorand';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: number;
  connect: (preferredWallet?: 'pera' | 'demo') => Promise<void>;
  disconnect: () => void;
  signTransaction: (txn: algosdk.Transaction) => Promise<Uint8Array>;
  loading: boolean;
  error: string | null;
  walletType: 'pera' | 'demo' | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Dynamic import for Pera Wallet to avoid SSR issues
let PeraWalletConnect: any = null;
let peraWallet: any = null;

if (typeof window !== 'undefined') {
  import('@perawallet/connect').then((module) => {
    PeraWalletConnect = module.PeraWalletConnect;
    peraWallet = new PeraWalletConnect();
  }).catch((err) => {
    console.warn('Pera Wallet not available:', err);
  });
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<'pera' | 'demo' | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check for existing Pera Wallet connection
    if (peraWallet) {
      peraWallet.reconnectSession()
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            setWalletType('pera');
            fetchBalance(accounts[0]);
          }
        })
        .catch((error: any) => {
          console.log('No existing Pera Wallet session:', error);
          
          // Check for demo connection fallback
          const savedAddress = localStorage.getItem('algorand_address');
          const savedWalletType = localStorage.getItem('wallet_type');
          
          if (savedAddress && savedWalletType === 'demo') {
            setAddress(savedAddress);
            setIsConnected(true);
            setWalletType('demo');
            fetchBalance(savedAddress);
          }
        });
    } else {
      // If Pera Wallet not available, check for demo connection
      const savedAddress = localStorage.getItem('algorand_address');
      const savedWalletType = localStorage.getItem('wallet_type');
      
      if (savedAddress && savedWalletType === 'demo') {
        setAddress(savedAddress);
        setIsConnected(true);
        setWalletType('demo');
        fetchBalance(savedAddress);
      }
    }
      
    // Listen for Pera Wallet disconnect
    if (peraWallet && peraWallet.connector) {
      peraWallet.connector.on('disconnect', () => disconnect());
    }
    
    return () => {
      if (peraWallet && peraWallet.connector) {
        try {
          peraWallet.connector.off('disconnect');
        } catch (error) {
          console.warn('Error removing Pera Wallet listener:', error);
        }
      }
    };
  }, []);

  const fetchBalance = async (addr: string) => {
    if (!isClient) return;
    
    try {
      if (!addr || addr.length !== 58) {
        console.warn('Invalid address format, skipping balance fetch');
        setBalance(0);
        return;
      }
      
      const accountInfo = await algodClient.accountInformation(addr).do();
      setBalance(Number(accountInfo.amount) / 1000000); // Convert microAlgos to Algos
    } catch (err) {
      console.error('Failed to fetch balance:', err);
      setBalance(0);
    }
  };

  const connectPeraWallet = async () => {
    try {
      // Check if Pera Wallet is available
      if (typeof window === 'undefined') {
        throw new Error('Window not available');
      }

      if (!peraWallet) {
        throw new Error('Pera Wallet not initialized. Please install Pera Wallet and refresh the page.');
      }

      const accounts = await peraWallet.connect();
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        setWalletType('pera');
        localStorage.setItem('algorand_address', accounts[0]);
        localStorage.setItem('wallet_type', 'pera');
        await fetchBalance(accounts[0]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Pera Wallet connection failed:', error);
      // If it's a user rejection or wallet not found, provide helpful message
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage?.includes('User rejected') || errorMessage?.includes('rejected')) {
        throw new Error('Connection cancelled by user');
      } else if (errorMessage?.includes('No wallet') || errorMessage?.includes('not initialized')) {
        throw new Error('Pera Wallet not found. Please install Pera Wallet first.');
      }
      throw new Error('Failed to connect to Pera Wallet. Please try again.');
    }
  };

  const connectDemoWallet = async () => {
    // Use your actual TestNet address for demo
    const demoAddress = "33FPGTKRHHYWOZQWNQB6EOA67O3UTIZKMXM7JUJDXPMHVWTWBL4L4HDBUU";
    
    setAddress(demoAddress);
    setIsConnected(true);
    setWalletType('demo');
    localStorage.setItem('algorand_address', demoAddress);
    localStorage.setItem('wallet_type', 'demo');
    await fetchBalance(demoAddress);
  };

  const connect = async (preferredWallet: 'pera' | 'demo' = 'pera') => {
    if (!isClient) return;
    
    setLoading(true);
    setError(null);

    try {
      if (preferredWallet === 'pera') {
        try {
          await connectPeraWallet();
        } catch (peraError) {
          const errorMessage = peraError instanceof Error ? peraError.message : String(peraError);
          console.warn('Pera Wallet failed:', errorMessage);
          
          // If user cancelled, don't fallback to demo
          if (errorMessage.includes('cancelled by user')) {
            throw peraError;
          }
          
          // For other errors, show specific message but don't auto-fallback
          setError(`Pera Wallet connection failed: ${errorMessage}. You can try Demo Mode instead.`);
          throw peraError;
        }
      } else {
        await connectDemoWallet();
      }
    } catch (err) {
      if (!error) { // Only set error if not already set above
        const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
        setError(errorMessage);
      }
      console.error('Connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    if (!isClient) return;
    
    if (walletType === 'pera' && peraWallet) {
      try {
        peraWallet.disconnect();
      } catch (error) {
        console.warn('Error disconnecting Pera Wallet:', error);
      }
    }
    
    setAddress(null);
    setIsConnected(false);
    setBalance(0);
    setWalletType(null);
    localStorage.removeItem('algorand_address');
    localStorage.removeItem('wallet_type');
  };

  const signTransaction = async (txn: algosdk.Transaction): Promise<Uint8Array> => {
    if (!address || !isConnected) {
      throw new Error('No wallet connected');
    }

    try {
      if (walletType === 'pera') {
        if (!peraWallet) {
          throw new Error('Pera Wallet not available');
        }
        // Use Pera Wallet to sign
        const signedTxns = await peraWallet.signTransaction([
          [{ txn, signers: [address] }]
        ]);
        return signedTxns[0];
      } else if (walletType === 'demo') {
        // For demo mode, we'll create a mock signature
        // In production, this would prompt the user to use a real wallet
        throw new Error('Demo wallet cannot sign transactions. Please connect Pera Wallet for real transactions.');
      } else {
        throw new Error('No wallet type selected');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to sign transaction: ${errorMessage}`);
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
    walletType,
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
