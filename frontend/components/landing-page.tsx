import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BotIcon, HandshakeIcon, LeafIcon, LightbulbIcon, VoteIcon } from "lucide-react" // Removed ArrowRightIcon
import { ProjectsList } from "@/components/projects-list"
import Link from "next/link"

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center text-center px-4">
          <div className="container space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-gray-900 dark:text-gray-50">
                AI-Governed DAO for Climate Impact Credits
              </h1>
              <p className="mx-auto max-w-[800px] text-gray-600 md:text-xl dark:text-gray-400">
                Revolutionizing Green Project Funding with Hybrid Intelligence on Algorand. Leveraging AI for impact
                assessment and human wisdom for decentralized governance.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Button className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-transform transform hover:scale-105">
                <Link href="/get-started">Learn More</Link>
              </Button>
              <Button
                variant="outline"
                className="px-8 py-3 text-lg border-gray-300 text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 rounded-full shadow-lg transition-transform transform hover:scale-105 bg-transparent"
              >
                Join the DAO
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-8 flex items-center justify-center gap-2">
              <LeafIcon className="w-4 h-4 text-green-500" />
              Powered by Algorand's ultra-low carbon footprint blockchain.
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900 px-4">
          <div className="container space-y-12">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900 dark:text-gray-50">
                  Our Hybrid Decision-Making Model
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Combining the precision of AI with the wisdom of the community for impactful climate action.
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
              <Card className="flex flex-col items-center text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <LightbulbIcon className="w-12 h-12 text-green-500 mb-4" />
                <CardTitle className="text-xl font-semibold mb-2">1. Submit Proposal</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Startups and organizations submit their green project proposals to the DAO.
                </CardDescription>
              </Card>
              <Card className="flex flex-col items-center text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <BotIcon className="w-12 h-12 text-purple-500 mb-4" />
                <CardTitle className="text-xl font-semibold mb-2">2. AI Evaluation</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Our AI engine analyzes the proposal, providing an Environmental Impact Score (e.g., 8.2/10).
                </CardDescription>
              </Card>
              <Card className="flex flex-col items-center text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <VoteIcon className="w-12 h-12 text-blue-500 mb-4" />
                <CardTitle className="text-xl font-semibold mb-2">3. Community Vote</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  DAO members review the AI score and proposal, then cast their votes.
                </CardDescription>
              </Card>
              <Card className="flex flex-col items-center text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <HandshakeIcon className="w-12 h-12 text-orange-500 mb-4" />
                <CardTitle className="text-xl font-semibold mb-2">4. Fund & Impact</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  If approved, smart contracts release funding or tokenized carbon credits to the project.
                </CardDescription>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-950 px-4">
          <div className="container space-y-12">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900 dark:text-gray-50">
                  Why Our DAO?
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Driving transparent, efficient, and impactful climate action through innovation.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <BotIcon className="w-8 h-8 text-purple-500 mb-2" />
                  <CardTitle>Intelligent Vetting</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 dark:text-gray-400">
                  AI-powered scoring ensures that only the most impactful and viable climate projects receive funding.
                </CardContent>
              </Card>
              <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <VoteIcon className="w-8 h-8 text-blue-500 mb-2" />
                  <CardTitle>Decentralized Governance</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 dark:text-gray-400">
                  Empowering a global community to collectively decide on the future of climate finance.
                </CardContent>
              </Card>
              <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <LeafIcon className="w-8 h-8 text-green-500 mb-2" />
                  <CardTitle>Real-World Impact</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 dark:text-gray-400">
                  Directly fund sustainability and green projects, making a tangible difference in CO₂ reduction.
                </CardContent>
              </Card>
              <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <img src="/placeholder.svg?height=32&width=32" alt="Algorand Icon" className="w-8 h-8 mb-2" />
                  <CardTitle>Algorand Advantage</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 dark:text-gray-400">
                  Leveraging Algorand's secure, scalable, and environmentally friendly blockchain for operations.
                </CardContent>
              </Card>
              <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <img src="/placeholder.svg?height=32&width=32" alt="Token Icon" className="w-8 h-8 mb-2" />
                  <CardTitle>Tokenized Credits</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 dark:text-gray-400">
                  Efficient and transparent management of verified carbon credits, tokenized for easy transfer.
                </CardContent>
              </Card>
              <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <LightbulbIcon className="w-8 h-8 text-yellow-500 mb-2" />
                  <CardTitle>Innovation at Core</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 dark:text-gray-400">
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
        <section className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center text-center px-4">
          <div className="container space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900 dark:text-gray-50">
              Ready to Make an Impact?
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-400">
              Join our community and help shape a sustainable future by funding verified climate projects.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Button className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-transform transform hover:scale-105">
                <Link href="/get-started">Get Started</Link>
              </Button>
              <Button
                variant="outline"
                className="px-8 py-3 text-lg border-gray-300 text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 rounded-full shadow-lg transition-transform transform hover:scale-105 bg-transparent"
              >
                Submit a Proposal
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400">
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
    </div>
  )
}
