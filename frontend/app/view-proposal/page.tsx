"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftIcon, VoteIcon, BarChart3Icon, CalendarIcon, MapPinIcon, DollarSignIcon, UserIcon, ClockIcon } from "lucide-react"
import Link from "next/link"
import { useWalletContext } from "@/hooks/use-wallet"
import { useClimateDAO } from "@/hooks/use-climate-dao"
import { climateDAOQuery } from "@/lib/blockchain-queries"

export default function ViewProposalPage() {
  const searchParams = useSearchParams()
  const proposalId = searchParams.get('id') ? parseInt(searchParams.get('id')!) : null
  
  const { isConnected, address } = useWalletContext()
  const { getProposal, voteOnProposal, getProposalVotes } = useClimateDAO()
  
  const [proposal, setProposal] = useState<any>(null)
  const [votes, setVotes] = useState<any>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Load proposal data
  useEffect(() => {
    const loadProposal = async () => {
      if (!proposalId) return
      
      try {
        setIsLoading(true)
        setError("")
        
        const proposalData = await climateDAOQuery.getProposal(proposalId)
        
        if (!proposalData) {
          setError("Proposal not found")
          return
        }
        
        setProposal(proposalData)
        
        // Load vote data
        const voteData = await climateDAOQuery.getProposalVotes(proposalId)
        setVotes(voteData)
        
      } catch (err) {
        console.error('Failed to load proposal:', err)
        setError('Failed to load proposal')
      } finally {
        setIsLoading(false)
      }
    }

    loadProposal()
  }, [proposalId])

  // Handle voting
  const handleVote = async (vote: 'for' | 'against') => {
    if (!proposalId || !isConnected) return

    setIsVoting(true)
    try {
      await voteOnProposal(proposalId, vote)
      
      // Refresh vote data
      const voteData = await climateDAOQuery.getProposalVotes(proposalId)
      setVotes(voteData)
      
      alert(`Vote "${vote}" submitted successfully!`)
    } catch (error) {
      console.error('Voting failed:', error)
      alert(error instanceof Error ? error.message : 'Voting failed')
    } finally {
      setIsVoting(false)
    }
  }

  if (!proposalId) {
    return (
      <div className="relative flex flex-col min-h-[100dvh] text-black overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-black"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between p-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          <div className="text-white font-bold text-lg">View Proposal</div>
        </header>

        <main className="relative z-10 flex-1 px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-8 text-center">
                <VoteIcon className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">No Proposal Selected</h2>
                <p className="text-white/60 mb-4">Please select a proposal to view from the dashboard.</p>
                <Link href="/dashboard">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Go to Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="relative flex flex-col min-h-[100dvh] text-black overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-black"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <main className="relative z-10 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading proposal...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative flex flex-col min-h-[100dvh] text-black overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-black"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <main className="relative z-10 flex-1 flex items-center justify-center">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-md">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-bold mb-2 text-red-400">Error</h2>
              <p className="text-white/60 mb-4">{error}</p>
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Back to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col min-h-[100dvh] text-black overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-black"></div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </Link>
        <div className="text-white font-bold text-lg">View Proposal</div>
      </header>

      <main className="relative z-10 flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {proposal && (
            <>
              {/* Proposal Header */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold mb-2">{proposal.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className={`${
                          proposal.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          proposal.status === 'passed' ? 'bg-blue-500/20 text-blue-400' :
                          proposal.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        } border-0`}>
                          {proposal.status?.charAt(0).toUpperCase() + proposal.status?.slice(1)}
                        </Badge>
                        {proposal.category && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-0">
                            {proposal.category}
                          </Badge>
                        )}
                        {proposal.aiScore && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-0">
                            AI Score: {proposal.aiScore}/10
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Proposal Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                      <DollarSignIcon className="w-6 h-6 text-green-400" />
                      <div>
                        <p className="text-white/60 text-sm">Funding Goal</p>
                        <p className="text-white font-bold">${proposal.fundingAmount?.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                      <UserIcon className="w-6 h-6 text-blue-400" />
                      <div>
                        <p className="text-white/60 text-sm">Submitted by</p>
                        <p className="text-white font-mono text-sm">{proposal.creator?.slice(0, 8)}...{proposal.creator?.slice(-6)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                      <ClockIcon className="w-6 h-6 text-purple-400" />
                      <div>
                        <p className="text-white/60 text-sm">Status</p>
                        <p className="text-white font-bold">{proposal.status}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-bold mb-3">Description</h3>
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                        {proposal.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Voting Section */}
              {proposal.status === 'active' && votes && (
                <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <VoteIcon className="w-6 h-6" />
                      Vote on this Proposal
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Cast your vote to support or oppose this climate initiative
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Current Vote Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                        <p className="text-2xl font-bold text-green-400">{votes.yesVotes}</p>
                        <p className="text-white/60">Yes Votes</p>
                        <p className="text-green-400 text-sm">{votes.yesPercentage}%</p>
                      </div>
                      <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                        <p className="text-2xl font-bold text-red-400">{votes.noVotes}</p>
                        <p className="text-white/60">No Votes</p>
                        <p className="text-red-400 text-sm">{votes.noPercentage}%</p>
                      </div>
                    </div>

                    {/* Vote Buttons */}
                    {isConnected ? (
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          onClick={() => handleVote('for')}
                          disabled={isVoting}
                          className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 py-3"
                        >
                          {isVoting ? (
                            <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin mr-2" />
                          ) : null}
                          Vote Yes (0.001 ALGO)
                        </Button>
                        <Button
                          onClick={() => handleVote('against')}
                          disabled={isVoting}
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 py-3"
                        >
                          {isVoting ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-2" />
                          ) : null}
                          Vote No (0.001 ALGO)
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                        <p className="text-yellow-400 mb-2">Connect your wallet to vote</p>
                        <Link href="/connect-wallet">
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            Connect Wallet
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}