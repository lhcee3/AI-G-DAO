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
