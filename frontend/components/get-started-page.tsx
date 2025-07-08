"use client"

import { motion, type Variants } from "framer-motion" // Import Variants
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { LightbulbIcon, BotIcon, VoteIcon, HandshakeIcon } from "lucide-react"
import { ConnectWallet } from "@/components/connect-wallet" // Add this import

const containerVariants: Variants = {
  // Explicitly type containerVariants
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  // Explicitly type itemVariants
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
}

export function GetStartedPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-black to-gray-950 py-12 px-4 text-white">
      <motion.div
        className="container mx-auto flex-1 flex flex-col items-center justify-center text-center space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-white"
          variants={itemVariants}
        >
          Ready to Make a Difference?
        </motion.h1>
        <motion.p className="mx-auto max-w-[800px] text-gray-300 md:text-xl" variants={itemVariants}>
          Joining the AI-Governed DAO is simple. Follow these steps to start contributing to impactful climate projects.
        </motion.p>

        <motion.div
          className="grid items-start gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-12 mt-12"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className="flex flex-col items-center text-center p-6 shadow-md bg-black border border-gray-800">
              <LightbulbIcon className="w-12 h-12 text-teal-500 mb-4" />
              <CardTitle className="text-xl font-semibold mb-2 text-white">1. Understand the Vision</CardTitle>
              <CardDescription className="text-gray-300">
                Familiarize yourself with our mission, the hybrid AI+human model, and Algorand's role.
              </CardDescription>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="flex flex-col items-center text-center p-6 shadow-md bg-black border border-gray-800">
              <BotIcon className="w-12 h-12 text-teal-500 mb-4" />
              <CardTitle className="text-xl font-semibold mb-2 text-white">2. Get DAO Tokens</CardTitle>
              <CardDescription className="text-gray-300">
                Acquire DAO governance tokens to participate in voting and proposal submissions.
              </CardDescription>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="flex flex-col items-center text-center p-6 shadow-md bg-black border border-gray-800">
              <VoteIcon className="w-12 h-12 text-teal-500 mb-4" />
              <CardTitle className="text-xl font-semibold mb-2 text-white">3. Engage & Vote</CardTitle>
              <CardDescription className="text-gray-300">
                Review proposals, analyze AI scores, and cast your vote to shape climate action.
              </CardDescription>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="flex flex-col items-center text-center p-6 shadow-md bg-black border border-gray-800">
              <HandshakeIcon className="w-12 h-12 text-teal-500 mb-4" />
              <CardTitle className="text-xl font-semibold mb-2 text-white">4. See the Impact</CardTitle>
              <CardDescription className="text-gray-300">
                Witness your contributions directly fund verified green projects and reduce CO₂ emissions.
              </CardDescription>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div className="mt-12 space-y-4" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-white">Ready to Join?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Start your journey with the AI-Governed DAO today and be a part of a transparent and effective solution to
            climate change.
          </p>
          {/* Add the ConnectWallet component here */}
          <ConnectWallet />
        </motion.div>
      </motion.div>
    </div>
  )
}
