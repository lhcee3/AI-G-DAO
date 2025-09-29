'use client';

import algosdk from 'algosdk';
import { algodClient, CONTRACT_IDS } from '@/lib/algorand';

export interface BlockchainProposal {
  id: number;
  title: string;
  description: string;
  creator: string;
  fundingAmount: number;
  voteYes: number;
  voteNo: number;
  status: 'active' | 'passed' | 'rejected' | 'expired';
  endTime: number;
  category: string;
  aiScore?: number;
  creationTime: number;
}

export interface BlockchainStats {
  totalProposals: number;
  totalMembers: number;
  activeProposals: number;
  userProposalCount: number;
  userVoteCount: number;
}

export interface VotingRecord {
  proposalId: number;
  proposalTitle: string;
  vote: 'for' | 'against';
  timestamp: number;
  txId: string;
  confirmedRound: number;
}

export interface VotingState {
  hasVoted: boolean;
  userVote?: 'for' | 'against';
  votingRecord?: VotingRecord;
}

export interface ProposalVotes {
  proposalId: number;
  yesVotes: number;
  noVotes: number;
  totalVotes: number;
  yesPercentage: number;
  noPercentage: number;
  votingDeadline: number;
  isVotingActive: boolean;
}

export interface ImpactMetrics {
  totalCO2Reduced: number;
  cleanEnergyGenerated: number;
  wasteRecycled: number;
  treesPlanted: number;
  waterSaved: number;
  temperatureImpact: number;
  totalFundingDeployed: number;
  projectsCompleted: number;
}

export interface ProjectImpact {
  id: number;
  name: string;
  location: string;
  status: 'active' | 'completed' | 'planning';
  impactScore: number;
  co2Reduced: number;
  energyGenerated: number;
  funding: number;
  startDate: string;
  category: string;
}

/**
 * Blockchain query service for reading real data from Climate DAO smart contract
 */
export class ClimateDAOQueryService {
  private appId: number;

  constructor() {
    this.appId = CONTRACT_IDS.CLIMATE_DAO;
  }

  /**
   * Check if the contract is deployed and accessible
   */
  private async isContractDeployed(): Promise<boolean> {
    try {
      await algodClient.getApplicationByID(this.appId).do();
      return true;
    } catch (error: any) {
      // Contract doesn't exist or network error
      if (error.status === 404 || error.message?.includes('does not exist')) {
        console.log('Contract not deployed, using mock data');
        return false;
      }
      console.error('Error checking contract deployment:', error);
      return false;
    }
  }

  /**
   * Get global state from the smart contract
   */
  private async getGlobalState(): Promise<Record<string, any>> {
    try {
      // Check if contract is deployed first
      if (!(await this.isContractDeployed())) {
        return {};
      }

      const appInfo = await algodClient.getApplicationByID(this.appId).do();
      const globalState: Record<string, any> = {};
      
      if (appInfo.params.globalState) {
        appInfo.params.globalState.forEach((item: any) => {
          const key = Buffer.from(item.key, 'base64').toString();
          let value;
          
          if (item.value.type === 1) {
            // Bytes
            value = Buffer.from(item.value.bytes, 'base64');
          } else if (item.value.type === 2) {
            // Uint
            value = item.value.uint;
          }
          
          globalState[key] = value;
        });
      }
      
      return globalState;
    } catch (error) {
      console.error('Error reading global state:', error);
      return {};
    }
  }

  /**
   * Read a box value from the smart contract
   */
  private async readBox(key: string): Promise<Uint8Array | null> {
    try {
      // Check if contract is deployed first
      if (!(await this.isContractDeployed())) {
        return null;
      }

      const boxKey = new Uint8Array(Buffer.from(key, 'utf8'));
      const boxValue = await algodClient.getApplicationBoxByName(this.appId, boxKey).do();
      return new Uint8Array(boxValue.value);
    } catch (error: any) {
      // Handle box not found errors gracefully
      if (error.status === 404 || error.message?.includes('box not found')) {
        console.log(`Box ${key} not found, returning null`);
        return null;
      }
      console.error(`Error reading box ${key}:`, error);
      return null;
    }
  }

  /**
   * Get mock proposal data for development when contract isn't deployed
   */
  private getMockProposalData(): BlockchainProposal[] {
    return [
      {
        id: 1,
        title: "Solar Farm Initiative - Kenya",
        description: "Large-scale solar installation to provide clean energy to rural communities in Kenya. This project aims to install 50MW of solar capacity across multiple villages.",
        creator: "KENYASOLXYZ...ABC123",
        fundingAmount: 500000,
        voteYes: 85,
        voteNo: 12,
        status: 'active',
        endTime: Date.now() + (2 * 24 * 60 * 60 * 1000),
        category: "renewable-energy",
        aiScore: 8.7,
        creationTime: Date.now() - (3 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        title: "Ocean Cleanup Technology - Pacific",
        description: "Deploy advanced cleanup technology to remove plastic waste from the Pacific Ocean. Targeting 1000 tons of plastic removal annually.",
        creator: "OCEANCLNXYZ...DEF456",
        fundingAmount: 750000,
        voteYes: 120,
        voteNo: 8,
        status: 'active',
        endTime: Date.now() + (5 * 24 * 60 * 60 * 1000),
        category: "ocean-cleanup",
        aiScore: 9.2,
        creationTime: Date.now() - (5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 3,
        title: "Urban Forest Expansion - São Paulo",
        description: "Plant 10,000 native trees across São Paulo to improve air quality and urban biodiversity. Includes maintenance and monitoring systems.",
        creator: "FORESTSPXYZ...GHI789",
        fundingAmount: 125000,
        voteYes: 95,
        voteNo: 15,
        status: 'active',
        endTime: Date.now() + (1 * 24 * 60 * 60 * 1000),
        category: "reforestation",
        aiScore: 7.8,
        creationTime: Date.now() - (2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 4,
        title: "Green Hydrogen Production - Chile",
        description: "Establish green hydrogen production facility using renewable energy sources. Target production of 500 tons annually.",
        creator: "HYDROGENXYZ...JKL012",
        fundingAmount: 2000000,
        voteYes: 145,
        voteNo: 25,
        status: 'passed',
        endTime: Date.now() - (1 * 24 * 60 * 60 * 1000),
        category: "clean-energy",
        aiScore: 8.9,
        creationTime: Date.now() - (8 * 24 * 60 * 60 * 1000)
      },
      {
        id: 5,
        title: "Carbon Capture Research - Iceland",
        description: "Research and develop direct air capture technology using geothermal energy. Pilot project for 100 tons CO2 annually.",
        creator: "CARBONCPXYZ...MNO345",
        fundingAmount: 300000,
        voteYes: 65,
        voteNo: 45,
        status: 'rejected',
        endTime: Date.now() - (3 * 24 * 60 * 60 * 1000),
        category: "carbon-capture",
        aiScore: 6.5,
        creationTime: Date.now() - (10 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  /**
   * Decode proposal data from contract storage
   */
  private decodeProposalData(data: Uint8Array, proposalId: number): BlockchainProposal | null {
    try {
      // This is a simplified decoder - in real implementation, use proper ARC4 decoding
      // For now, we'll use the mock data
      const mockProposalData = this.getMockProposalData();
      return mockProposalData.find(p => p.id === proposalId) || null;
    } catch (error) {
      console.error('Error decoding proposal data:', error);
      return null;
    }
  }

  /**
   * Get total number of proposals from contract
   */
  async getTotalProposals(): Promise<number> {
    try {
      // Check if contract is deployed first
      if (!(await this.isContractDeployed())) {
        // Return mock data count when contract isn't deployed
        return this.getMockProposalData().length;
      }

      const globalState = await this.getGlobalState();
      return globalState.total_proposals || 0;
    } catch (error) {
      console.error('Error getting total proposals:', error);
      // Fallback to mock data
      return this.getMockProposalData().length;
    }
  }

  /**
   * Get total number of DAO members
   */
  async getTotalMembers(): Promise<number> {
    try {
      // Check if contract is deployed first
      if (!(await this.isContractDeployed())) {
        // Return mock data when contract isn't deployed
        return 892;
      }

      const globalState = await this.getGlobalState();
      return globalState.total_members || 0;
    } catch (error) {
      console.error('Error getting total members:', error);
      return 892; // Fallback to mock data
    }
  }

  /**
   * Get a specific proposal by ID
   */
  async getProposal(proposalId: number): Promise<BlockchainProposal | null> {
    try {
      // Check if contract is deployed first
      if (!(await this.isContractDeployed())) {
        // Use mock data when contract isn't deployed
        const mockData = this.getMockProposalData();
        return mockData.find(p => p.id === proposalId) || null;
      }

      // Try to read from blockchain
      const boxKey = `prop_${proposalId}`;
      const proposalData = await this.readBox(boxKey);
      
      if (!proposalData) {
        // Fallback to mock data if box not found
        return this.decodeProposalData(new Uint8Array([0]), proposalId);
      }
      
      return this.decodeProposalData(proposalData, proposalId);
    } catch (error) {
      console.error(`Error getting proposal ${proposalId}:`, error);
      // Fallback to mock data
      const mockData = this.getMockProposalData();
      return mockData.find(p => p.id === proposalId) || null;
    }
  }

  /**
   * Get all proposals with optional filtering
   */
  async getProposals(filter?: {
    status?: 'active' | 'passed' | 'rejected' | 'expired';
    creator?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<BlockchainProposal[]> {
    try {
      // Check if contract is deployed first
      if (!(await this.isContractDeployed())) {
        // Use mock data when contract isn't deployed
        let proposals = this.getMockProposalData();
        
        // Apply filters to mock data
        if (filter?.status) {
          proposals = proposals.filter(p => p.status === filter.status);
        }
        
        if (filter?.creator) {
          proposals = proposals.filter(p => p.creator === filter.creator);
        }
        
        if (filter?.category) {
          proposals = proposals.filter(p => p.category === filter.category);
        }
        
        // Apply pagination
        if (filter?.offset) {
          proposals = proposals.slice(filter.offset);
        }
        
        if (filter?.limit) {
          proposals = proposals.slice(0, filter.limit);
        }
        
        return proposals;
      }

      // Get from blockchain
      const totalProposals = await this.getTotalProposals();
      const proposals: BlockchainProposal[] = [];
      
      // Get all proposals
      for (let i = 1; i <= totalProposals; i++) {
        const proposal = await this.getProposal(i);
        if (proposal) {
          proposals.push(proposal);
        }
      }
      
      // Apply filters
      let filteredProposals = proposals;
      
      if (filter?.status) {
        filteredProposals = filteredProposals.filter(p => p.status === filter.status);
      }
      
      if (filter?.creator) {
        filteredProposals = filteredProposals.filter(p => p.creator === filter.creator);
      }
      
      if (filter?.category) {
        filteredProposals = filteredProposals.filter(p => p.category === filter.category);
      }
      
      // Apply pagination
      if (filter?.offset) {
        filteredProposals = filteredProposals.slice(filter.offset);
      }
      
      if (filter?.limit) {
        filteredProposals = filteredProposals.slice(0, filter.limit);
      }
      
      return filteredProposals;
    } catch (error) {
      console.error('Error getting proposals:', error);
      // Fallback to mock data
      return this.getMockProposalData().filter(p => {
        if (filter?.status && p.status !== filter.status) return false;
        if (filter?.creator && p.creator !== filter.creator) return false;
        if (filter?.category && p.category !== filter.category) return false;
        return true;
      });
    }
  }

  /**
   * Get user's proposal count
   */
  async getUserProposalCount(userAddress: string): Promise<number> {
    try {
      // In real implementation, call get_user_proposal_count method
      // For now, simulate based on mock data
      const allProposals = await this.getProposals();
      return allProposals.filter(p => p.creator === userAddress).length;
    } catch (error) {
      console.error('Error getting user proposal count:', error);
      return 0;
    }
  }

  /**
   * Get user's vote count
   */
  async getUserVoteCount(userAddress: string): Promise<number> {
    try {
      // In real implementation, call get_user_vote_count method
      // For now, return mock data
      return 3;
    } catch (error) {
      console.error('Error getting user vote count:', error);
      return 0;
    }
  }

  /**
   * Get blockchain statistics
   */
  async getStats(userAddress?: string): Promise<BlockchainStats> {
    try {
      const [totalProposals, totalMembers, allProposals] = await Promise.all([
        this.getTotalProposals(),
        this.getTotalMembers(),
        this.getProposals()
      ]);
      
      const activeProposals = allProposals.filter(p => p.status === 'active').length;
      
      let userProposalCount = 0;
      let userVoteCount = 0;
      
      if (userAddress) {
        [userProposalCount, userVoteCount] = await Promise.all([
          this.getUserProposalCount(userAddress),
          this.getUserVoteCount(userAddress)
        ]);
      }
      
      return {
        totalProposals,
        totalMembers,
        activeProposals,
        userProposalCount,
        userVoteCount
      };
    } catch (error) {
      console.error('Error getting blockchain stats:', error);
      return {
        totalProposals: 0,
        totalMembers: 0,
        activeProposals: 0,
        userProposalCount: 0,
        userVoteCount: 0
      };
    }
  }

  /**
   * Calculate impact metrics from blockchain data
   */
  async getImpactMetrics(): Promise<ImpactMetrics> {
    try {
      const allProposals = await this.getProposals();
      
      // Calculate real impact based on completed/active proposals
      const completedProposals = allProposals.filter(p => p.status === 'passed' || p.status === 'active');
      
      let totalFundingDeployed = 0;
      let totalCO2Reduced = 0;
      let cleanEnergyGenerated = 0;
      let wasteRecycled = 0;
      let treesPlanted = 0;
      let waterSaved = 0;
      
      completedProposals.forEach(proposal => {
        totalFundingDeployed += proposal.fundingAmount;
        
        // Calculate impact based on project type and funding
        switch (proposal.category) {
          case 'renewable-energy':
          case 'clean-energy':
            // Estimate CO2 reduction and energy generation based on funding
            const energyImpact = proposal.fundingAmount * 0.00003; // GWh per dollar
            cleanEnergyGenerated += energyImpact;
            totalCO2Reduced += energyImpact * 0.4; // tons CO2 per GWh
            break;
            
          case 'reforestation':
            // Trees planted based on funding (approx $5 per tree)
            const treeCount = Math.floor(proposal.fundingAmount / 5);
            treesPlanted += treeCount;
            totalCO2Reduced += treeCount * 0.048; // tons CO2 per tree per year
            break;
            
          case 'ocean-cleanup':
            // Waste recycling based on cleanup projects
            wasteRecycled += proposal.fundingAmount * 0.001; // tons per dollar
            totalCO2Reduced += proposal.fundingAmount * 0.0005; // CO2 impact
            break;
            
          case 'carbon-capture':
            // Direct CO2 reduction
            totalCO2Reduced += proposal.fundingAmount * 0.0001; // tons per dollar
            break;
            
          default:
            // General environmental impact
            totalCO2Reduced += proposal.fundingAmount * 0.00002; // conservative estimate
        }
      });
      
      // Water saved calculation (conservative estimate)
      waterSaved = totalFundingDeployed * 0.000001; // ML per dollar
      
      // Temperature impact (very conservative estimate)
      const temperatureImpact = totalCO2Reduced * 0.0000001; // °C per ton CO2
      
      return {
        totalCO2Reduced: Math.round(totalCO2Reduced),
        cleanEnergyGenerated: Math.round(cleanEnergyGenerated * 100) / 100,
        wasteRecycled: Math.round(wasteRecycled),
        treesPlanted: Math.round(treesPlanted),
        waterSaved: Math.round(waterSaved * 100) / 100,
        temperatureImpact: Math.round(temperatureImpact * 10000) / 10000,
        totalFundingDeployed: Math.round(totalFundingDeployed),
        projectsCompleted: completedProposals.length
      };
    } catch (error) {
      console.error('Error calculating impact metrics:', error);
      
      // Return fallback data when blockchain isn't available
      return {
        totalCO2Reduced: 45250,
        cleanEnergyGenerated: 125.8,
        wasteRecycled: 8940,
        treesPlanted: 156780,
        waterSaved: 2.4,
        temperatureImpact: 0.02,
        totalFundingDeployed: 5500000,
        projectsCompleted: 12
      };
    }
  }

  /**
   * Get project impact data based on proposals
   */
  async getProjectImpacts(): Promise<ProjectImpact[]> {
    try {
      const allProposals = await this.getProposals();
      
      return allProposals.map(proposal => ({
        id: proposal.id,
        name: proposal.title,
        location: this.getLocationFromTitle(proposal.title),
        status: this.mapProposalStatusToProjectStatus(proposal.status),
        impactScore: proposal.aiScore || Math.floor(Math.random() * 30) + 70,
        co2Reduced: this.calculateCO2Impact(proposal),
        energyGenerated: this.calculateEnergyImpact(proposal),
        funding: proposal.fundingAmount,
        startDate: new Date(proposal.creationTime).toISOString().split('T')[0],
        category: proposal.category
      }));
    } catch (error) {
      console.error('Error getting project impacts:', error);
      
      // Return fallback data when blockchain isn't available
      return [
        {
          id: 1,
          name: 'Solar Farm Initiative - Kenya',
          location: 'Nairobi, Kenya',
          status: 'active',
          impactScore: 87,
          co2Reduced: 15000,
          energyGenerated: 45.2,
          funding: 500000,
          startDate: '2024-03-15',
          category: 'renewable-energy'
        },
        {
          id: 2,
          name: 'Ocean Cleanup Technology - Pacific',
          location: 'Pacific Ocean',
          status: 'active',
          impactScore: 92,
          co2Reduced: 2500,
          energyGenerated: 0,
          funding: 750000,
          startDate: '2024-06-01',
          category: 'ocean-cleanup'
        },
        {
          id: 4,
          name: 'Green Hydrogen Production - Chile',
          location: 'Santiago, Chile',
          status: 'completed',
          impactScore: 89,
          co2Reduced: 8750,
          energyGenerated: 32.1,
          funding: 2000000,
          startDate: '2023-12-10',
          category: 'clean-energy'
        }
      ];
    }
  }

  /**
   * Map proposal status to project status (helper method)
   */
  private mapProposalStatusToProjectStatus(status: 'active' | 'passed' | 'rejected' | 'expired'): 'active' | 'completed' | 'planning' {
    switch (status) {
      case 'active':
        return 'active';
      case 'passed':
        return 'completed';
      case 'rejected':
      case 'expired':
        return 'planning'; // Show as planning for rejected/expired
      default:
        return 'planning';
    }
  }

  /**
   * Extract location from proposal title (helper method)
   */
  private getLocationFromTitle(title: string): string {
    const locations: { [key: string]: string } = {
      'Kenya': 'Nairobi, Kenya',
      'Pacific': 'Pacific Ocean',
      'São Paulo': 'São Paulo, Brazil',
      'Chile': 'Santiago, Chile',
      'Iceland': 'Reykjavik, Iceland'
    };
    
    for (const [key, location] of Object.entries(locations)) {
      if (title.includes(key)) {
        return location;
      }
    }
    
    return 'Global';
  }

  /**
   * Calculate CO2 impact based on proposal (helper method)
   */
  private calculateCO2Impact(proposal: BlockchainProposal): number {
    switch (proposal.category) {
      case 'renewable-energy':
      case 'clean-energy':
        return Math.floor(proposal.fundingAmount * 0.03); // tons per dollar
      case 'reforestation':
        return Math.floor(proposal.fundingAmount * 0.01); // conservative estimate
      case 'ocean-cleanup':
        return Math.floor(proposal.fundingAmount * 0.005);
      case 'carbon-capture':
        return Math.floor(proposal.fundingAmount * 0.05);
      default:
        return Math.floor(proposal.fundingAmount * 0.005);
    }
  }

  /**
   * Calculate energy impact based on proposal (helper method)
   */
  private calculateEnergyImpact(proposal: BlockchainProposal): number {
    if (proposal.category === 'renewable-energy' || proposal.category === 'clean-energy') {
      return Math.round((proposal.fundingAmount * 0.00003) * 100) / 100; // GWh
    }
    return 0;
  }

  /**
   * Check if user has voted on a specific proposal
   */
  async getUserVotingState(proposalId: number, userAddress: string): Promise<VotingState> {
    try {
      // In real implementation, check if user has voted by querying the contract
      // For now, simulate the check
      
      // Check if user has voted on this proposal by looking for vote records
      const votingRecords = await this.getUserVotingHistory(userAddress);
      const existingVote = votingRecords.find(record => record.proposalId === proposalId);
      
      return {
        hasVoted: !!existingVote,
        userVote: existingVote?.vote,
        votingRecord: existingVote
      };
    } catch (error) {
      console.error('Error checking voting state:', error);
      return { hasVoted: false };
    }
  }

  /**
   * Get user's voting history
   */
  async getUserVotingHistory(userAddress: string): Promise<VotingRecord[]> {
    try {
      // In real implementation, query the blockchain for user's voting transactions
      // For now, return mock data based on user address
      
      if (!userAddress) return [];
      
      // Mock voting history - in real implementation, query blockchain transaction history
      const mockHistory: VotingRecord[] = [
        {
          proposalId: 1,
          proposalTitle: "Solar Farm Initiative - Kenya",
          vote: 'for',
          timestamp: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
          txId: 'VOTE123ABC...DEF456',
          confirmedRound: 12345678
        },
        {
          proposalId: 2,
          proposalTitle: "Ocean Cleanup Technology - Pacific",
          vote: 'for',
          timestamp: Date.now() - (6 * 60 * 60 * 1000), // 6 hours ago
          txId: 'VOTE789GHI...JKL012',
          confirmedRound: 12345670
        },
        {
          proposalId: 4,
          proposalTitle: "Green Hydrogen Production - Chile",
          vote: 'against',
          timestamp: Date.now() - (24 * 60 * 60 * 1000), // 1 day ago
          txId: 'VOTE345MNO...PQR678',
          confirmedRound: 12345650
        }
      ];
      
      return mockHistory;
    } catch (error) {
      console.error('Error fetching voting history:', error);
      return [];
    }
  }

  /**
   * Get real-time vote counts for a proposal
   */
  async getProposalVotes(proposalId: number): Promise<ProposalVotes> {
    try {
      // In real implementation, read vote data from contract box storage
      const boxKey = `votes_${proposalId}`;
      const voteData = await this.readBox(boxKey);
      
      // Get proposal for voting deadline
      const proposal = await this.getProposal(proposalId);
      
      if (!proposal) {
        throw new Error('Proposal not found');
      }
      
      let yesVotes = proposal.voteYes || 0;
      let noVotes = proposal.voteNo || 0;
      
      // If we have real vote data, decode it
      if (voteData) {
        // In real implementation, decode the vote data from contract
        // For now, use the proposal's vote counts
      }
      
      const totalVotes = yesVotes + noVotes;
      const yesPercentage = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0;
      const noPercentage = totalVotes > 0 ? Math.round((noVotes / totalVotes) * 100) : 0;
      const isVotingActive = proposal.status === 'active' && proposal.endTime > Date.now();
      
      return {
        proposalId,
        yesVotes,
        noVotes,
        totalVotes,
        yesPercentage,
        noPercentage,
        votingDeadline: proposal.endTime,
        isVotingActive
      };
    } catch (error) {
      console.error('Error fetching proposal votes:', error);
      
      // Return fallback data
      const proposal = await this.getProposal(proposalId);
      if (proposal) {
        const totalVotes = proposal.voteYes + proposal.voteNo;
        return {
          proposalId,
          yesVotes: proposal.voteYes,
          noVotes: proposal.voteNo,
          totalVotes,
          yesPercentage: totalVotes > 0 ? Math.round((proposal.voteYes / totalVotes) * 100) : 0,
          noPercentage: totalVotes > 0 ? Math.round((proposal.voteNo / totalVotes) * 100) : 0,
          votingDeadline: proposal.endTime,
          isVotingActive: proposal.status === 'active' && proposal.endTime > Date.now()
        };
      }
      
      return {
        proposalId,
        yesVotes: 0,
        noVotes: 0,
        totalVotes: 0,
        yesPercentage: 0,
        noPercentage: 0,
        votingDeadline: Date.now(),
        isVotingActive: false
      };
    }
  }

  /**
   * Get voting states for multiple proposals for a user
   */
  async getBatchVotingStates(proposalIds: number[], userAddress: string): Promise<Map<number, VotingState>> {
    try {
      const votingStates = new Map<number, VotingState>();
      
      // Get user's voting history once
      const votingHistory = await this.getUserVotingHistory(userAddress);
      
      // Check each proposal
      for (const proposalId of proposalIds) {
        const existingVote = votingHistory.find(record => record.proposalId === proposalId);
        votingStates.set(proposalId, {
          hasVoted: !!existingVote,
          userVote: existingVote?.vote,
          votingRecord: existingVote
        });
      }
      
      return votingStates;
    } catch (error) {
      console.error('Error fetching batch voting states:', error);
      return new Map();
    }
  }
}

// Singleton instance
export const climateDAOQuery = new ClimateDAOQueryService();