import type { Metadata } from 'next'
import './globals.css'
import { WalletProvider } from '@/hooks/use-wallet'

export const metadata: Metadata = {
  title: 'Climate DAO ',
  description: 'Create a Climate DAO to fund climate projects',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}
