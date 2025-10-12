"use client"

import { ReactNode } from 'react'
import { WalletProvider } from '@/hooks/use-wallet'

export function WalletLayout({ children }: { children: ReactNode }) {
  return (
    <WalletProvider>
      {children}
    </WalletProvider>
  )
}