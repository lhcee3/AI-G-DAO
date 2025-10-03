"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftIcon, VoteIcon, BarChart3Icon, CalendarIcon, MapPinIcon, DollarSignIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { useWalletContext } from "@/hooks/use-wallet"
import { useClimateDAO } from "@/hooks/use-climate-dao"
import { useLoading } from "@/hooks/use-loading"

export default function ViewProposalPage() {
  const params = useParams()
  const proposalId = parseInt(params.id as string)
  
  const { isConnected, address } = useWalletContext()
  const { getProposal, voteOnProposal, getProposalVotes } = useClimateDAO()
  const { setLoading } = useLoading()
  
  const [proposal, setProposal] = useState<any>(null)
  const [votes, setVotes] = useState<any>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState("")

  // Load proposal data
  useEffect(() => {
    const loadProposal = async () => {
      if (!proposalId) return
      
      try {
        setLoading(true, "Loading proposal...")
        const proposalData = await getProposal(proposalId)
        
        if (!proposalData) {
          setError("Proposal not found")
          return
        }
        
        setProposal(proposalData)
        
        // Load vote data
        const voteData = await getProposalVotes(proposalId)
        setVotes(voteData)
        
      } catch (err) {
        console.error('Failed to load proposal:', err)
        setError('Failed to load proposal')
      } finally {
        setLoading(false)
      }
    }

    loadProposal()
  }, [proposalId])

  const handleVote = async (vote: 'for' | 'against') => {
    if (!isConnected || !address) {
      setError("Please connect your wallet first")
      return
    }

    setIsVoting(true)
    setError("")

    try {
      setLoading(true, `Voting ${vote} on proposal...`)
      
      await voteOnProposal(proposalId, vote)
      
      // Refresh vote data
      const voteData = await getProposalVotes(proposalId)
      setVotes(voteData)
      
    } catch (err) {
      console.error('Failed to vote:', err)
      setError(err instanceof Error ? err.message : 'Failed to vote')
    } finally {
      setIsVoting(false)
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="relative flex flex-col min-h-[100dvh] text-white overflow-hidden">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-black"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <header className="relative z-10 flex items-center justify-between p-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
        </header>

        <main className="relative z-10 flex-1 flex items-center justify-center px-4">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl shadow-2xl max-w-md w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-400 text-center">{error}</p>
              <Link href="/dashboard" className="block mt-4">
                <Button className="w-full">Return to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="relative flex flex-col min-h-[100dvh] text-white overflow-hidden">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-black"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading proposal...</p>
          </div>
        </div>
      </div>
    )
  }

  const yesPercentage = votes ? votes.yesPercentage : 0
  const noPercentage = votes ? votes.noPercentage : 0
  const totalVotes = votes ? votes.totalVotes : 0

  return (
    <div className="relative flex flex-col min-h-[100dvh] text-white overflow-hidden">
      {/* Blue/Black Gradient Background */}
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
        <div className="text-white font-bold text-lg">Climate DAO - Proposal Details</div>
      </header>

      <main className="relative z-10 flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Proposal Header */}
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              {proposal.status.toUpperCase()}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white">{proposal.title}</h1>
            {proposal.aiScore && (
              <p className="text-blue-200">AI Impact Score: {proposal.aiScore}/10</p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 leading-relaxed">{proposal.description}</p>
                </CardContent>
              </Card>

              {/* Expected Impact */}
              {proposal.expectedImpact && (
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">Expected Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80 leading-relaxed">{proposal.expectedImpact}</p>
                  </CardContent>
                </Card>
              )}

              {/* Voting Section */}
              {proposal.status === 'active' && (
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white flex items-center gap-3">
                      <VoteIcon className="w-8 h-8 text-blue-400" />
                      Cast Your Vote
                    </CardTitle>
                    <CardDescription className="text-blue-200">
                      Vote on this proposal. Each vote costs 0.001 ALGO.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        onClick={() => handleVote('for')}
                        disabled={isVoting}
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-xl h-16"
                      >
                        <div className="text-center">
                          <div className="font-semibold">Vote Yes</div>
                          <div className="text-sm opacity-80">0.001 ALGO</div>
                        </div>
                      </Button>
                      <Button 
                        onClick={() => handleVote('against')}
                        disabled={isVoting}
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl h-16"
                      >
                        <div className="text-center">
                          <div className="font-semibold">Vote No</div>
                          <div className="text-sm opacity-80">0.001 ALGO</div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Details */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <DollarSignIcon className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-white/60 text-sm">Funding Goal</p>
                      <p className="text-white font-semibold">${proposal.fundingAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white/60 text-sm">Creator</p>
                      <p className="text-white font-mono text-sm">{proposal.creator.slice(0, 8)}...{proposal.creator.slice(-6)}</p>
                    </div>
                  </div>

                  {proposal.category && (
                    <div className="flex items-center gap-3">
                      <BarChart3Icon className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white/60 text-sm">Category</p>
                        <p className="text-white">{proposal.category}</p>
                      </div>
                    </div>
                  )}

                  {proposal.location && (
                    <div className="flex items-center gap-3">
                      <MapPinIcon className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-white/60 text-sm">Location</p>
                        <p className="text-white">{proposal.location}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-white/60 text-sm">Voting Deadline</p>
                      <p className="text-white">{new Date(proposal.endTime).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Voting Results */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Voting Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/60">Yes Votes</span>
                      <span className="text-green-400">{yesPercentage}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${yesPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/60">No Votes</span>
                      <span className="text-red-400">{noPercentage}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${noPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-white/60 text-sm">Total Votes: <span className="text-white">{totalVotes}</span></p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {address === proposal.creator && (
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">Creator Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {totalVotes === 0 && (
                      <Link href={`/edit-proposal/${proposal.id}`}>
                        <Button className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30">
                          Edit Proposal
                        </Button>
                      </Link>
                    )}
                    {totalVotes === 0 && (
                      <Button 
                        variant="outline"
                        className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this proposal?')) {
                            // Handle delete
                          }
                        }}
                      >
                        Delete Proposal
                      </Button>
                    )}
                    {totalVotes > 0 && (
                      <p className="text-white/60 text-sm text-center">
                        Cannot edit/delete proposal with votes
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}