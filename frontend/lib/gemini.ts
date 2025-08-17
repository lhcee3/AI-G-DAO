export interface AIReviewResult {
  score: number; // 0-100
  strengths: string[];
  concerns: string[];
  suggestions: string[];
  category: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  environmentalScore: number;
  feasibilityScore: number;
  innovationScore: number;
}

export async function analyzeProposal(
  title: string,
  description: string,
  category: string,
  fundingAmount: string,
  expectedImpact: string,
  location: string
): Promise<AIReviewResult> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `
Analyze this climate project proposal for a DAO vote. Provide a comprehensive review focusing on:

PROPOSAL DETAILS:
- Title: ${title}
- Category: ${category}
- Location: ${location}
- Funding Requested: ${fundingAmount}
- Description: ${description}
- Expected Impact: ${expectedImpact}

Please evaluate based on:
1. Environmental Impact Potential (0-100)
2. Technical Feasibility (0-100)
3. Innovation Level (0-100)
4. Financial Reasonableness
5. Risk Assessment

Provide response in JSON format:
{
  "score": <overall score 0-100>,
  "category": "<excellent|good|needs-improvement|poor>",
  "environmentalScore": <0-100>,
  "feasibilityScore": <0-100>,
  "innovationScore": <0-100>,
  "strengths": ["strength1", "strength2"],
  "concerns": ["concern1", "concern2"],
  "suggestions": ["suggestion1", "suggestion2"]
}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiResponse) {
      throw new Error('No response from Gemini API');
    }
    // Extract JSON from response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('AI analysis error:', error);
    // Return fallback analysis
    return {
      score: 75,
      category: 'good',
      environmentalScore: 80,
      feasibilityScore: 70,
      innovationScore: 75,
      strengths: ["Clear project description", "Defined environmental goals"],
      concerns: ["Requires manual review", "AI analysis unavailable"],
      suggestions: ["Consider peer review", "Add more technical details"]
    };
  }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

export function getCategoryBadgeColor(category: string): string {
  switch (category) {
    case 'excellent': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'good': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'needs-improvement': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'poor': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}
