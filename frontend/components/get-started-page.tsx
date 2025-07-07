"use client"

import { motion } from "framer-motion"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { LightbulbIcon, BotIcon, VoteIcon, HandshakeIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
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
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-12 px-4">
      <motion.div
        className="container mx-auto flex-1 flex flex-col items-center justify-center text-center space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-gray-900 dark:text-gray-50"
          variants={itemVariants}
        >
          Ready to Make a Difference?
        </motion.h1>
        <motion.p className="mx-auto max-w-[800px] text-gray-600 md:text-xl dark:text-gray-400" variants={itemVariants}>
          Joining the AI-Governed DAO is simple. Follow these steps to start contributing to impactful climate projects.
        </motion.p>

        <motion.div
          className="grid items-start gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-12 mt-12"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className="flex flex-col items-center text-center p-6 shadow-md bg-white dark:bg-gray-800">
              <LightbulbIcon className="w-12 h-12 text-green-500 mb-4" />
              <CardTitle className="text-xl font-semibold mb-2">1. Understand the Vision</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Familiarize yourself with our mission, the hybrid AI+human model, and Algorand's role.
              </CardDescription>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="flex flex-col items-center text-center p-6 shadow-md bg-white dark:bg-gray-800">
              <BotIcon className="w-12 h-12 text-purple-500 mb-4" />
              <CardTitle className="text-xl font-semibold mb-2">2. Get DAO Tokens</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Acquire DAO governance tokens to participate in voting and proposal submissions.
              </CardDescription>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="flex flex-col items-center text-center p-6 shadow-md bg-white dark:bg-gray-800">
              <VoteIcon className="w-12 h-12 text-blue-500 mb-4" />
              <CardTitle className="text-xl font-semibold mb-2">3. Engage & Vote</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Review proposals, analyze AI scores, and cast your vote to shape climate action.
              </CardDescription>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="flex flex-col items-center text-center p-6 shadow-md bg-white dark:bg-gray-800">
              <HandshakeIcon className="w-12 h-12 text-orange-500 mb-4" />
              <CardTitle className="text-xl font-semibold mb-2">4. See the Impact</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Witness your contributions directly fund verified green projects and reduce CO₂ emissions.
              </CardDescription>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div className="mt-12 space-y-4" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Ready to Join?</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Start your journey with the AI-Governed DAO today and be a part of a transparent and effective solution to
            climate change.
          </p>
          <Link href="#" passHref>
            <Button className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-transform transform hover:scale-105">
              Get Your DAO Tokens
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
