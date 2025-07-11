"use client"

import { ArrowLeftIcon, LeafIcon, LightbulbIcon, CheckCircleIcon, FileTextIcon } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SubmissionGuidelinesPage() {
  return (
    <div className="relative flex flex-col min-h-[100dvh] text-black overflow-hidden">
      {/* Yellow/Black Gradient Background - Same as submit proposal page */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <Link
          href="/submit-proposal"
          className="flex items-center gap-2 text-black hover:text-gray-800 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Submit Proposal</span>
        </Link>
        <div className="text-black font-bold text-lg">Climate DAO - Guidelines</div>
      </header>

      <main className="relative z-10 flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-black">Proposal Submission Guidelines</h1>
            <p className="text-gray-800 text-lg max-w-2xl mx-auto">
              Ensure your project aligns with our core values of environmental protection and innovation.
            </p>
          </div>

          <Card className="bg-black/80 border-yellow-500/50 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-8 h-8 text-yellow-400" />
              </div>
              <CardTitle className="text-2xl text-yellow-400">Key Principles for Your Proposal</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 text-gray-300">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-yellow-400 flex items-center gap-2">
                  <LeafIcon className="w-6 h-6" />
                  Environmental Impact & Responsibility
                </h3>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>
                    **Non-Destructive Impact:** Your project **must not** have any destructive or harmful effects on the
                    environment, ecosystems, or biodiversity. Proposals that involve practices detrimental to natural
                    habitats, excessive resource depletion, or significant pollution will be rejected.
                  </li>
                  <li>
                    **Positive Contribution:** Clearly articulate how your project will lead to a measurable positive
                    environmental impact (e.g., CO₂ reduction, waste diversion, water conservation, habitat restoration,
                    renewable energy generation).
                  </li>
                  <li>
                    **Sustainability:** Demonstrate the long-term sustainability of your project beyond initial funding.
                    Consider its operational longevity and potential for scalability.
                  </li>
                  <li>
                    **Ethical Sourcing:** If applicable, detail your commitment to ethical and sustainable sourcing of
                    materials and resources.
                  </li>
                </ul>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-semibold text-yellow-400 flex items-center gap-2">
                  <LightbulbIcon className="w-6 h-6" />
                  Innovation & Feasibility
                </h3>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>
                    **Innovative Approach:** We seek projects that introduce novel solutions, technologies, or
                    methodologies to address climate challenges. Show how your approach stands out from existing
                    solutions.
                  </li>
                  <li>
                    **Technological Soundness:** If your project involves technology, provide evidence of its
                    feasibility, whether through prototypes, pilot programs, or robust research.
                  </li>
                  <li>
                    **Clear Objectives:** Define clear, measurable, achievable, relevant, and time-bound (SMART)
                    objectives for your project.
                  </li>
                  <li>
                    **Team Capability:** Briefly describe the experience and expertise of your team members relevant to
                    the project's success.
                  </li>
                </ul>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-semibold text-yellow-400 flex items-center gap-2">
                  <FileTextIcon className="w-6 h-6" />
                  General Submission Requirements
                </h3>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>**Completeness:** Ensure all required fields in the proposal form are accurately filled out.</li>
                  <li>
                    **Clarity:** Present your proposal clearly and concisely. Avoid jargon where possible, or explain it
                    thoroughly.
                  </li>
                  <li>
                    **Supporting Documents:** While optional, providing detailed reports, case studies, or
                    certifications can significantly strengthen your proposal.
                  </li>
                  <li>**Transparency:** Be transparent about your project's budget, timeline, and potential risks.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-800">
              Ready to make a difference?{" "}
              <Link href="/submit-proposal" className="text-black font-medium underline underline-offset-2">
                Submit your proposal now!
              </Link>
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
