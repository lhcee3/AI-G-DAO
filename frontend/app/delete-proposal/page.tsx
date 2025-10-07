"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftIcon, Trash2Icon, AlertTriangleIcon, DollarSignIcon, UserIcon, ClockIcon } from "lucide-react"
import Link from "next/link"
import { useWalletContext } from "@/hooks/use-wallet"
import { useClimateDAO } from "@/hooks/use-climate-dao"
import { climateDAOQuery } from "@/lib/blockchain-queries"

export default function DeleteProposalPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const proposalId = searchParams.get('id') ? parseInt(searchParams.get('id')!) : null
  
  const { isConnected, address } = useWalletContext()
  const { deleteProposal } = useClimateDAO()
  
  const [proposal, setProposal] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [confirmText, setConfirmText] = useState("")

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
        
        // Check if user is the creator
        if (proposalData.creator !== address) {
          setError("You can only delete your own proposals")
          return
        }
        
        // Check if proposal has votes (prevent deletion)
        if (proposalData.voteYes > 0 || proposalData.voteNo > 0) {
          setError("Cannot delete proposal that has received votes")
          return
        }
        
        setProposal(proposalData)
        
      } catch (err) {
        console.error('Failed to load proposal:', err)
        setError('Failed to load proposal')
      } finally {
        setIsLoading(false)
      }
    }

    if (address) {
      loadProposal()
    }
  }, [proposalId, address])

  // Handle deletion
  const handleDelete = async () => {
    if (!proposalId || !proposal) return
    
    // Verify confirmation text
    if (confirmText !== proposal.title) {
      alert("Please type the exact proposal title to confirm deletion")
      return
    }

    setIsDeleting(true)
    try {
      await deleteProposal(proposalId)
      
      alert('Proposal deleted successfully from blockchain!')
      router.push('/dashboard')
      
    } catch (error) {
      console.error('Delete failed:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete proposal')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!proposalId) {
    return (
      <div className="relative flex flex-col min-h-[100dvh] text-black overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-black"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between p-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-white hover:text-red-200 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          <div className="text-white font-bold text-lg">Delete Proposal</div>
        </header>

        <main className="relative z-10 flex-1 px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-8 text-center">
                <Trash2Icon className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">No Proposal Selected</h2>
                <p className="text-white/60 mb-4">Please select a proposal to delete from the dashboard.</p>
                <Link href="/dashboard">
                  <Button className="bg-red-600 hover:bg-red-700">
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
          <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-black"></div>
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
          <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-black"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <main className="relative z-10 flex-1 flex items-center justify-center">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-md">
            <CardContent className="p-8 text-center">
              <AlertTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2 text-red-400">Cannot Delete</h2>
              <p className="text-white/60 mb-4">{error}</p>
              <Link href="/dashboard">
                <Button className="bg-red-600 hover:bg-red-700">
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
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-black"></div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-white hover:text-red-200 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </Link>
        <div className="text-white font-bold text-lg">Delete Proposal</div>
      </header>

      <main className="relative z-10 flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {proposal && (
            <>
              {/* Warning Card */}
              <Card className="bg-red-500/10 backdrop-blur-md border-red-500/30 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-400">
                    <AlertTriangleIcon className="w-6 h-6" />
                    Delete Proposal - Permanent Action
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    This action cannot be undone. The proposal will be permanently removed from the blockchain.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Proposal Details */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold mb-2">{proposal.title}</CardTitle>
                  <div className="flex flex-wrap gap-2">
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
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Proposal Info Grid */}
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
                        <p className="text-white/60 text-sm">Your Proposal</p>
                        <p className="text-white font-mono text-sm">You are the creator</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                      <ClockIcon className="w-6 h-6 text-purple-400" />
                      <div>
                        <p className="text-white/60 text-sm">Current Votes</p>
                        <p className="text-white font-bold">{proposal.voteYes + proposal.voteNo} total</p>
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

              {/* Delete Confirmation */}
              <Card className="bg-red-500/10 backdrop-blur-md border-red-500/30 text-white">
                <CardHeader>
                  <CardTitle className="text-red-400">Confirm Deletion</CardTitle>
                  <CardDescription className="text-white/60">
                    To confirm deletion, type the exact proposal title below:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">
                      Type "{proposal.title}" to confirm:
                    </label>
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-400"
                      placeholder="Enter proposal title exactly as shown above"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Link href="/dashboard" className="flex-1">
                      <Button 
                        variant="outline" 
                        className="w-full border-white/30 text-white hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                    </Link>
                    <Button
                      onClick={handleDelete}
                      disabled={isDeleting || confirmText !== proposal.title}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Deleting from Blockchain...
                        </>
                      ) : (
                        <>
                          <Trash2Icon className="w-4 h-4 mr-2" />
                          Delete Proposal
                        </>
                      )}
                    </Button>
                  </div>

                  {confirmText !== proposal.title && confirmText.length > 0 && (
                    <p className="text-red-400 text-sm">
                      Text doesn't match. Please type the exact proposal title.
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  )
}