'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BarChart3Icon, 
  TrendingUpIcon, 
  LeafIcon, 
  ZapIcon, 
  RecycleIcon, 
  TreesIcon,
  DropletIcon,
  ThermometerIcon,
  WalletIcon,
  ArrowLeftIcon
} from 'lucide-react';
import { useWallet } from '@/hooks/use-wallet';
import Link from 'next/link';

interface ImpactMetric {
  id: string;
  title: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  description: string;
  target: number;
  category: 'energy' | 'carbon' | 'waste' | 'water' | 'biodiversity';
}

interface Project {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'completed' | 'planning';
  impactScore: number;
  co2Reduced: number;
  energyGenerated: number;
  funding: number;
  startDate: string;
}

const impactMetrics: ImpactMetric[] = [
  {
    id: '1',
    title: 'CO2 Reduced',
    value: 45250,
    unit: 'tons',
    change: 15.2,
    changeType: 'increase',
    icon: <LeafIcon className="w-6 h-6" />,
    description: 'Total carbon dioxide reduced through all active projects',
    target: 60000,
    category: 'carbon'
  },
  {
    id: '2',
    title: 'Clean Energy Generated',
    value: 125.8,
    unit: 'GWh',
    change: 22.1,
    changeType: 'increase',
    icon: <ZapIcon className="w-6 h-6" />,
    description: 'Renewable energy generated this year',
    target: 150,
    category: 'energy'
  },
  {
    id: '3',
    title: 'Waste Recycled',
    value: 8940,
    unit: 'tons',
    change: 8.7,
    changeType: 'increase',
    icon: <RecycleIcon className="w-6 h-6" />,
    description: 'Total waste diverted from landfills',
    target: 12000,
    category: 'waste'
  },
  {
    id: '4',
    title: 'Trees Planted',
    value: 156780,
    unit: 'trees',
    change: 12.4,
    changeType: 'increase',
    icon: <TreesIcon className="w-6 h-6" />,
    description: 'New trees planted for reforestation',
    target: 200000,
    category: 'biodiversity'
  },
  {
    id: '5',
    title: 'Water Saved',
    value: 2.4,
    unit: 'ML',
    change: 5.3,
    changeType: 'increase',
    icon: <DropletIcon className="w-6 h-6" />,
    description: 'Water conservation through efficient systems',
    target: 3.0,
    category: 'water'
  },
  {
    id: '6',
    title: 'Temperature Impact',
    value: 0.02,
    unit: '°C reduced',
    change: 0.01,
    changeType: 'increase',
    icon: <ThermometerIcon className="w-6 h-6" />,
    description: 'Estimated global temperature reduction contribution',
    target: 0.05,
    category: 'carbon'
  }
];

const activeProjects: Project[] = [
  {
    id: '1',
    name: 'Solar Farm Initiative - Kenya',
    location: 'Nairobi, Kenya',
    status: 'active',
    impactScore: 87,
    co2Reduced: 15000,
    energyGenerated: 45.2,
    funding: 2500000,
    startDate: '2024-03-15'
  },
  {
    id: '2',
    name: 'Ocean Plastic Collection',
    location: 'Pacific Ocean',
    status: 'active',
    impactScore: 92,
    co2Reduced: 2500,
    energyGenerated: 0,
    funding: 1800000,
    startDate: '2024-06-01'
  },
  {
    id: '3',
    name: 'Urban Vertical Gardens',
    location: 'New York, USA',
    status: 'completed',
    impactScore: 78,
    co2Reduced: 8750,
    energyGenerated: 0,
    funding: 1200000,
    startDate: '2023-12-10'
  }
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'energy': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    case 'carbon': return 'bg-green-500/20 text-green-400 border-green-500/50';
    case 'waste': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
    case 'water': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    case 'biodiversity': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500/20 text-green-400';
    case 'completed': return 'bg-blue-500/20 text-blue-400';
    case 'planning': return 'bg-yellow-500/20 text-yellow-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

export default function ImpactAnalyticsPage() {
  const { isConnected, address, balance } = useWallet();
  
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
          <BarChart3Icon className="w-8 h-8 text-white" />
          <div className="text-white font-bold text-xl">Impact Analytics</div>
        </div>
        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-white/90">Real-time tracking</div>
                <div className="text-xs text-white/70">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/80">Real-time environmental impact tracking</span>
              <Link href="/connect-wallet">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                  <WalletIcon className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10 flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
              <CardContent className="p-4 text-center">
                <TrendingUpIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">28</div>
                <div className="text-sm text-white/60">Active Projects</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
              <CardContent className="p-4 text-center">
                <LeafIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">45.2K</div>
                <div className="text-sm text-white/60">Tons CO2 Reduced</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
              <CardContent className="p-4 text-center">
                <ZapIcon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">125.8</div>
                <div className="text-sm text-white/60">GWh Generated</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
              <CardContent className="p-4 text-center">
                <TreesIcon className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">156K</div>
                <div className="text-sm text-white/60">Trees Planted</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Impact Metrics */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Environmental Impact Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {impactMetrics.map((metric) => {
                const progress = (metric.value / metric.target) * 100;
                
                return (
                  <Card key={metric.id} className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="text-white">{metric.icon}</div>
                          <CardTitle className="text-white text-lg">{metric.title}</CardTitle>
                        </div>
                        <Badge className={getCategoryColor(metric.category)}>
                          {metric.category.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-end gap-2">
                          <span className="text-3xl font-bold text-white">
                            {metric.value.toLocaleString()}
                          </span>
                          <span className="text-white/60 text-sm mb-1">{metric.unit}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <TrendingUpIcon className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 text-sm">
                            +{metric.change}% this month
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Progress to target</span>
                          <span className="text-white/70">{progress.toFixed(1)}%</span>
                        </div>
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-white/50">
                          Target: {metric.target.toLocaleString()} {metric.unit}
                        </div>
                      </div>

                      <p className="text-sm text-white/70">{metric.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Active Projects */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Project Performance</h2>
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <Card key={project.id} className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-white text-xl">{project.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status.toUpperCase()}
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                            Impact Score: {project.impactScore}/100
                          </Badge>
                          <span className="text-sm text-white/60">{project.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold text-lg">
                          ${project.funding.toLocaleString()}
                        </div>
                        <div className="text-sm text-white/60">Total Funding</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                        <div className="text-sm text-green-400 font-medium mb-1">CO2 Reduced</div>
                        <div className="text-lg font-bold text-white">{project.co2Reduced.toLocaleString()}</div>
                        <div className="text-xs text-white/60">tons annually</div>
                      </div>
                      
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                        <div className="text-sm text-blue-400 font-medium mb-1">Energy Generated</div>
                        <div className="text-lg font-bold text-white">{project.energyGenerated}</div>
                        <div className="text-xs text-white/60">GWh annually</div>
                      </div>
                      
                      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                        <div className="text-sm text-cyan-400 font-medium mb-1">Start Date</div>
                        <div className="text-lg font-bold text-white">
                          {new Date(project.startDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-white/60">Project launch</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
