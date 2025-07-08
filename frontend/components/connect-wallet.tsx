"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletIcon } from "lucide-react"

export function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    // Simulate wallet connection
    // In a real application, you would use an Algorand wallet SDK here, e.g.:
    // import { PeraWalletConnect } from '@perawallet/connect';
    // const peraWallet = new PeraWalletConnect();
    // const accounts = await peraWallet.connect();
    // setWalletAddress(accounts[0]);

    await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call delay

    // Dummy wallet address for demonstration
    const dummyAddress = "ALG_XYZ_123_ABC_456_DEF_789_GHI_012_JKL_345_MNO_678_PQR_901"
    setWalletAddress(dummyAddress)
    setIsConnecting(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto p-6 shadow-lg bg-black/50 border border-gray-800 text-white">
      <CardHeader className="flex flex-col items-center text-center">
        <WalletIcon className="w-12 h-12 text-teal-500 mb-4" />
        <CardTitle className="text-2xl font-bold">Connect Your Wallet</CardTitle>
        <CardDescription className="text-gray-300">
          Connect your Algorand wallet to participate in DAO governance and fund climate projects.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {walletAddress ? (
          <div className="text-center">
            <p className="text-lg font-semibold text-teal-400">Wallet Connected!</p>
            <p className="text-sm text-gray-400 break-all">{walletAddress}</p>
            <Button
              onClick={() => setWalletAddress(null)}
              variant="outline"
              className="mt-4 px-6 py-2 bg-transparent border-white text-white hover:bg-gray-800 rounded-full transition-transform transform hover:scale-105"
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="px-8 py-3 text-lg bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
