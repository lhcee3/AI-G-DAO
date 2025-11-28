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
