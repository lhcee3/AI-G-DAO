'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { VoteIcon, CheckCircleIcon, XCircleIcon, ClockIcon, TrendingUpIcon, LeafIcon, WalletIcon, ArrowLeftIcon } from 'lucide-react';
import { useWallet } from '@/hooks/use-wallet';
import Link from 'next/link';

interface Proposal {
  id: string;
  title: string;
  description: string;
  category: 'renewable-energy' | 'carbon-capture' | 'sustainable-agriculture' | 'waste-management';
  aiScore: number;
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  timeRemaining: string;
  status: 'active' | 'passed' | 'rejected';
  fundingRequested: number;
  environmentalImpact: string;
}

const mockProposals: Proposal[] = [
  {
    id: '1',
    title: 'Solar Farm Initiative - Kenya',
    description: 'Establish a 50MW solar farm in rural Kenya to provide clean energy to 10,000 households while creating 200 local jobs.',
    category: 'renewable-energy',
    aiScore: 87,
    votesFor: 1250,
    votesAgainst: 180,
    totalVotes: 1430,
    timeRemaining: '3 days',
    status: 'active',
    fundingRequested: 2500000,
    environmentalImpact: '15,000 tons CO2 reduced annually'
  },
  {
    id: '2',
    title: 'Ocean Plastic Collection Network',
    description: 'Deploy autonomous collection systems in the Pacific to remove 1000 tons of plastic waste annually.',
    category: 'waste-management',
    aiScore: 92,
    votesFor: 890,
    votesAgainst: 45,
    totalVotes: 935,
    timeRemaining: '5 days',
    status: 'active',
    fundingRequested: 1800000,
    environmentalImpact: '1000 tons plastic waste removed'
  },
  {
    id: '3',
    title: 'Vertical Forest Urban Project',
    description: 'Create vertical gardens on 50 buildings in major cities to improve air quality and biodiversity.',
    category: 'carbon-capture',
    aiScore: 78,
    votesFor: 2100,
    votesAgainst: 400,
    totalVotes: 2500,
    timeRemaining: 'Ended',
    status: 'passed',
    fundingRequested: 3200000,
    environmentalImpact: '500 tons CO2 captured annually'
  }
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'renewable-energy': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    case 'carbon-capture': return 'bg-green-500/20 text-green-400 border-green-500/50';
    case 'sustainable-agriculture': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    case 'waste-management': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-yellow-500/20 text-yellow-400';
    case 'passed': return 'bg-green-500/20 text-green-400';
    case 'rejected': return 'bg-red-500/20 text-red-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

export default function VotePage() {
  const [votedProposals, setVotedProposals] = useState<Set<string>>(new Set());
  const { isConnected, address, balance } = useWallet();

  const handleVote = (proposalId: string, voteType: 'for' | 'against') => {
    if (!isConnected) {
      alert('Please connect your wallet to vote');
      return;
    }
    setVotedProposals(prev => new Set([...prev, proposalId]));
    // Here you would integrate with smart contract for actual voting
    console.log(`Voted ${voteType} on proposal ${proposalId}`);
  };

  return (
    <div className="relative flex flex-col min-h-[100dvh] text-white overflow-hidden">
      {/* Blue Gradient Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 border-b border-white/20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          <div className="h-6 w-px bg-white/20"></div>
          <VoteIcon className="w-8 h-8 text-white" />
          <div className="text-white font-bold text-xl">Vote on Proposals</div>
        </div>
        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-white/90">Voting power: {balance.toFixed(0)} tokens</div>
                <div className="text-xs text-white/70">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          ) : (
            <Link href="/connect-wallet">
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                <WalletIcon className="w-4 h-4 mr-2" />
                Connect to Vote
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="relative z-10 flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
              <CardContent className="p-4 text-center">
                <TrendingUpIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">12</div>
                <div className="text-sm text-white/60">Active Proposals</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
              <CardContent className="p-4 text-center">
                <CheckCircleIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">28</div>
                <div className="text-sm text-white/60">Passed Proposals</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
              <CardContent className="p-4 text-center">
                <LeafIcon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">85%</div>
                <div className="text-sm text-white/60">Avg AI Score</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
              <CardContent className="p-4 text-center">
                <ClockIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">5.2M</div>
                <div className="text-sm text-white/60">Total Funding</div>
              </CardContent>
            </Card>
          </div>

          {/* Proposals List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Active Proposals</h2>
            {mockProposals.map((proposal) => {
              const votePercentage = (proposal.votesFor / proposal.totalVotes) * 100;
              const hasVoted = votedProposals.has(proposal.id);
              
              return (
                <Card key={proposal.id} className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-white text-xl">{proposal.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(proposal.category)}>
                            {proposal.category.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(proposal.status)}>
                            {proposal.status.toUpperCase()}
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                            AI Score: {proposal.aiScore}/100
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold text-lg">
                          ${proposal.fundingRequested.toLocaleString()}
                        </div>
                        <div className="text-sm text-white/60">Requested</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-white/80">{proposal.description}</p>
                    
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                      <div className="text-sm text-blue-400 font-medium mb-1">Environmental Impact</div>
                      <div className="text-white/80">{proposal.environmentalImpact}</div>
                    </div>

                    {/* Voting Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">
                          For: {proposal.votesFor} ({votePercentage.toFixed(1)}%)
                        </span>
                        <span className="text-white/70">
                          Against: {proposal.votesAgainst} ({(100 - votePercentage).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 rounded-full"
                          style={{ width: `${votePercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm text-white/70">
                        {proposal.status === 'active' ? (
                          <>Time remaining: <span className="text-blue-400">{proposal.timeRemaining}</span></>
                        ) : (
                          <span className="text-white/50">Voting ended</span>
                        )}
                      </div>
                      
                      {proposal.status === 'active' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleVote(proposal.id, 'for')}
                            disabled={hasVoted || !isConnected}
                            className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                          >
                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                            {hasVoted ? 'Voted' : isConnected ? 'Vote Yes' : 'Connect Wallet'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVote(proposal.id, 'against')}
                            disabled={hasVoted || !isConnected}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent disabled:opacity-50"
                          >
                            <XCircleIcon className="w-4 h-4 mr-1" />
                            {hasVoted ? 'Voted' : isConnected ? 'Vote No' : 'Connect Wallet'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
