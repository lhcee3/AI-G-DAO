"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeftIcon, SparklesIcon } from "lucide-react"
import Link from "next/link"
import { useAIReview } from "@/hooks/use-ai-review"
import { AIReviewDisplay } from "@/components/ai-review-display"

export default function ProposalReviewPage() {
  const { isAnalyzing, reviewResult, error, analyzeProposalData, clearReview } = useAIReview()
  
  const [formData, setFormData] = useState({
    projectTitle: "",
    description: "",
    fundingAmount: "",
    duration: "",
    expectedImpact: "",
    category: "",
    location: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAnalyze = async () => {
    if (!formData.projectTitle || !formData.description) {
      alert("Please fill in at least the title and description")
      return
    }

    await analyzeProposalData({
      title: formData.projectTitle,
      description: formData.description,
      category: formData.category || "general",
      fundingAmount: formData.fundingAmount || "0",
      expectedImpact: formData.expectedImpact || "To be determined",
      location: formData.location || "Global"
    })
  }

  return (
    <div className="relative flex flex-col min-h-[100dvh] text-black overflow-hidden">
      {/* Yellow/Black Gradient Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-black hover:text-gray-800 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </Link>
        <div className="text-black font-bold text-lg">AI Proposal Review</div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col lg:flex-row gap-8 px-6 pb-6">
        {/* Proposal Input Form */}
        <div className="flex-1 max-w-2xl">
          <Card className="bg-black/80 border-yellow-500/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-yellow-400 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6" />
                Analyze Climate Proposal
              </CardTitle>
              <CardDescription className="text-gray-300">
                Enter proposal details to get AI-powered analysis and recommendations
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Project Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-yellow-400">Project Title</Label>
                <Input
                  id="title"
                  value={formData.projectTitle}
                  onChange={(e) => handleInputChange("projectTitle", e.target.value)}
                  placeholder="e.g., Solar Panel Installation for Rural Schools"
                  className="bg-black/50 border-yellow-500/30 text-white placeholder-gray-400"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-yellow-400">Project Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="bg-black/50 border-yellow-500/30 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="renewable-energy">Renewable Energy</SelectItem>
                    <SelectItem value="reforestation">Reforestation</SelectItem>
                    <SelectItem value="carbon-capture">Carbon Capture</SelectItem>
                    <SelectItem value="sustainable-agriculture">Sustainable Agriculture</SelectItem>
                    <SelectItem value="waste-management">Waste Management</SelectItem>
                    <SelectItem value="transportation">Clean Transportation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-yellow-400">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g., Kenya, East Africa"
                  className="bg-black/50 border-yellow-500/30 text-white placeholder-gray-400"
                />
              </div>

              {/* Funding Amount */}
              <div className="space-y-2">
                <Label htmlFor="funding" className="text-yellow-400">Funding Amount (ALGO)</Label>
                <Input
                  id="funding"
                  type="number"
                  value={formData.fundingAmount}
                  onChange={(e) => handleInputChange("fundingAmount", e.target.value)}
                  placeholder="e.g., 50000"
                  className="bg-black/50 border-yellow-500/30 text-white placeholder-gray-400"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-yellow-400">Project Description</Label>
                <Textarea
                  id="description"
                  rows={6}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your climate project in detail..."
                  className="bg-black/50 border-yellow-500/30 text-white placeholder-gray-400 resize-none"
                />
              </div>

              {/* Expected Impact */}
              <div className="space-y-2">
                <Label htmlFor="impact" className="text-yellow-400">Expected Impact</Label>
                <Textarea
                  id="impact"
                  rows={3}
                  value={formData.expectedImpact}
                  onChange={(e) => handleInputChange("expectedImpact", e.target.value)}
                  placeholder="e.g., Reduce CO2 emissions by 1000 tons annually"
                  className="bg-black/50 border-yellow-500/30 text-white placeholder-gray-400 resize-none"
                />
              </div>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !formData.projectTitle || !formData.description}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    <span>Analyzing with AI...</span>
                  </div>
                ) : (
                  "🤖 Analyze Proposal"
                )}
              </Button>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Review Results */}
        <div className="flex-1 max-w-2xl">
          {reviewResult ? (
            <AIReviewDisplay review={reviewResult} />
          ) : (
            <Card className="bg-black/80 border-yellow-500/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <SparklesIcon className="w-16 h-16 text-yellow-400 mb-4" />
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">AI Analysis Ready</h3>
                <p className="text-gray-300">
                  Fill in the proposal details and click "Analyze Proposal" to get AI-powered insights
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
