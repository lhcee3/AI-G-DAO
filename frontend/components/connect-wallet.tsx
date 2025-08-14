"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletIcon, ArrowLeftIcon, CheckCircleIcon } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/hooks/use-wallet"
import { useRouter } from "next/navigation"

export function WalletConnectPage() {
  const { isConnected, address, balance, connect, disconnect, loading, error, walletType, clearError } = useWallet()
  const router = useRouter()

  const handleConnectWallet = async (type: 'pera' | 'demo' = 'pera') => {
    try {
      clearError() // Clear any previous errors
      await connect(type)
    } catch (err) {
      console.error('Failed to connect wallet:', err)
    }
  }

  const handleDisconnect = () => {
    disconnect()
  }

  const handleEnterDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <div className="relative flex flex-col min-h-[100dvh] text-white overflow-hidden">
      {/* Black/Blue Moving Gradient Background - Same as landing page */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 animate-moving-gradient"></div>
      </div>

      {/* Header with Back Button */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <Link href="/" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="text-blue-400 font-bold text-lg">Climate DAO</div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-white">Connect Your Wallet</h1>
            <p className="text-gray-300 text-lg">
              Connect your Algorand wallet to access the DAO dashboard and start participating in climate governance.
            </p>
          </div>

          <Card className="bg-black/60 border-blue-500/30 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                <WalletIcon className="w-8 h-8 text-blue-400" />
              </div>
              <CardTitle className="text-2xl text-white">Algorand Wallet</CardTitle>
              <CardDescription className="text-gray-300">
                Securely connect your wallet to participate in DAO governance
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-3">
                  <p className="text-red-400 text-sm">{error}</p>
                  {error.includes('install Pera Wallet') && (
                    <div className="text-xs text-gray-400 space-y-1">
                      <p>To install Pera Wallet:</p>
                      <ul className="list-disc list-inside ml-2 space-y-1">
                        <li>Visit <a href="https://perawallet.app" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">perawallet.app</a></li>
                        <li>Download the browser extension or mobile app</li>
                        <li>Create or import your wallet</li>
                        <li>Refresh this page and try again</li>
                      </ul>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearError}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    Dismiss
                  </Button>
                </div>
              )}

              {isConnected && address ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-green-400">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span className="font-semibold">
                      {walletType === 'pera' ? 'Pera Wallet Connected!' : 'Demo Mode Active'}
                    </span>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">
                      {walletType === 'pera' ? 'Connected Address:' : 'Demo Address:'}
                    </p>
                    <p className="text-sm text-blue-400 font-mono break-all">{address}</p>
                    <p className="text-xs text-gray-400 mt-2">Balance: {balance.toFixed(2)} ALGO</p>
                    {walletType === 'demo' && (
                      <p className="text-xs text-yellow-400 mt-1">
                        ⚠️ Demo mode - cannot submit real transactions
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                      onClick={handleEnterDashboard}
                    >
                      Enter DAO Dashboard
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10 py-3 rounded-lg transition-all duration-300 bg-transparent"
                      onClick={handleDisconnect}
                    >
                      Disconnect Wallet
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleConnectWallet('pera')}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      "Connect Pera Wallet"
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-semibold py-4 rounded-lg transition-all duration-300"
                    onClick={() => handleConnectWallet('demo')}
                    disabled={loading}
                  >
                    Demo Mode (View Only)
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
              className="text-blue-400 hover:text-blue-300 text-sm font-medium underline underline-offset-2"
            >
              Download Pera Wallet
            </a>
          </div>
        </div>
      </main>

<footer className="relative z-10 text-center py-6 text-gray-400 text-sm">
  <p>
    &copy; {new Date().getFullYear()} Climate DAO. Powered by Algorand and built by{" "}
    <a
      href="https://github.com/lhcee3"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-white underline"
    >
      Aneesh
    </a>.
  </p>
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
