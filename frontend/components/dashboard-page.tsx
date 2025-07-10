"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, VoteIcon, CoinsIcon, BarChart3Icon, FileTextIcon, SettingsIcon } from "lucide-react"
import Link from "next/link"

export function DashboardPage() {
  return (
    <div className="relative flex flex-col min-h-[100dvh] text-black overflow-hidden">
      {/* Yellow/Black Gradient Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 border-b border-black/20">
        <div className="text-black font-bold text-xl">Climate DAO Dashboard</div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-800">Welcome back!</span>
          <Button variant="outline" size="sm" className="border-black/30 text-black hover:bg-black/10 bg-transparent">
            <SettingsIcon className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-black/80 border-yellow-500/50 backdrop-blur-sm hover:bg-black/90 transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Link href="/submit-proposal" className="block">
                  <PlusIcon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-yellow-400 font-semibold text-lg mb-2">Submit Proposal</h3>
                  <p className="text-gray-300 text-sm">Share your climate project idea</p>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-black/80 border-yellow-500/50 backdrop-blur-sm hover:bg-black/90 transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <VoteIcon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-yellow-400 font-semibold text-lg mb-2">Vote on Proposals</h3>
                <p className="text-gray-300 text-sm">Participate in DAO governance</p>
              </CardContent>
            </Card>

            <Card className="bg-black/80 border-yellow-500/50 backdrop-blur-sm hover:bg-black/90 transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <CoinsIcon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-yellow-400 font-semibold text-lg mb-2">My Tokens</h3>
                <p className="text-gray-300 text-sm">View your DAO token balance</p>
              </CardContent>
            </Card>

            <Card className="bg-black/80 border-yellow-500/50 backdrop-blur-sm hover:bg-black/90 transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <BarChart3Icon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-yellow-400 font-semibold text-lg mb-2">Impact Analytics</h3>
                <p className="text-gray-300 text-sm">Track environmental impact</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-black/80 border-yellow-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <FileTextIcon className="w-5 h-5" />
                  My Proposals
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Track the status of your submitted proposals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <p className="text-gray-400">No proposals submitted yet</p>
                  <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black">
                    <Link href="/submit-proposal">Submit Your First Proposal</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/80 border-yellow-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <VoteIcon className="w-5 h-5" />
                  Active Votes
                </CardTitle>
                <CardDescription className="text-gray-300">Proposals awaiting your vote</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Solar Farm Initiative - Kenya</h4>
                    <p className="text-gray-300 text-sm mb-3">AI Impact Score: 8.7/10</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        Vote Yes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                      >
                        Vote No
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-gray-800 text-sm border-t border-black/20">
        <p>&copy; {new Date().getFullYear()} Climate DAO. Building a sustainable future together.</p>
      </footer>
    </div>
  )
}
