from algopy import (
    Account, ARC4Contract, BoxMap, Global, Txn, UInt64, gtxn, itxn,
    String, Box, GlobalState, LocalState, Asset, Bytes, arc4
)
from algopy.arc4 import abimethod, UInt64 as ARC4UInt64, String as ARC4String, Bool as ARC4Bool, Struct

# ── Structs for Voting System ──
class ProposalData(Struct):
    title: String
    description: String  
    proposal_type: String
    funding_requested: UInt64
    execution_delay: UInt64
    proposer: Account
    creation_time: UInt64
    end_time: UInt64
    status: UInt64

class VoteData(Struct):
    yes_votes: UInt64
    no_votes: UInt64
    abstain_votes: UInt64
    total_voters: UInt64
    total_voting_power_used: UInt64

class VoterRecord(Struct):
    voter: Account
    vote_choice: UInt64
    voting_power_used: UInt64
    timestamp: UInt64

# ── CONTRACT: Core Climate DAO ──
class ClimateDAO(ARC4Contract):
     """Core Climate DAO contract for governance and climate credits"""
    
    def __init__(self) -> None:
        """Initialize the Climate DAO contract"""
        # DAO tokens and governance
        self.dao_token = Asset(0)  # Climate DAO governance token
        self.credit_token = Asset(0)  # Climate credits token
        
        # Global state
        self.total_proposals = UInt64(0)
        self.total_members = UInt64(0)
        self.voting_period = UInt64(604800)  # 7 days in seconds
        
        # Storage maps
        self.proposals = BoxMap(UInt64, Bytes, key_prefix="prop_")
        self.member_tokens = BoxMap(Account, UInt64, key_prefix="member_")
        self.proposal_votes = BoxMap(UInt64, Bytes, key_prefix="votes_")
        self.member_voted = BoxMap(Account, Bytes, key_prefix="voted_")
        
        # Local state for tracking user interactions
        self.user_proposals_count = LocalState(UInt64, key="user_proposals")
        self.user_votes_count = LocalState(UInt64, key="user_votes")

    @abimethod()
    def create_dao_tokens(self, pay_txn: gtxn.PaymentTransaction) -> None:
        """Create DAO governance token and climate credits token"""
        assert pay_txn.receiver == Global.current_application_address
        assert pay_txn.amount >= 2_000_000, "Need at least 2 ALGO for token creation"
        assert Txn.sender == Global.creator_address, "Only creator can initialize tokens"
        assert not self.dao_token, "DAO tokens already created"
        
        # Create DAO governance token
        dao_token_creation = itxn.AssetConfig(
            total=1_000_000_000,  # 1 billion tokens
            decimals=6,
            unit_name="CDAO",
            asset_name="Climate DAO Token",
            manager=Global.current_application_address,
            reserve=Global.current_application_address,
            freeze=Global.current_application_address,
            clawback=Global.current_application_address,
            fee=0
        ).submit()
        
        # Create climate credits token
        credit_token_creation = itxn.AssetConfig(
            total=10_000_000_000,  # 10 billion credits
            decimals=2,
            unit_name="CCC",
            asset_name="Climate Credit Coin",
            manager=Global.current_application_address,
            reserve=Global.current_application_address,
            freeze=Global.current_application_address,
            clawback=Global.current_application_address,
            fee=0
        ).submit()
        
        self.dao_token = dao_token_creation.created_asset
        self.credit_token = credit_token_creation.created_asset

    @abimethod()
    def join_dao(self, pay_txn: gtxn.PaymentTransaction) -> UInt64:
        """Join the DAO by paying membership fee and receive governance tokens"""
        assert pay_txn.receiver == Global.current_application_address
        assert pay_txn.amount >= 1_000_000, "Minimum 1 ALGO membership fee required"
        
        current_tokens, is_member = self.member_tokens.maybe(pay_txn.sender)
        
        if not is_member:
            # New member - give initial governance tokens
            initial_tokens = UInt64(1000 * 1_000_000)  # 1000 tokens with 6 decimals
            
            itxn.AssetTransfer(
                asset_receiver=pay_txn.sender,
                xfer_asset=self.dao_token,
                asset_amount=initial_tokens,
                fee=0
            ).submit()
            
            self.member_tokens[pay_txn.sender] = initial_tokens
            self.total_members += UInt64(1)
            
            return initial_tokens
        else:
            # Existing member - add bonus tokens based on contribution
            bonus_tokens = pay_txn.amount  # 1:1 ratio for simplicity
            
            itxn.AssetTransfer(
                asset_receiver=pay_txn.sender,
                xfer_asset=self.dao_token,
                asset_amount=bonus_tokens,
                fee=0
            ).submit()
            
            self.member_tokens[pay_txn.sender] = current_tokens + bonus_tokens
            
            return self.member_tokens[pay_txn.sender]

    @abimethod()
    def submit_proposal(
        self, 
        title: ARC4String,
        description: ARC4String,
        funding_amount: ARC4UInt64,
        impact_score: ARC4UInt64
    ) -> UInt64:
        """Submit a new climate project proposal"""
        member_tokens, is_member = self.member_tokens.maybe(Txn.sender)
        assert is_member, "Only DAO members can submit proposals"
        assert member_tokens >= UInt64(100 * 1_000_000), "Need at least 100 tokens to submit proposal"
        
        proposal_id = self.total_proposals + UInt64(1)
        
        # Create proposal data structure (simplified as bytes for now)
        proposal_data = arc4.encode(
            (title, description, funding_amount, impact_score, 
             Txn.sender, Global.latest_timestamp, UInt64(0), UInt64(0))  # yes_votes, no_votes
        )
        
        self.proposals[proposal_id] = proposal_data
        self.total_proposals = proposal_id
        
        # Track user's proposal count
        user_count = self.user_proposals_count.get(Txn.sender, UInt64(0))
        self.user_proposals_count[Txn.sender] = user_count + UInt64(1)
        
        return proposal_id

    @abimethod()
    def vote_on_proposal(self, proposal_id: ARC4UInt64, vote: ARC4Bool) -> None:
        """Vote on a proposal (True = Yes, False = No)"""
        member_tokens, is_member = self.member_tokens.maybe(Txn.sender)
        assert is_member, "Only DAO members can vote"
        assert member_tokens > UInt64(0), "Need tokens to vote"
        
        proposal_data, proposal_exists = self.proposals.maybe(proposal_id.native)
        assert proposal_exists, "Proposal does not exist"
        
        # Check if user already voted (simplified check)
        user_votes_key = Txn.sender.bytes + proposal_id.bytes
        _, already_voted = self.member_voted.maybe(Txn.sender)
        
        if already_voted:
            # Check if they voted on this specific proposal
            # This is a simplified implementation
            pass
        
        # Record the vote
        self.member_voted[Txn.sender] = user_votes_key
        
        # Track user's vote count
        user_vote_count = self.user_votes_count.get(Txn.sender, UInt64(0))
        self.user_votes_count[Txn.sender] = user_vote_count + UInt64(1)

    @abimethod()
    def execute_proposal(self, proposal_id: ARC4UInt64) -> None:
        """Execute an approved proposal and distribute climate credits"""
        assert Txn.sender == Global.creator_address, "Only admin can execute proposals"
        
        proposal_data, proposal_exists = self.proposals.maybe(proposal_id.native)
        assert proposal_exists, "Proposal does not exist"
        
        # Simplified execution - in real implementation, check voting results
        # Award climate credits to project proposer
        credit_amount = UInt64(1000 * 100)  # 1000 credits with 2 decimals
        
        # This would be determined from the proposal data
        # For now, using a placeholder recipient
        recipient = Global.creator_address
        
        itxn.AssetTransfer(
            asset_receiver=recipient,
            xfer_asset=self.credit_token,
            asset_amount=credit_amount,
            fee=0
        ).submit()

    @abimethod(readonly=True)
    def get_dao_token_id(self) -> UInt64:
        """Get the DAO governance token ID"""
        return self.dao_token.id

    @abimethod(readonly=True)
    def get_credit_token_id(self) -> UInt64:
        """Get the climate credits token ID"""
        return self.credit_token.id

    @abimethod(readonly=True)
    def get_member_tokens(self, member: Account) -> UInt64:
        """Get token balance for a member"""
        tokens, is_member = self.member_tokens.maybe(member)
        return tokens if is_member else UInt64(0)

    @abimethod(readonly=True)
    def get_total_proposals(self) -> UInt64:
        """Get total number of proposals"""
        return self.total_proposals

    @abimethod(readonly=True)
    def get_total_members(self) -> UInt64:
        """Get total number of DAO members"""
        return self.total_members

    @abimethod(readonly=True)
    def get_user_proposal_count(self) -> UInt64:
        """Get number of proposals submitted by sender"""
        return self.user_proposals_count.get(Txn.sender, UInt64(0))

    @abimethod(readonly=True)
    def get_user_vote_count(self) -> UInt64:
        """Get number of votes cast by sender"""
        return self.user_votes_count.get(Txn.sender, UInt64(0))

    @abimethod(allow_actions=['OptIn'])
    def opt_in(self) -> String:
        """Opt into the DAO contract"""
        return String("Welcome to Climate DAO!")

    @abimethod(allow_actions=['CloseOut'])
    def opt_out(self) -> None:
        """Opt out of the DAO contract"""
        pass


# ── CONTRACT: Impact Analytics ──
class ImpactAnalytics(ARC4Contract):
       """Contract for tracking and analyzing environmental impact of climate projects"""
    
    def __init__(self) -> None:
        """Initialize the Impact Analytics contract"""
        # Global counters
        self.total_projects = UInt64(0)
        self.total_co2_saved = UInt64(0)  # In tons * 100 (2 decimal precision)
        self.total_trees_planted = UInt64(0)
        self.total_renewable_energy = UInt64(0)  # In MWh * 100
        
        # Project tracking
        self.projects = BoxMap(UInt64, Bytes, key_prefix="project_")
        self.project_impacts = BoxMap(UInt64, Bytes, key_prefix="impact_")
        self.project_creators = BoxMap(Account, UInt64, key_prefix="creator_")
        
        # AI Impact scoring (simplified)
        self.ai_scores = BoxMap(UInt64, UInt64, key_prefix="ai_score_")
        
        # Local state for users
        self.user_total_impact = LocalState(UInt64, key="user_impact")
        self.user_projects_created = LocalState(UInt64, key="user_projects")

    @abimethod()
    def register_project(
        self,
        project_name: ARC4String,
        project_type: ARC4String,  # "solar", "reforestation", "wind", "carbon_capture"
        expected_co2_reduction: ARC4UInt64,  # tons * 100
        expected_trees: ARC4UInt64,
        expected_energy: ARC4UInt64,  # MWh * 100
        location: ARC4String
    ) -> UInt64:
        """Register a new climate project for impact tracking"""
        
        project_id = self.total_projects + UInt64(1)
        
        # Store project basic info
        project_data = Bytes(
            project_name.bytes + 
            project_type.bytes + 
            location.bytes +
            Txn.sender.bytes
        )
        
        # Store expected impacts
        impact_data = Bytes(
            expected_co2_reduction.bytes +
            expected_trees.bytes +
            expected_energy.bytes
        )
        
        self.projects[project_id] = project_data
        self.project_impacts[project_id] = impact_data
        self.project_creators[Txn.sender] = project_id
        
        # Calculate AI impact score (simplified algorithm)
        ai_score = self._calculate_ai_score(
            expected_co2_reduction.native,
            expected_trees.native,
            expected_energy.native
        )
        self.ai_scores[project_id] = ai_score
        
        self.total_projects = project_id
        
        # Update user stats
        user_projects = self.user_projects_created.get(Txn.sender, UInt64(0))
        self.user_projects_created[Txn.sender] = user_projects + UInt64(1)
        
        return project_id

    @abimethod()
    def update_actual_impact(
        self,
        project_id: ARC4UInt64,
        actual_co2_saved: ARC4UInt64,
        actual_trees_planted: ARC4UInt64,
        actual_energy_generated: ARC4UInt64
    ) -> None:
        """Update the actual impact achieved by a project"""
        
        project_data, project_exists = self.projects.maybe(project_id.native)
        assert project_exists, "Project does not exist"
        
        # Verify sender is project creator or admin
        creator_project, is_creator = self.project_creators.maybe(Txn.sender)
        is_admin = Txn.sender == Global.creator_address
        
        assert is_creator or is_admin, "Only project creator or admin can update impact"
        
        if is_creator:
            assert creator_project == project_id.native, "Not your project"
        
        # Update global totals
        self.total_co2_saved += actual_co2_saved.native
        self.total_trees_planted += actual_trees_planted.native
        self.total_renewable_energy += actual_energy_generated.native
        
        # Update user impact score
        total_user_impact = (
            actual_co2_saved.native * UInt64(10) +  # CO2 weighted 10x
            actual_trees_planted.native +
            actual_energy_generated.native * UInt64(5)  # Energy weighted 5x
        )
        
        current_impact = self.user_total_impact.get(Txn.sender, UInt64(0))
        self.user_total_impact[Txn.sender] = current_impact + total_user_impact
        
        # Recalculate AI score based on actual performance
        new_ai_score = self._calculate_ai_score(
            actual_co2_saved.native,
            actual_trees_planted.native,
            actual_energy_generated.native
        )
        self.ai_scores[project_id.native] = new_ai_score

    def _calculate_ai_score(
        self, 
        co2_reduction: UInt64, 
        trees: UInt64, 
        energy: UInt64
    ) -> UInt64:
        """Calculate AI impact score (simplified algorithm)"""
        # Weighted scoring algorithm
        # CO2 reduction: 40% weight
        # Tree planting: 30% weight  
        # Renewable energy: 30% weight
        
        co2_score = (co2_reduction * UInt64(40)) // UInt64(100)
        tree_score = (trees * UInt64(30)) // UInt64(1000)  # Adjusted for scale
        energy_score = (energy * UInt64(30)) // UInt64(100)
        
        total_score = co2_score + tree_score + energy_score
        
        # Cap at 1000 (10.00 on display)
        return total_score if total_score <= UInt64(1000) else UInt64(1000)

    @abimethod()
    def award_impact_credits(self, project_id: ARC4UInt64, credit_amount: ARC4UInt64) -> None:
        """Award climate credits based on verified impact (admin only)"""
        assert Txn.sender == Global.creator_address, "Only admin can award credits"
        
        project_data, project_exists = self.projects.maybe(project_id.native)
        assert project_exists, "Project does not exist"
        
        # In a real implementation, this would integrate with the main DAO contract
        # to mint and transfer credits to the project creator

    @abimethod(readonly=True)
    def get_project_ai_score(self, project_id: ARC4UInt64) -> UInt64:
        """Get AI impact score for a project"""
        score, exists = self.ai_scores.maybe(project_id.native)
        return score if exists else UInt64(0)

    @abimethod(readonly=True)
    def get_global_impact_stats(self) -> tuple[UInt64, UInt64, UInt64, UInt64]:
        """Get global environmental impact statistics"""
        return (
            self.total_projects,
            self.total_co2_saved,
            self.total_trees_planted, 
            self.total_renewable_energy
        )

    @abimethod(readonly=True)
    def get_user_impact_score(self) -> UInt64:
        """Get sender's total impact score"""
        return self.user_total_impact.get(Txn.sender, UInt64(0))

    @abimethod(readonly=True)
    def get_user_projects_count(self) -> UInt64:
        """Get number of projects created by sender"""
        return self.user_projects_created.get(Txn.sender, UInt64(0))

    @abimethod(readonly=True)
    def get_total_projects(self) -> UInt64:
        """Get total number of registered projects"""
        return self.total_projects

    @abimethod(allow_actions=['OptIn'])
    def opt_in(self) -> String:
        """Opt into the Impact Analytics contract"""
        return String("Tracking your environmental impact!")

    @abimethod(allow_actions=['CloseOut']) 
    def opt_out(self) -> None:
        """Opt out of the Impact Analytics contract"""
        pass


# ── CONTRACT: Voting System ──
class VotingSystem(ARC4Contract):
       """Contract for tracking and analyzing environmental impact of climate projects"""
    
    def __init__(self) -> None:
        """Initialize the Impact Analytics contract"""
        # Global counters
        self.total_projects = UInt64(0)
        self.total_co2_saved = UInt64(0)  # In tons * 100 (2 decimal precision)
        self.total_trees_planted = UInt64(0)
        self.total_renewable_energy = UInt64(0)  # In MWh * 100
        
        # Project tracking
        self.projects = BoxMap(UInt64, Bytes, key_prefix="project_")
        self.project_impacts = BoxMap(UInt64, Bytes, key_prefix="impact_")
        self.project_creators = BoxMap(Account, UInt64, key_prefix="creator_")
        
        # AI Impact scoring (simplified)
        self.ai_scores = BoxMap(UInt64, UInt64, key_prefix="ai_score_")
        
        # Local state for users
        self.user_total_impact = LocalState(UInt64, key="user_impact")
        self.user_projects_created = LocalState(UInt64, key="user_projects")

    @abimethod()
    def register_project(
        self,
        project_name: ARC4String,
        project_type: ARC4String,  # "solar", "reforestation", "wind", "carbon_capture"
        expected_co2_reduction: ARC4UInt64,  # tons * 100
        expected_trees: ARC4UInt64,
        expected_energy: ARC4UInt64,  # MWh * 100
        location: ARC4String
    ) -> UInt64:
        """Register a new climate project for impact tracking"""
        
        project_id = self.total_projects + UInt64(1)
        
        # Store project basic info
        project_data = Bytes(
            project_name.bytes + 
            project_type.bytes + 
            location.bytes +
            Txn.sender.bytes
        )
        
        # Store expected impacts
        impact_data = Bytes(
            expected_co2_reduction.bytes +
            expected_trees.bytes +
            expected_energy.bytes
        )
        
        self.projects[project_id] = project_data
        self.project_impacts[project_id] = impact_data
        self.project_creators[Txn.sender] = project_id
        
        # Calculate AI impact score (simplified algorithm)
        ai_score = self._calculate_ai_score(
            expected_co2_reduction.native,
            expected_trees.native,
            expected_energy.native
        )
        self.ai_scores[project_id] = ai_score
        
        self.total_projects = project_id
        
        # Update user stats
        user_projects = self.user_projects_created.get(Txn.sender, UInt64(0))
        self.user_projects_created[Txn.sender] = user_projects + UInt64(1)
        
        return project_id

    @abimethod()
    def update_actual_impact(
        self,
        project_id: ARC4UInt64,
        actual_co2_saved: ARC4UInt64,
        actual_trees_planted: ARC4UInt64,
        actual_energy_generated: ARC4UInt64
    ) -> None:
        """Update the actual impact achieved by a project"""
        
        project_data, project_exists = self.projects.maybe(project_id.native)
        assert project_exists, "Project does not exist"
        
        # Verify sender is project creator or admin
        creator_project, is_creator = self.project_creators.maybe(Txn.sender)
        is_admin = Txn.sender == Global.creator_address
        
        assert is_creator or is_admin, "Only project creator or admin can update impact"
        
        if is_creator:
            assert creator_project == project_id.native, "Not your project"
        
        # Update global totals
        self.total_co2_saved += actual_co2_saved.native
        self.total_trees_planted += actual_trees_planted.native
        self.total_renewable_energy += actual_energy_generated.native
        
        # Update user impact score
        total_user_impact = (
            actual_co2_saved.native * UInt64(10) +  # CO2 weighted 10x
            actual_trees_planted.native +
            actual_energy_generated.native * UInt64(5)  # Energy weighted 5x
        )
        
        current_impact = self.user_total_impact.get(Txn.sender, UInt64(0))
        self.user_total_impact[Txn.sender] = current_impact + total_user_impact
        
        # Recalculate AI score based on actual performance
        new_ai_score = self._calculate_ai_score(
            actual_co2_saved.native,
            actual_trees_planted.native,
            actual_energy_generated.native
        )
        self.ai_scores[project_id.native] = new_ai_score

    def _calculate_ai_score(
        self, 
        co2_reduction: UInt64, 
        trees: UInt64, 
        energy: UInt64
    ) -> UInt64:
        """Calculate AI impact score (simplified algorithm)"""
        # Weighted scoring algorithm
        # CO2 reduction: 40% weight
        # Tree planting: 30% weight  
        # Renewable energy: 30% weight
        
        co2_score = (co2_reduction * UInt64(40)) // UInt64(100)
        tree_score = (trees * UInt64(30)) // UInt64(1000)  # Adjusted for scale
        energy_score = (energy * UInt64(30)) // UInt64(100)
        
        total_score = co2_score + tree_score + energy_score
        
        # Cap at 1000 (10.00 on display)
        return total_score if total_score <= UInt64(1000) else UInt64(1000)

    @abimethod()
    def award_impact_credits(self, project_id: ARC4UInt64, credit_amount: ARC4UInt64) -> None:
        """Award climate credits based on verified impact (admin only)"""
        assert Txn.sender == Global.creator_address, "Only admin can award credits"
        
        project_data, project_exists = self.projects.maybe(project_id.native)
        assert project_exists, "Project does not exist"
        
        # In a real implementation, this would integrate with the main DAO contract
        # to mint and transfer credits to the project creator

    @abimethod(readonly=True)
    def get_project_ai_score(self, project_id: ARC4UInt64) -> UInt64:
        """Get AI impact score for a project"""
        score, exists = self.ai_scores.maybe(project_id.native)
        return score if exists else UInt64(0)

    @abimethod(readonly=True)
    def get_global_impact_stats(self) -> tuple[UInt64, UInt64, UInt64, UInt64]:
        """Get global environmental impact statistics"""
        return (
            self.total_projects,
            self.total_co2_saved,
            self.total_trees_planted, 
            self.total_renewable_energy
        )

    @abimethod(readonly=True)
    def get_user_impact_score(self) -> UInt64:
        """Get sender's total impact score"""
        return self.user_total_impact.get(Txn.sender, UInt64(0))

    @abimethod(readonly=True)
    def get_user_projects_count(self) -> UInt64:
        """Get number of projects created by sender"""
        return self.user_projects_created.get(Txn.sender, UInt64(0))

    @abimethod(readonly=True)
    def get_total_projects(self) -> UInt64:
        """Get total number of registered projects"""
        return self.total_projects

    @abimethod(allow_actions=['OptIn'])
    def opt_in(self) -> String:
        """Opt into the Impact Analytics contract"""
        return String("Tracking your environmental impact!")

    @abimethod(allow_actions=['CloseOut']) 
    def opt_out(self) -> None:
        """Opt out of the Impact Analytics contract"""
        pass

