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
  // Add a delay to ensure the browser extension is ready
  setTimeout(() => {
    import('@perawallet/connect').then((module) => {
      PeraWalletConnect = module.PeraWalletConnect;
      try {
        peraWallet = new PeraWalletConnect({
          // Add bridge URL explicitly
          bridge: 'https://bridge.walletconnect.org'
        });
      } catch (error) {
        console.warn('Pera Wallet initialization failed:', error);
      }
    }).catch((err) => {
      console.warn('Pera Wallet not available:', err);
    });
  }, 1000); // Wait 1 second for browser extension to load
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

      // Check if Pera Wallet extension is available
      if (typeof window !== 'undefined') {
        // Try to detect if Pera Wallet mobile app is available
        console.log('Attempting Pera Wallet connection...');
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
      // Handle different types of errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Check if user cancelled - these should be silent
      if (errorMessage?.includes('User rejected') || 
          errorMessage?.includes('rejected') ||
          errorMessage?.includes('cancelled') ||
          errorMessage?.includes('User denied') ||
          errorMessage?.includes('Modal closed by user') ||
          errorMessage?.includes('Connection request reset') ||
          errorMessage?.includes('Receiving end does not exist')) {
        // User cancelled or extension issue - this is normal behavior, don't throw error
        console.log('Pera Wallet connection cancelled or extension not ready');
        return false;
      }
      
      // For actual errors, provide helpful messages
      if (errorMessage?.includes('No wallet') || errorMessage?.includes('not initialized')) {
        throw new Error('Pera Wallet not found. Please install Pera Wallet first.');
      }
      
      // Log the error for debugging but provide user-friendly message
      console.warn('Pera Wallet connection failed:', error);
      throw new Error('Failed to connect to Pera Wallet. Please try again or use Demo Mode.');
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
        const connected = await connectPeraWallet();
        if (!connected) {
          // User cancelled - this is normal, just reset loading state
          setLoading(false);
          return;
        }
      } else {
        await connectDemoWallet();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
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
