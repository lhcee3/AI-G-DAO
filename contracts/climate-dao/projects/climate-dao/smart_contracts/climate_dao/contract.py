"""
This file contains three contracts:
 - ClimateDAO: token creation and membership
 - ImpactAnalytics: project impact tracking
 - VotingSystem: fully struct-based voting logic (ProposalData, VoteData, VoterRecord)

Notes:
 - BoxMap that stores structs uses `BoxMap(UInt64, Bytes, key_prefix=...)` and stores the struct's `.bytes`.
 - Member token balances are stored in `BoxMap(Bytes, Bytes)` where the key is the account bytes and the value is the arc4.UInt64 `.bytes`.
 - This is written to be compatible with the ARC-4 patterns shown in your environment (use `.bytes` and `Class.from_bytes`).
"""

from algopy import ARC4Contract, BoxMap, Global, Txn, UInt64, gtxn, itxn, String, Bytes, LocalState, Asset, Account, op
import algopy.arc4 as arc4
import algopy

# -----------------------------
# ARC4 Structs
# -----------------------------
class ProposalData(arc4.Struct):
    title: arc4.String
    description: arc4.String
    funding: arc4.UInt64
    proposer: arc4.Address
    creation_time: arc4.UInt64
    end_time: arc4.UInt64
    status: arc4.UInt64  # 0=pending,1=approved,2=rejected,3=no_quorum

class VoteData(arc4.Struct):
    yes_votes: arc4.UInt64
    no_votes: arc4.UInt64
    abstain_votes: arc4.UInt64
    total_voters: arc4.UInt64
    total_voting_power: arc4.UInt64

class VoterRecord(arc4.Struct):
    voter: arc4.Address
    choice: arc4.UInt64  # 0 abstain,1 yes,2 no
    voting_power: arc4.UInt64
    timestamp: arc4.UInt64

# -----------------------------
# Helper encoders for primitive arc4.UInt64 stored in BoxMap(Bytes, Bytes)
# -----------------------------
@algopy.subroutine
def u64_to_bytes(v: arc4.UInt64) -> Bytes:
    return v.bytes

@algopy.subroutine
def bytes_to_u64(b: Bytes) -> arc4.UInt64:
    return arc4.UInt64.from_bytes(b)


# -----------------------------
# ClimateDAO: token creation + membership
# -----------------------------
class ClimateDAO(ARC4Contract):
    def __init__(self) -> None:
        # store token ids as primitive UInt64 values encoded as bytes when needed
        # token ids are kept as plain python int in this contract for simplicity
        self.dao_token_id = UInt64(0)
        self.credit_token_id = UInt64(0)
        self.dao_token = Asset()
        self.credit_token = Asset()

        # member balances stored in BoxMap<Bytes, Bytes> -- key = account bytes, value = arc4.UInt64.bytes
        self.member_tokens = BoxMap(Bytes, Bytes, key_prefix=b"member_")

        # simple counters
        self.total_members = UInt64(0)
        self.user_proposals_count = LocalState(UInt64, key=b"user_proposals")
        self.user_votes_count = LocalState(UInt64, key=b"user_votes")

        # admin
        self.admin = Global.creator_address

    @arc4.abimethod()
    def create_dao_tokens(self, pay: gtxn.PaymentTransaction) -> None:
        assert pay.receiver == Global.current_application_address
        assert pay.amount >= 2_000_000, "need >=2 ALGO to create tokens"
        assert Txn.sender == Global.creator_address, "only creator"

        dao = itxn.AssetConfig(
            total=1_000_000_000,
            decimals=6,
            unit_name="CDAO",
            asset_name="ClimateDAO Token",
            manager=Global.current_application_address,
            reserve=Global.current_application_address,
            freeze=Global.current_application_address,
            clawback=Global.current_application_address
        ).submit()

        credit = itxn.AssetConfig(
            total=10_000_000_000,
            decimals=2,
            unit_name="CCC",
            asset_name="ClimateCredit",
            manager=Global.current_application_address,
            reserve=Global.current_application_address,
            freeze=Global.current_application_address,
            clawback=Global.current_application_address
        ).submit()

        # store asset ids as UInt64
        self.dao_token_id = dao.created_asset.id
        self.credit_token_id = credit.created_asset.id
        self.dao_token = dao.created_asset
        self.credit_token = credit.created_asset

    @arc4.abimethod()
    def join_dao(self, pay: gtxn.PaymentTransaction) -> arc4.UInt64:
        assert pay.receiver == Global.current_application_address
        assert pay.amount >= 1_000_000, "min 1 ALGO"
        assert self.dao_token_id != 0, "dao token not created"

        key = pay.sender.bytes
        cur_bytes, exists = self.member_tokens.maybe(key)

        if not exists:
            initial = arc4.UInt64(1000 * 1_000_000)

            # transfer governance tokens from app reserve to user (inner txn)
            itxn.AssetTransfer(
                asset_receiver=pay.sender,
                xfer_asset=self.dao_token_id,
                asset_amount=initial.native,
                fee=0
            ).submit()

            # store balance as bytes
            self.member_tokens[key] = initial.bytes
            self.total_members = self.total_members + UInt64(1)
            return initial
        else:
            # existing member -> bonus proportional to ALGO paid
            bonus = arc4.UInt64(pay.amount)
            itxn.AssetTransfer(
                asset_receiver=pay.sender,
                xfer_asset=self.dao_token_id,
                asset_amount=bonus.native,
                fee=0
            ).submit()

            prev = arc4.UInt64.from_bytes(cur_bytes)
            new_bal = arc4.UInt64(prev.native + bonus.native)
            self.member_tokens[key] = new_bal.bytes
            return new_bal

    @arc4.abimethod(readonly=True)
    def get_member_tokens(self, member: arc4.Address) -> arc4.UInt64:
        b, ok = self.member_tokens.maybe(member.bytes)
        return arc4.UInt64.from_bytes(b) if ok else arc4.UInt64(0)


# -----------------------------
# ImpactAnalytics (kept simple)
# -----------------------------
class ImpactAnalytics(ARC4Contract):
    def __init__(self) -> None:
        self.total_projects = UInt64(0)
        self.total_co2_saved = UInt64(0)
        self.total_trees_planted = UInt64(0)
        self.total_renewable_energy = UInt64(0)

        self.projects = BoxMap(UInt64, Bytes, key_prefix=b"project_")
        self.project_impacts = BoxMap(UInt64, Bytes, key_prefix=b"impact_")
        self.project_creators = BoxMap(Bytes, UInt64, key_prefix=b"creator_")
        self.ai_scores = BoxMap(UInt64, UInt64, key_prefix=b"ai_")


    @arc4.abimethod()
    def register_project(self, project_name: arc4.String, project_type: arc4.String, expected_co2: arc4.UInt64, expected_trees: arc4.UInt64, expected_energy: arc4.UInt64, location: arc4.String) -> arc4.UInt64:
        pid = self.total_projects + UInt64(1)

        # store minimal info as bytes (concatenate) — simple pattern
        raw = project_name.bytes + b"|" + project_type.bytes + b"|" + location.bytes + b"|" + Txn.sender.bytes
        self.projects[pid] = raw

        impact_raw = expected_co2.bytes + b"|" + expected_trees.bytes + b"|" + expected_energy.bytes
        self.project_impacts[pid] = impact_raw

        self.project_creators[Txn.sender.bytes] = pid

        # simple ai score
        ai = self._calculate_ai_score(expected_co2.as_uint64(), expected_trees.as_uint64(), expected_energy.as_uint64())
        self.ai_scores[pid] = ai

        self.total_projects = pid
        return arc4.UInt64(pid)
    
    @arc4.abimethod()
    def _calculate_ai_score(self, co2: UInt64, trees: UInt64, energy: UInt64) -> UInt64:
        co2_score = (co2 * 40) // 100
        tree_score = (trees * 30) // 1000
        energy_score = (energy * 30) // 100
        total = co2_score + tree_score + energy_score
        max_score = UInt64(1000)
        return total if total <= max_score else max_score
