"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  PlusIcon, 
  VoteIcon, 
  BarChart3Icon, 
  FileTextIcon, 
  SettingsIcon, 
  BrainCircuitIcon, 
  WalletIcon,
  BellIcon,
  SearchIcon,
  TrendingUpIcon,
  Users2Icon,
  CoinsIcon,
  CheckCircleIcon,
  ClockIcon,
  MenuIcon,
  XIcon,
  SparklesIcon
} from "lucide-react"
import Link from "next/link"
import { useWalletContext } from "@/hooks/use-wallet"
import { StatsSkeleton, CardSkeleton } from "@/components/ui/skeleton"

export function DashboardPage() {
  const { isConnected, address, balance } = useWalletContext()
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading time for dashboard content
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Update time every minute, only on client side
  useEffect(() => {
    // Set initial time on client side
    setCurrentTime(new Date())
    
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const quickActions = [
    {
      title: "Submit Proposal",
      description: "Share your climate project idea",
      icon: PlusIcon,
      href: "/submit-proposal",
      gradient: "from-blue-500 to-cyan-500",
      shadow: "shadow-blue-500/25"
    },
    {
      title: "AI Review",
      description: "Get AI analysis for proposals", 
      icon: BrainCircuitIcon,
      href: "/proposal-review",
      gradient: "from-purple-500 to-pink-500",
      shadow: "shadow-purple-500/25"
    },
    {
      title: "Vote on Proposals",
      description: "Participate in DAO governance",
      icon: VoteIcon,
      href: "/vote",
      gradient: "from-green-500 to-emerald-500", 
      shadow: "shadow-green-500/25"
    },
    {
      title: "Impact Analytics",
      description: "Track environmental impact",
      icon: BarChart3Icon,
      href: "/impact-analytics",
      gradient: "from-orange-500 to-red-500",
      shadow: "shadow-orange-500/25"
    }
  ]

  const stats = [
    { label: "Active Proposals", value: "24", change: "+12%", icon: FileTextIcon, color: "blue" },
    { label: "Total Votes Cast", value: "1,847", change: "+8%", icon: VoteIcon, color: "green" },
    { label: "Climate Credits", value: "2,456", change: "+15%", icon: CoinsIcon, color: "yellow" },
    { label: "Community Members", value: "892", change: "+5%", icon: Users2Icon, color: "purple" }
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-pink-500/5 rounded-full blur-2xl animate-bounce"></div>
      </div>

      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-6 py-4 shadow-2xl hover:bg-white/15 transition-all duration-300">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">Climate DAO</h1>
                <p className="text-white/60 text-xs">
                  {currentTime ? (
                    <>
                      {currentTime.toLocaleDateString('en-US', { 
                        month: 'numeric', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })} • {currentTime.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: false 
                      })}
                    </>
                  ) : (
                    'Loading...'
                  )}
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
            </div>

            {/* Wallet Status */}
            <div className="hidden md:flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-3 bg-white/5 rounded-2xl px-4 py-2 border border-white/10">
                  <div className="text-right">
                    <p className="text-white/90 font-medium text-sm">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                    <p className="text-white/60 text-xs">{balance.toFixed(2)} ALGO</p>
                  </div>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 rounded-full">
                    Pera
                  </Badge>
                </div>
              ) : (
                <Link href="/connect-wallet">
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300">
                    <WalletIcon className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl">
                <SettingsIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden text-white hover:bg-white/10 rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-6 pt-6 border-t border-white/20 space-y-4">
              {isConnected ? (
                <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                  <div>
                    <p className="text-white font-medium">{address?.slice(0, 10)}...</p>
                    <p className="text-white/60 text-sm">{balance.toFixed(2)} ALGO</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 rounded-full">
                    Pera
                  </Badge>
                </div>
              ) : (
                <Link href="/connect-wallet">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl">
                    Connect Wallet
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Simple Welcome */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-sm text-white/80 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
             Take One step Towards a Greener Future
            </div>
          </div>

          {/* Stats Grid */}
          {isLoading ? (
            <StatsSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-${stat.color}-500/20 rounded-2xl flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                      </div>
                      <span className="text-green-400 text-sm font-medium bg-green-500/10 px-2 py-1 rounded-full">
                        {stat.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                      <p className="text-white/60 text-sm">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Quick Actions Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} showHeader={false} lines={2} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href} className="group">
                  <Card className={`bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-500 group-hover:scale-105 ${action.shadow} hover:shadow-2xl`}>
                    <CardContent className="p-8 text-center space-y-6">
                      <div className={`w-20 h-20 bg-gradient-to-br ${action.gradient} rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <action.icon className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-2">{action.title}</h3>
                        <p className="text-white/60 text-sm leading-relaxed">{action.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Dashboard Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* My Proposals Card */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-xl flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <FileTextIcon className="w-6 h-6 text-white" />
                    </div>
                    My Proposals
                  </CardTitle>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 rounded-full">
                    Active
                  </Badge>
                </div>
                <CardDescription className="text-white/60 text-base">
                  Track the status of your submitted proposals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <PlusIcon className="w-12 h-12 text-white/40" />
                  </div>
                  <p className="text-white/60 mb-6 text-lg">No proposals submitted yet</p>
                  <Link href="/submit-proposal">
                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 rounded-2xl px-8 py-3 text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300">
                      Submit Your First Proposal
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Active Votes Card */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-xl flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                      <VoteIcon className="w-6 h-6 text-white" />
                    </div>
                    Active Votes
                  </CardTitle>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 rounded-full">
                    3 Pending
                  </Badge>
                </div>
                <CardDescription className="text-white/60 text-base">
                  Proposals awaiting your vote
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Sample Proposal */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium text-lg">Solar Farm Initiative - Kenya</h4>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 rounded-full">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      2d left
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/60">AI Impact Score: 8.7/10</span>
                    <div className="flex items-center gap-1 text-green-400">
                      <TrendingUpIcon className="w-4 h-4" />
                      High Impact
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button size="sm" className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-xl">
                      Vote Yes
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl">
                      Vote No
                    </Button>
                  </div>
                </div>

                {/* View All Votes */}
                <Link href="/vote">
                  <Button variant="outline" className="w-full border-white/20 text-black hover:bg-white/10 rounded-2xl py-3">
                    View All Active Votes
                  </Button>
                </Link>
              </CardContent>
            </Card>

          </div>

          {/* Recent Activity */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="text-white text-xl flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <BarChart3Icon className="w-6 h-6 text-white" />
                </div>
                Recent Activity
              </CardTitle>
              <CardDescription className="text-white/60 text-base">
                Latest updates from the Climate DAO community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Activity Items */}
              {[
                { action: "New proposal submitted", item: "Wind Energy Project - Brazil", time: "2 hours ago", icon: PlusIcon, color: "blue" },
                { action: "Voting completed", item: "Reforestation Initiative - Indonesia", time: "5 hours ago", icon: CheckCircleIcon, color: "green" },
                { action: "AI analysis completed", item: "Carbon Capture Technology", time: "1 day ago", icon: BrainCircuitIcon, color: "purple" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className={`w-12 h-12 bg-${activity.color}-500/20 rounded-2xl flex items-center justify-center`}>
                    <activity.icon className={`w-6 h-6 text-${activity.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-base">{activity.action}</p>
                    <p className="text-white/60">{activity.item}</p>
                  </div>
                  <span className="text-white/40">{activity.time}</span>
                </div>
              ))}

            </CardContent>
          </Card>

        </div>
      </main>

      {/* Normal Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-md mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-white/80 text-sm mb-2">
              Built with 💚 by{" "}
              <a
              href="https://github.com/lhcee3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium underline hover:text-cyan-400 transition"
              >
              Aneesh
              </a>
            </p>
            <p className="text-white/40 text-xs">
              Powered by Algorand & AI • &copy; {new Date().getFullYear()} Climate DAO
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
