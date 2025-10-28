"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  PlusIcon, 
  VoteIcon, 
  BarChart3Icon, 
  FileTextIcon, 
  BrainCircuitIcon, 
  WalletIcon,
  TrendingUpIcon,
  Users2Icon,
  CoinsIcon,
  CheckCircleIcon,
  ClockIcon,
  MenuIcon,
  XIcon,
  SparklesIcon,
  SettingsIcon,
  LeafIcon
} from "lucide-react"
import Link from "next/link"
import { useWalletContext } from "@/hooks/use-wallet"
import { useClimateDAO } from "@/hooks/use-climate-dao"
import { StatsSkeleton, CardSkeleton } from "@/components/ui/skeleton"
import { WalletInfo } from "@/components/wallet-guard"
import { TransactionNotification } from "@/components/transaction-notification"
import { ProposalFilters } from "@/components/proposal-filters"
import { filterProposalsByCategories, getCategoryById } from "@/lib/proposal-categories"
import dynamic from "next/dynamic"

// Lazy load heavy components to improve initial page load
const VotingHistory = dynamic(() => import("@/components/voting-history").then(mod => ({ default: mod.VotingHistory })), {
  loading: () => <CardSkeleton />
})
const UserProposalsTracker = dynamic(() => import("@/components/user-proposals-tracker").then(mod => ({ default: mod.UserProposalsTracker })), {
  loading: () => <CardSkeleton />
})
const TransactionHistory = dynamic(() => import("@/components/transaction-history").then(mod => ({ default: mod.TransactionHistory })), {
  loading: () => <CardSkeleton />
})
const NotificationsPanel = dynamic(() => import("@/components/notifications-panel").then(mod => ({ default: mod.NotificationsPanel })), {
  loading: () => <CardSkeleton />
})

export function DashboardPage() {
  const { isConnected, address, balance, disconnect } = useWalletContext()
  const { getProposals, getTotalProposals, getBlockchainStats, voteOnProposal, cleanupExpiredProposals, enforceStorageLimits } = useClimateDAO()
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [votingProposalId, setVotingProposalId] = useState<string | null>(null)
  const [proposals, setProposals] = useState<any[]>([])
  const [activeProposals, setActiveProposals] = useState<any[]>([])
  const [userProposals, setUserProposals] = useState<any[]>([])
  const [showMyProposals, setShowMyProposals] = useState(false)
  const [totalProposalsCount, setTotalProposalsCount] = useState(0)
  const [lastCleanup, setLastCleanup] = useState<{ removedCount: number; timestamp: number } | null>(null)
  const [storageUsage, setStorageUsage] = useState<{size: number, limit: number} | null>(null)
  
  // NEW: Filtering state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'passed' | 'rejected' | 'expired'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Transaction notification state
  const [transactionNotification, setTransactionNotification] = useState<{
    isOpen: boolean;
    txId: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({
    isOpen: false,
    txId: '',
    message: '',
    type: 'success'
  })
  const [blockchainStats, setBlockchainStats] = useState({
    totalProposals: 0,
    totalMembers: 0,
    activeProposals: 0,
    userProposalCount: 0,
    userVoteCount: 0
  })

  // NEW: Filtered proposals using useMemo for performance
  const filteredProposals = useMemo(() => {
    let filtered = [...proposals];
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filterProposalsByCategories(filtered, selectedCategories);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(proposal => proposal.status === statusFilter);
    }
    
    return filtered;
  }, [proposals, selectedCategories, statusFilter]);

  const filteredActiveProposals = useMemo(() => {
    let filtered = [...activeProposals];
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filterProposalsByCategories(filtered, selectedCategories);
    }
    
    return filtered;
  }, [activeProposals, selectedCategories]);

  // Validate wallet connection and address format for Algorand
  useEffect(() => {
    if (isConnected && address) {
      // Validate Algorand address format (should be 58 characters)
      if (address.length !== 58) {
        console.warn('Invalid Algorand address format detected')
        disconnect() // Force disconnect if not a valid Algorand address
      }
    }
  }, [isConnected, address, disconnect])

  // Remove artificial loading delay for better performance
  useEffect(() => {
    setIsLoading(false)
  }, [])

  // Fetch proposals data - optimized with aggressive storage management
  useEffect(() => {
    const fetchProposalData = async () => {
      try {
        setIsLoading(true)

        // 1. FIRST: Enforce aggressive storage limits (200KB constraint)
        const storageResult = await enforceStorageLimits()
        if (storageResult.cleaned) {
          console.log(`🗑️ Storage cleanup: ${storageResult.oldSize}KB → ${storageResult.newSize}KB`)
          setLastCleanup({ 
            removedCount: storageResult.proposalsRemoved || 0, 
            timestamp: Date.now() 
          })
        }

        // Update storage usage display
        setStorageUsage({
          size: storageResult.currentSize || storageResult.newSize || 0,
          limit: 200
        })

        // 2. THEN: Clean up expired proposals (reduced retention to 3 days)
        const cleanupResult = await cleanupExpiredProposals(3) // Reduced from 7 to 3 days
        if (cleanupResult.removedCount > 0) {
          console.log(`🕒 Expired cleanup: Removed ${cleanupResult.removedCount} old proposals`)
        }

        // 3. Get all proposals in one call and process locally
        const allProposals = await getProposals()
        setProposals(allProposals)
        
        // Filter active proposals locally instead of making another API call
        const activeProposals = allProposals.filter(p => p.status === 'active')
        setActiveProposals(activeProposals)
        
        // Filter user proposals locally if connected
        if (address) {
          const userProposals = allProposals.filter(p => p.creator === address)
          setUserProposals(userProposals)
        }
        
        // Use local data for counts
        setTotalProposalsCount(allProposals.length)
        
        // Only get blockchain stats if needed for display
        const stats = await getBlockchainStats()
        setBlockchainStats(stats)
      } catch (error) {
        console.error('Failed to fetch proposal data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isConnected) {
      fetchProposalData()
      
      // Set up aggressive periodic cleanup for 200KB storage limit
      const cleanupInterval = setInterval(async () => {
        try {
          // First check storage limits
          const storageResult = await enforceStorageLimits()
          if (storageResult.cleaned) {
            console.log('📱 Periodic storage cleanup completed')
            setStorageUsage({
              size: storageResult.newSize || 0,
              limit: 200
            })
          }
          
          // Then clean expired proposals (more frequent, shorter retention)
          const expiredResult = await cleanupExpiredProposals(2) // Keep expired for only 2 days
          if (expiredResult.removedCount > 0) {
            console.log(`🧹 Periodic cleanup: Removed ${expiredResult.removedCount} expired proposals`)
            // Refresh proposal data after cleanup
            fetchProposalData()
          }
        } catch (error) {
          console.error('Periodic cleanup failed:', error)
        }
      }, 30 * 60 * 1000) // Run every 30 minutes instead of 1 hour

      return () => clearInterval(cleanupInterval)
    }
  }, [isConnected, address])

  // Set initial time on client side only - no constant updates for performance
  useEffect(() => {
    setCurrentTime(new Date())
  }, [])

  // Monitor storage usage
  useEffect(() => {
    const checkStorageUsage = () => {
      try {
        const proposals = JSON.parse(localStorage.getItem('climate_dao_proposals') || '[]')
        const votes = JSON.parse(localStorage.getItem('climate_dao_votes') || '[]')
        const userHistory = JSON.parse(localStorage.getItem('climate_dao_user_history') || '[]')
        const totalSize = JSON.stringify({proposals, votes, userHistory}).length
        setStorageUsage({
          size: Math.round(totalSize / 1024),
          limit: 200
        })
      } catch (error) {
        console.error('Failed to check storage usage:', error)
      }
    }

    checkStorageUsage()
    const interval = setInterval(checkStorageUsage, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  // Handle voting on proposals - Enhanced with notification system
  const handleVote = async (proposalId: number, voteType: 'for' | 'against') => {
    if (!isConnected) {
      setTransactionNotification({
        isOpen: true,
        txId: '',
        message: 'Please connect your wallet to vote',
        type: 'error'
      })
      return
    }

    try {
      setVotingProposalId(proposalId.toString())
      console.log('🗳️ Starting vote process:', { proposalId, voteType, address })
      
      const result = await voteOnProposal(proposalId, voteType)
      console.log('🎉 Vote result:', result)
      
      // If the result explicitly indicates a non-success (e.g. duplicate vote), show a friendly notification
      if ((result as any).success === false && (result as any).message) {
        setTransactionNotification({
          isOpen: true,
          txId: '',
          message: (result as any).message,
          type: 'warning'
        })
        return
      }

      // If we get a result with txId, the vote was successful
      if (result.txId) {
        // Refresh proposals data after successful vote
        const allProposals = await getProposals()
        setProposals(allProposals)
        const activeProposals = allProposals.filter(p => p.status === 'active')
        setActiveProposals(activeProposals)
        
        // Show success notification with copyable transaction ID
        setTransactionNotification({
          isOpen: true,
          txId: result.txId,
          message: `Your "${voteType}" vote has been successfully recorded on the Algorand blockchain!`,
          type: 'success'
        })
      } else {
        throw new Error('No transaction ID returned - vote may have failed')
      }
    } catch (error) {
      console.error(' Voting error details:', error)
      
      let errorMessage = 'Unknown error occurred'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      // Show error notification
      setTransactionNotification({
        isOpen: true,
        txId: '',
        message: `Vote failed: ${errorMessage}`,
        type: 'error'
      })
    } finally {
      setVotingProposalId(null)
    }
  }

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
    { 
      label: "Active Proposals", 
      value: filteredActiveProposals.length.toString(), 
      change: filteredActiveProposals.length > 0 ? "+12%" : "0%", 
      icon: FileTextIcon, 
      color: "blue" 
    },
    { 
      label: "Total Proposals", 
      value: filteredProposals.length.toString(), 
      change: filteredProposals.length > 0 ? "+8%" : "0%", 
      icon: VoteIcon, 
      color: "green" 
    },
    { 
      label: "Climate Credits", 
      value: "2,456", // This will be from blockchain when credits are implemented
      change: "+15%", 
      icon: CoinsIcon, 
      color: "yellow" 
    },
    { 
      label: "Community Members", 
      value: blockchainStats.totalMembers.toString(), 
      change: blockchainStats.totalMembers > 0 ? "+5%" : "0%", 
      icon: Users2Icon, 
      color: "purple" 
    }
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
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25">
                <LeafIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">TerraLinke</h1>
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
              <WalletInfo />
              {/* Storage Usage Indicator */}
              {storageUsage && (
                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-xl border border-white/20">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-xs text-white/80">
                    {storageUsage.size}KB/{storageUsage.limit}KB
                  </span>
                </div>
              )}
              <NotificationsPanel />
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

          {/* Proposal Filters */}
          <ProposalFilters
            proposals={proposals}
            activeProposals={activeProposals}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Dashboard Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* My Proposals Card - Enhanced with Real Data */}
            <UserProposalsTracker />

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
                    {filteredActiveProposals.length} Pending
                  </Badge>
                </div>
                <CardDescription className="text-white/60 text-base">
                  Proposals awaiting your vote
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Active Proposals */}
                {filteredActiveProposals.length > 0 ? (
                  filteredActiveProposals.slice(0, 3).map((proposal) => {
                    const timeLeft = Math.ceil((proposal.endTime - Date.now()) / (24 * 60 * 60 * 1000));
                    const timeText = timeLeft > 0 ? `${timeLeft}d left` : 'Expired';
                    const totalVotes = proposal.voteYes + proposal.voteNo;
                    const yesPercentage = totalVotes > 0 ? Math.round((proposal.voteYes / totalVotes) * 100) : 0;
                    
                    return (
                      <div key={proposal.id} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <h4 className="text-white font-medium text-lg">{proposal.title}</h4>
                            {(() => {
                              const category = getCategoryById(proposal.category);
                              return category ? (
                                <Badge className={`bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs px-2 py-1`}>
                                  {category.icon} {category.name}
                                </Badge>
                              ) : null;
                            })()}
                          </div>
                          <Badge className={`${timeLeft > 0 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'} rounded-full`}>
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {timeText}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-white/60">
                            AI Impact Score: {proposal.aiScore ? `${proposal.aiScore}/10` : 'N/A'}
                          </span>
                          <div className="flex items-center gap-1 text-green-400">
                            <TrendingUpIcon className="w-4 h-4" />
                            {proposal.aiScore && proposal.aiScore >= 8 ? 'High Impact' : 
                             proposal.aiScore && proposal.aiScore >= 6 ? 'Medium Impact' : 'Low Impact'}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-white/60">
                            Funding: ${proposal.fundingAmount.toLocaleString()}
                          </span>
                          <span className="text-white/60">
                            Votes: {yesPercentage}% yes ({totalVotes} total)
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            size="sm" 
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-xl"
                            onClick={() => handleVote(proposal.id, 'for')}
                            disabled={votingProposalId === proposal.id}
                          >
                            {votingProposalId === proposal.id ? 'Voting...' : 'Vote Yes (0.001 ALGO)'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl"
                            onClick={() => handleVote(proposal.id, 'against')}
                            disabled={votingProposalId === proposal.id}
                          >
                            {votingProposalId === proposal.id ? 'Voting...' : 'Vote No (0.001 ALGO)'}
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <VoteIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60 mb-2">No active proposals to vote on</p>
                    <p className="text-white/40 text-sm">New proposals will appear here when submitted</p>
                  </div>
                )}
                
                {filteredActiveProposals.length > 3 && (
                  <div className="text-center pt-4">
                    <Link href="/vote">
                      <Button variant="outline" size="sm" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                        View All {filteredActiveProposals.length} Active Proposals
                      </Button>
                    </Link>
                  </div>
                )}

                {/* View All Votes */}
                <Link href="/vote">
                  <Button variant="outline" className="w-full border-white/20 text-black hover:bg-white/10 rounded-2xl py-3">
                    View All Active Votes
                  </Button>
                </Link>
              </CardContent>
            </Card>

          </div>

          {/* Voting History - Full Width */}
          <VotingHistory />

          {/* Transaction History - Full Width */}
          <TransactionHistory />

          {/* My Proposals */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-xl flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                    <FileTextIcon className="w-6 h-6 text-white" />
                  </div>
                  My Proposals
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30 rounded-full">
                    {userProposals.length} Total
                  </Badge>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMyProposals(!showMyProposals)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {showMyProposals ? 'Show All' : 'Show Mine'}
                </Button>
              </div>
              <CardDescription className="text-white/60 text-base">
                Proposals you have submitted to the DAO
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* My Proposals Items */}
              {userProposals.length > 0 ? (
                userProposals.slice(0, 3).map((proposal) => {
                  const hasVotes = proposal.voteYes + proposal.voteNo > 0;
                  
                  return (
                    <div key={proposal.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className={`w-12 h-12 bg-${proposal.status === 'active' ? 'green' : proposal.status === 'passed' ? 'blue' : 'gray'}-500/20 rounded-2xl flex items-center justify-center`}>
                        <FileTextIcon className={`w-6 h-6 text-${proposal.status === 'active' ? 'green' : proposal.status === 'passed' ? 'blue' : 'gray'}-400`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-base">{proposal.title}</p>
                        <p className="text-white/60 text-sm">Status: {proposal.status}</p>
                        <p className="text-white/40 text-sm">
                          Funding: ${proposal.fundingAmount.toLocaleString()} | 
                          Votes: {proposal.voteYes + proposal.voteNo} total
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="text-white/40 text-sm">
                            {proposal.status === 'active' ? 'Active' : 'Completed'}
                          </span>
                          {proposal.aiScore && (
                            <p className="text-white/60 text-xs">AI Score: {proposal.aiScore}/10</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <FileTextIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 mb-2">No proposals submitted yet</p>
                  <p className="text-white/40 text-sm">Submit your first climate proposal to get started</p>
                  <Link href="/submit-proposal">
                    <Button className="mt-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                      Submit Proposal
                    </Button>
                  </Link>
                </div>
              )}
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
              Powered by Algorand & AI • &copy; {new Date().getFullYear()} TerraLinke
            </p>
          </div>
        </div>
      </footer>

      {/* Transaction Notification */}
      <TransactionNotification
        isOpen={transactionNotification.isOpen}
        onClose={() => setTransactionNotification(prev => ({ ...prev, isOpen: false }))}
        txId={transactionNotification.txId}
        message={transactionNotification.message}
        type={transactionNotification.type}
      />
    </div>
  )
}
