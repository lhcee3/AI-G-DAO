'use client';

import { useState } from 'react';
import { analyzeProposal, AIReviewResult } from '@/lib/gemini';

export function useAIReview() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewResult, setReviewResult] = useState<AIReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeProposalData = async (proposalData: {
    title: string;
    description: string;
    category: string;
    fundingAmount: string;
    expectedImpact: string;
    location: string;
  }) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await analyzeProposal(
        proposalData.title,
        proposalData.description,
        proposalData.category,
        proposalData.fundingAmount,
        proposalData.expectedImpact,
        proposalData.location
      );
      setReviewResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearReview = () => {
    setReviewResult(null);
    setError(null);
  };

  return {
    isAnalyzing,
    reviewResult,
    error,
    analyzeProposalData,
    clearReview
  };
}
