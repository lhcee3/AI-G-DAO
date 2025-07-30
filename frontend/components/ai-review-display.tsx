'use client';

import { AIReviewResult, getScoreColor, getCategoryBadgeColor } from '@/lib/gemini';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircleIcon, AlertTriangleIcon, LightbulbIcon } from 'lucide-react';

interface AIReviewDisplayProps {
  review: AIReviewResult;
}

export function AIReviewDisplay({ review }: AIReviewDisplayProps) {
  return (
    <Card className="bg-black/80 border-yellow-500/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-yellow-400 flex items-center gap-2">
            🤖 AI Analysis Results
          </CardTitle>
          <Badge className={getCategoryBadgeColor(review.category)}>
            {review.category.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-yellow-400 font-medium">Overall Score</span>
            <span className={`font-bold text-lg ${getScoreColor(review.score)}`}>
              {review.score}/100
            </span>
          </div>
          <Progress value={review.score} className="h-2" />
        </div>

        {/* Individual Scores */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-lg font-bold ${getScoreColor(review.environmentalScore)}`}>
              {review.environmentalScore}
            </div>
            <div className="text-sm text-gray-300">Environmental</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${getScoreColor(review.feasibilityScore)}`}>
              {review.feasibilityScore}
            </div>
            <div className="text-sm text-gray-300">Feasibility</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${getScoreColor(review.innovationScore)}`}>
              {review.innovationScore}
            </div>
            <div className="text-sm text-gray-300">Innovation</div>
          </div>
        </div>

        {/* Strengths */}
        {review.strengths.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-green-400 font-medium flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4" />
              Strengths
            </h4>
            <ul className="space-y-1">
              {review.strengths.map((strength, index) => (
                <li key={index} className="text-sm text-gray-300 pl-4">
                  • {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Concerns */}
        {review.concerns.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-orange-400 font-medium flex items-center gap-2">
              <AlertTriangleIcon className="w-4 h-4" />
              Concerns
            </h4>
            <ul className="space-y-1">
              {review.concerns.map((concern, index) => (
                <li key={index} className="text-sm text-gray-300 pl-4">
                  • {concern}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggestions */}
        {review.suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-yellow-300 font-medium flex items-center gap-2">
              <LightbulbIcon className="w-4 h-4" />
              Suggestions
            </h4>
            <ul className="space-y-1">
              {review.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-gray-300 pl-4">
                  • {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
