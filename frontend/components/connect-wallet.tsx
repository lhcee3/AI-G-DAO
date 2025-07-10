"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletIcon, ArrowLeftIcon, CheckCircleIcon } from "lucide-react"
import Link from "next/link"

export function WalletConnectPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Dummy wallet address for demonstration
    const dummyAddress = "ALGO_XYZ_123_ABC_456_DEF_789_GHI_012_JKL_345_MNO_678_PQR_901"
    setWalletAddress(dummyAddress)
    setIsConnecting(false)
  }

  const handleDisconnect = () => {
    setWalletAddress(null)
  }

  return (
    <div className="relative flex flex-col min-h-[100dvh] text-white overflow-hidden">
      {/* Black/Blue Moving Gradient Background - Same as landing page */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 animate-moving-gradient"></div>
      </div>

      {/* Header with Back Button */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <Link href="/" className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Landing</span>
        </Link>
        <div className="text-teal-400 font-bold text-lg">Climate DAO</div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-white">Connect Your Wallet</h1>
            <p className="text-gray-300 text-lg">
              Connect your Algorand wallet to access the DAO dashboard and start participating in climate governance.
            </p>
          </div>

          <Card className="bg-black/60 border-teal-500/30 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center">
                <WalletIcon className="w-8 h-8 text-teal-400" />
              </div>
              <CardTitle className="text-2xl text-white">Algorand Wallet</CardTitle>
              <CardDescription className="text-gray-300">
                Securely connect your wallet to participate in DAO governance
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {walletAddress ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-green-400">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span className="font-semibold">Wallet Connected!</span>
                  </div>

                  <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">Connected Address:</p>
                    <p className="text-sm text-teal-400 font-mono break-all">{walletAddress}</p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                      onClick={() => {
                        // Navigate to dashboard - we'll implement this later
                        console.log("Navigate to dashboard")
                      }}
                    >
                      Enter DAO Dashboard
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-teal-500/50 text-teal-400 hover:bg-teal-500/10 py-3 rounded-lg transition-all duration-300 bg-transparent"
                      onClick={handleDisconnect}
                    >
                      Disconnect Wallet
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleConnectWallet}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      "Connect Algorand Wallet"
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-xs text-gray-400">
                      By connecting, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">Don't have an Algorand wallet?</p>
            <a
              href="https://perawallet.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 text-sm font-medium underline underline-offset-2"
            >
              Download Pera Wallet
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Climate DAO. Powered by Algorand.</p>
      </footer>

      {/* CSS for black/blue moving gradient - same as landing page */}
      <style jsx>{`
        @keyframes moving-gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-moving-gradient {
          background: linear-gradient(270deg, #000000, #000080, #000000); /* Black to Navy Blue */
          background-size: 400% 400%;
          animation: moving-gradient 15s ease infinite;
        }
      `}</style>
    </div>
  )
}
