"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BotIcon, HandshakeIcon, LeafIcon, LightbulbIcon, VoteIcon } from "lucide-react"
import { ProjectsList } from "@/components/projects-list"
import Link from "next/link"

export function LandingPage() {
  return (
    <div className="relative flex flex-col min-h-[100dvh] text-white overflow-hidden">
      {/* Moving Gradient Background - Applied to the entire page */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 animate-moving-gradient"></div>
      </div>

      <main className="relative z-10 flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center text-center px-4 bg-transparent">
          <div className="container space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-white">
                AI-Governed DAO for <span className="climate-glow">Climate</span> Impact Credits
              </h1>
              <p className="mx-auto max-w-[800px] text-gray-300 md:text-xl">
                Revolutionizing Green Project Funding with Hybrid Intelligence on Algorand. Leveraging AI for impact
                assessment and human wisdom for decentralized governance.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Button className="px-8 py-3 text-lg bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg transition-transform transform hover:scale-105">
                <Link href="/get-started">Learn More</Link>
              </Button>
              <Button
                variant="outline"
                className="px-8 py-3 text-lg border-white text-white hover:bg-gray-800 rounded-full shadow-lg transition-transform transform hover:scale-105 bg-transparent"
              >
                Join the DAO
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-8 flex items-center justify-center gap-2">
              <LeafIcon className="w-4 h-4 text-teal-500" />
              Powered by Algorand's ultra-low carbon footprint blockchain.
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 px-4">
          <div className="container space-y-12">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                  Our Hybrid Decision-Making Model
                </h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Combining the precision of AI with the wisdom of the community for impactful climate action.
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
              <Card className="flex flex-col items-center text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-black/50 border border-gray-800 backdrop-blur-sm">
                <LightbulbIcon className="w-12 h-12 text-teal-500 mb-4" />
                <CardTitle className="text-xl font-semibold mb-2 text-white">1. Submit Proposal</CardTitle>
                <CardDescription className="text-gray-300">
                  Startups and organizations submit their green project proposals to the DAO.
                </CardDescription>
              </Card>
              <Card className="flex flex-col items-center text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-black/50 border border-gray-800 backdrop-blur-sm">
                <BotIcon className="w-12 h-12 text-teal-500 mb-4" />
                <CardTitle className="text-xl font-semibold mb-2 text-white">2. AI Evaluation</CardTitle>
                <CardDescription className="text-gray-300">
                  Our AI engine analyzes the proposal, providing an Environmental Impact Score (e.g., 8.2/10).
                </CardDescription>
              </Card>
              <Card className="flex flex-col items-center text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-black/50 border border-gray-800 backdrop-blur-sm">
                <VoteIcon className="w-12 h-12 text-teal-500 mb-4" />
                <CardTitle className="text-xl font-semibold mb-2 text-white">3. Community Vote</CardTitle>
                <CardDescription className="text-gray-300">
                  DAO members review the AI score and proposal, then cast their votes.
                </CardDescription>
              </Card>
              <Card className="flex flex-col items-center text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-black/50 border border-gray-800 backdrop-blur-sm">
                <HandshakeIcon className="w-12 h-12 text-teal-500 mb-4" />
                <CardTitle className="text-xl font-semibold mb-2 text-white">4. Fund & Impact</CardTitle>
                <CardDescription className="text-gray-300">
                  If approved, smart contracts release funding or tokenized carbon credits to the project.
                </CardDescription>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 px-4">
          <div className="container space-y-12">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Why Our DAO?</h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Driving transparent, efficient, and impactful climate action through innovation.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-black/50 border border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <BotIcon className="w-8 h-8 text-teal-500 mb-2" />
                  <CardTitle className="text-white">Intelligent Vetting</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  AI-powered scoring ensures that only the most impactful and viable climate projects receive funding.
                </CardContent>
              </Card>
              <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-black/50 border border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <VoteIcon className="w-8 h-8 text-teal-500 mb-2" />
                  <CardTitle className="text-white">Decentralized Governance</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  Empowering a global community to collectively decide on the future of climate finance.
                </CardContent>
              </Card>
              <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-black/50 border border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <LeafIcon className="w-8 h-8 text-teal-500 mb-2" />
                  <CardTitle className="text-white">Real-World Impact</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  Directly fund sustainability and green projects, making a tangible difference in CO₂ reduction.
                </CardContent>
              </Card>
              <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-black/50 border border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <img src="/placeholder.svg?height=32&width=32" alt="Algorand Icon" className="w-8 h-8 mb-2" />
                  <CardTitle className="text-white">Algorand Advantage</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  Leveraging Algorand's secure, scalable, and environmentally friendly blockchain for operations.
                </CardContent>
              </Card>
              <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-black/50 border border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <img src="/placeholder.svg?height=32&width=32" alt="Token Icon" className="w-8 h-8 mb-2" />
                  <CardTitle className="text-white">Tokenized Credits</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  Efficient and transparent management of verified carbon credits, tokenized for easy transfer.
                </CardContent>
              </Card>
              <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-black/50 border border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <LightbulbIcon className="w-8 h-8 text-teal-500 mb-2" />
                  <CardTitle className="text-white">Innovation at Core</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  A unique hybrid decision-making model setting new standards for decentralized environmental
                  initiatives.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* New Projects List Section */}
        <ProjectsList />

        {/* Call to Action Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center text-center px-4 bg-transparent">
          <div className="container space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Ready to Make an Impact?</h2>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                Join our community and help shape a sustainable future by funding verified climate projects.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Button className="px-8 py-3 text-lg bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg transition-transform transform hover:scale-105">
                <Link href="/get-started">Get Started</Link>
              </Button>
              <Button
                variant="outline"
                className="px-8 py-3 text-lg border-white text-white hover:bg-gray-800 rounded-full shadow-lg transition-transform transform hover:scale-105 bg-transparent"
              >
                Submit a Proposal
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800 bg-black text-gray-300">
        <p className="text-xs">&copy; {new Date().getFullYear()} AI-Governed DAO. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy Policy
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
        </nav>
      </footer>

      {/* CSS for moving gradient and blinking glow */}
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

        @keyframes blink-glow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.3), 0 0 10px rgba(0, 255, 255, 0.3), 0 0 15px rgba(0, 255, 255, 0.3);
          }
          50% {
            text-shadow: 0 0 15px rgba(0, 255, 255, 0.8), 0 0 25px rgba(0, 255, 255, 0.8), 0 0 35px rgba(0, 255, 255, 0.8);
          }
        }
        .climate-glow {
          animation: blink-glow 3s infinite alternate;
          color: #00FFFF; /* Teal color for the word itself */
        }
      `}</style>
    </div>
  )
}
