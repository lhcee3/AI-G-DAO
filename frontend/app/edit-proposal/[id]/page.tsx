"use client"

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeftIcon, SaveIcon } from "lucide-react"
import Link from "next/link"
import { useWalletContext } from "@/hooks/use-wallet"
import { useClimateDAO } from "@/hooks/use-climate-dao"
import { climateDAOQuery } from "@/lib/blockchain-queries"

export default function EditProposalPage() {
  const { id } = useParams()
  const router = useRouter()
  const { isConnected, address } = useWalletContext()
  const { loading } = useClimateDAO()
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fundingAmount: "",
    expectedImpact: "",
    category: "",
    location: "",
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadProposal = async () => {
      try {
        if (!id) return
        
        const proposalId = parseInt(id as string)
        const proposal = await climateDAOQuery.getProposal(proposalId)
        
        if (!proposal) {
          setError("Proposal not found")
          return
        }
        
        // Check if user is the creator
        if (proposal.creator !== address) {
          setError("You can only edit your own proposals")
          return
        }
        
        // Check if proposal has votes - prevent editing if voted on
        if (proposal.voteYes > 0 || proposal.voteNo > 0) {
          setError("Cannot edit proposal that has received votes")
          return
        }
        
        // Load proposal data into form
        setFormData({
          title: proposal.title,
          description: proposal.description,
          fundingAmount: proposal.fundingAmount.toString(),
          expectedImpact: "", // Not stored in current proposal structure
          category: proposal.category || "",
          location: "", // Not stored in current proposal structure
        })
        
      } catch (err) {
        console.error('Failed to load proposal:', err)
        setError("Failed to load proposal")
      } finally {
        setIsLoading(false)
      }
    }

    if (isConnected && address) {
      loadProposal()
    }
  }, [id, isConnected, address])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected || !address) {
      setError("Please connect your wallet first")
      return
    }

    setIsSaving(true)
    setError("")

    try {
      const proposalId = parseInt(id as string)
      
      // Update the proposal in localStorage
      const storedProposals = localStorage.getItem('climate_dao_proposals')
      if (!storedProposals) {
        throw new Error('No proposals found')
      }
      
      const proposals = JSON.parse(storedProposals)
      const proposalIndex = proposals.findIndex((p: any) => p.id === proposalId)
      
      if (proposalIndex === -1) {
        throw new Error('Proposal not found')
      }
      
      // Update the proposal
      proposals[proposalIndex] = {
        ...proposals[proposalIndex],
        title: formData.title,
        description: formData.description,
        fundingAmount: parseInt(formData.fundingAmount) || 0,
        category: formData.category,
        updatedAt: new Date().toISOString(),
      }
      
      // Save back to localStorage
      localStorage.setItem('climate_dao_proposals', JSON.stringify(proposals))
      
      // Redirect back to dashboard
      router.push('/dashboard')
      
    } catch (err) {
      console.error('Failed to save proposal:', err)
      setError(err instanceof Error ? err.message : 'Failed to save proposal')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="relative flex flex-col min-h-[100dvh] text-white overflow-hidden">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-black"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
            <p className="mt-4 text-white/60">Loading proposal...</p>
          </div>
        </div>
      </div>
    )
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
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 text-xl mb-4">{error}</p>
            <Link href="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col min-h-[100dvh] text-black overflow-hidden">
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
        <div className="text-white font-bold text-lg">Climate DAO - Edit Proposal</div>
      </header>

      <main className="relative z-10 flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-white">
              Edit Your Proposal
            </h1>
            <p className="text-white/70 text-xl max-w-2xl mx-auto">
              Update your climate proposal details
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 rounded-3xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <SaveIcon className="w-8 h-8" />
                Proposal Details
              </CardTitle>
              <CardDescription className="text-white/70 text-lg">
                Update your proposal information. Note: You cannot edit proposals that have received votes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white text-base font-medium">
                      Project Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl h-12"
                      placeholder="Enter your project title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-white text-base font-medium">
                      Category
                    </Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl h-12"
                      placeholder="e.g., Renewable Energy, Carbon Capture"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white text-base font-medium">
                    Project Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl min-h-[120px]"
                    placeholder="Describe your climate project in detail..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fundingAmount" className="text-white text-base font-medium">
                      Funding Amount (USD)
                    </Label>
                    <Input
                      id="fundingAmount"
                      type="number"
                      value={formData.fundingAmount}
                      onChange={(e) => handleInputChange("fundingAmount", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl h-12"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white text-base font-medium">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl h-12"
                      placeholder="e.g., Kenya, Brazil, Global"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedImpact" className="text-white text-base font-medium">
                    Expected Impact
                  </Label>
                  <Textarea
                    id="expectedImpact"
                    value={formData.expectedImpact}
                    onChange={(e) => handleInputChange("expectedImpact", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl min-h-[100px]"
                    placeholder="Describe the expected environmental impact..."
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white h-12 rounded-xl font-medium"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="w-5 h-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  
                  <Link href="/dashboard">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 h-12 px-8 rounded-xl"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}