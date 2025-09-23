"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeftIcon, UploadIcon, FileTextIcon, DollarSignIcon, CalendarIcon } from "lucide-react"
import Link from "next/link"
import { useWalletContext } from "@/hooks/use-wallet"
import { useClimateDAO } from "@/hooks/use-climate-dao"
import { useRouter } from "next/navigation"
import { useLoading } from "@/hooks/use-loading"

export function SubmitProposalPage() {
  const { isConnected, address } = useWalletContext()
  const { submitProposal, loading, error } = useClimateDAO()
  const { setLoading } = useLoading()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    projectTitle: "",
    description: "",
    fundingAmount: "",
    duration: "",
    expectedImpact: "",
    category: "",
    location: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      alert("Please connect your wallet first!")
      router.push('/connect-wallet')
      return
    }

    setLoading(true, "Submitting your proposal...")

    try {
      const fundingAmountNum = parseInt(formData.fundingAmount) || 0
      const impactScore = formData.expectedImpact
      
      const txId = await submitProposal({
        title: formData.projectTitle,
        description: formData.description,
        fundingAmount: fundingAmountNum,
        expectedImpact: impactScore,
        category: formData.category,
        location: formData.location,
      })
      
      alert(`Proposal submitted successfully! Transaction ID: ${txId}`)
      
      // Reset form
      setFormData({
        projectTitle: "",
        description: "",
        fundingAmount: "",
        duration: "",
        expectedImpact: "",
        category: "",
        location: "",
      })
      
    } catch (err) {
      console.error('Failed to submit proposal:', err)
      alert(`Failed to submit proposal: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
        <div className="text-white font-bold text-lg">Climate DAO - Submit Proposal</div>
      </header>

      <main className="relative z-10 flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-blue-400">Submit Your Climate Project</h1>
            <p className="text-blue-500 text-lg max-w-2xl mx-auto">
              Share your innovative climate solution with our DAO community. Our AI will evaluate your proposal for
              environmental impact and feasibility.
            </p>
          </div>

          <Card className="bg-black/80 border-blue-500/50 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                <FileTextIcon className="w-8 h-8 text-blue-400" />
              </div>
              <CardTitle className="text-2xl text-blue-400">Project Proposal Form</CardTitle>
              <CardDescription className="text-gray-300">
                Provide detailed information about your climate impact project
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="projectTitle" className="text-blue-400 font-medium">
                      Project Title *
                    </Label>
                    <Input
                      id="projectTitle"
                      value={formData.projectTitle}
                      onChange={(e) => handleInputChange("projectTitle", e.target.value)}
                      placeholder="e.g., Solar Panel Installation for Rural Schools"
                      className="bg-black/50 border-blue-500/30 text-white placeholder:text-gray-400 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-blue-400 font-medium">
                      Project Category *
                    </Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-blue-500/30 text-white rounded-md focus:border-blue-500 focus:outline-none"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="renewable-energy">Renewable Energy</option>
                      <option value="carbon-capture">Carbon Capture</option>
                      <option value="reforestation">Reforestation</option>
                      <option value="sustainable-agriculture">Sustainable Agriculture</option>
                      <option value="waste-management">Waste Management</option>
                      <option value="clean-transportation">Clean Transportation</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-blue-400 font-medium">
                    Project Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your project in detail, including objectives, methodology, and expected outcomes..."
                    className="bg-black/50 border-blue-500/30 text-white placeholder:text-gray-400 focus:border-blue-500 min-h-[120px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fundingAmount" className="text-blue-400 font-medium flex items-center gap-2">
                      <DollarSignIcon className="w-4 h-4" />
                      Funding Requested (USD) *
                    </Label>
                    <Input
                      id="fundingAmount"
                      type="number"
                      value={formData.fundingAmount}
                      onChange={(e) => handleInputChange("fundingAmount", e.target.value)}
                      placeholder="50000"
                      className="bg-black/50 border-blue-500/30 text-white placeholder:text-gray-400 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-blue-400 font-medium flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Project Duration (months) *
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      placeholder="12"
                      className="bg-black/50 border-blue-500/30 text-white placeholder:text-gray-400 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-blue-400 font-medium">
                      Location *
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="e.g., Kenya, East Africa"
                      className="bg-black/50 border-blue-500/30 text-white placeholder:text-gray-400 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedImpact" className="text-blue-400 font-medium">
                    Expected Environmental Impact *
                  </Label>
                  <Textarea
                    id="expectedImpact"
                    value={formData.expectedImpact}
                    onChange={(e) => handleInputChange("expectedImpact", e.target.value)}
                    placeholder="Quantify the expected environmental benefits (e.g., CO₂ reduction, energy saved, trees planted, etc.)"
                    className="bg-black/50 border-blue-500/30 text-white placeholder:text-gray-400 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-blue-400 font-medium flex items-center gap-2">
                    <UploadIcon className="w-4 h-4" />
                    Supporting Documents (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-8 text-center">
                    <UploadIcon className="w-12 h-12 text-blue-500/50 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">Drag and drop files here, or click to browse</p>
                    <p className="text-sm text-gray-500">PDF, DOC, or image files (max 10MB each)</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4 border-blue-500/50 text-blue-400 hover:bg-blue-500/10 bg-transparent"
                    >
                      Choose Files
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}
                  
                  {!isConnected && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                      <p className="text-blue-600 text-sm">
                        Please connect your wallet to submit proposals.{" "}
                        <Link href="/connect-wallet" className="underline">
                          Connect Wallet
                        </Link>
                      </p>
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    disabled={loading || !isConnected}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-black font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        <span>Submitting to Blockchain...</span>
                      </div>
                    ) : (
                      "Submit Proposal to DAO"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 bg-transparent"
                  >
                    Save as Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-800">
              Need help with your proposal? Check out our{" "}
              <a href="/submission-guidelines" className="text-black font-medium underline underline-offset-2">
                submission guidelines
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-gray-800 text-sm">
        <p>&copy; {new Date().getFullYear()} Climate DAO. Empowering sustainable innovation.</p>
      </footer>
    </div>
  )
}
