from algorand_python import (
    Application,
    Global,
    Account,
    ABIReturnSubroutine,
    abi,
    ApplicationClient,
    OnCreate,
    OnCall,
)
from algorand_python.stdlib import (
    itxn_create_payment,
    GlobalStateValue,
    LocalStateValue,
)
from algorand_python.types import TealType

app = Application("ClimateDAO")


# ========================
# GLOBAL STATE VARIABLES
# ========================
proposal_count = GlobalStateValue(name="proposal_count", type=abi.Uint64)

# ========================
# DATA STRUCTS
# ========================
class Proposal(abi.NamedTuple):
    id: abi.Field[abi.Uint64]
    title: abi.Field[abi.String]
    description: abi.Field[abi.String]
    proposer: abi.Field[abi.Address]
    impact_score: abi.Field[abi.Uint64]
    yes_votes: abi.Field[abi.Uint64]
    no_votes: abi.Field[abi.Uint64]
    timestamp: abi.Field[abi.Uint64]


# ========================
# LOCAL STATE (PER USER)
# ========================
voted_proposals = LocalStateValue(name="voted_proposals", type=abi.DynamicArray[abi.Uint64])

# ========================
# ON CREATE
# ========================
@app.on_create
def on_create():
    return proposal_count.set(0)


# ========================
# SUBMIT PROPOSAL
# ========================
@app.external
def submit_proposal(
    title: abi.String,
    description: abi.String,
    impact_score: abi.Uint64,
    proposer: abi.Account,
    output: abi.DynamicBytes,
):
    id = proposal_count.get()
    key = f"p_{id}"
    data = Proposal()
    data.set(
        id,
        title,
        description,
        proposer.address(),
        impact_score,
        abi.Uint64(0),
        abi.Uint64(0),
        Global.latest_timestamp()
    )
    app.global_set(key, data.encode())
    proposal_count.increment()
    output.set_bytes(key.encode())


# ========================
# VOTE ON PROPOSAL
# ========================
@app.external
def vote(
    proposal_id: abi.Uint64,
    vote_yes: abi.Bool,
    sender: abi.Account
):
    key = f"p_{proposal_id.get()}"
    proposal_data = app.global_get(key)
    proposal = Proposal()
    proposal.decode(proposal_data)

    # Check if already voted
    already_voted = voted_proposals.contains(proposal_id)
    assert not already_voted, "Already voted on this proposal"

    # Tally the vote
    if vote_yes.get():
        new_yes = proposal.yes_votes.get() + 1
        proposal.yes_votes.set(new_yes)
    else:
        new_no = proposal.no_votes.get() + 1
        proposal.no_votes.set(new_no)

    # Save back
    app.global_set(key, proposal.encode())

    # Update user state
    voted_proposals.append(proposal_id)


# ========================
# GET PROPOSAL
# ========================
@app.external(read_only=True)
def get_proposal(proposal_id: abi.Uint64, output: Proposal):
    key = f"p_{proposal_id.get()}"
    proposal_data = app.global_get(key)
    output.decode(proposal_data)
