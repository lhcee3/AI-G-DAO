from beaker import Application, GlobalStateValue
from pyteal import *

app = Application("climate_dao")

proposal_count = GlobalStateValue(TealType.uint64, key=Bytes("count"))

@app.external
def submit_proposal(
    title: abi.String,
    description: abi.String,
    requested_amount: abi.Uint64,
    ai_score: abi.Uint64,
    *,
    output: abi.String
) -> Expr:
    i = proposal_count.get()
    box_name = Itob(i)

    proposal_json = Concat(
        Bytes("{\"title\":\""), title.get(),
        Bytes("\",\"description\":\""), description.get(),
        Bytes("\",\"requested_amount\":"), Itob(requested_amount.get()),
        Bytes(",\"ai_score\":"), Itob(ai_score.get()),
        Bytes(",\"votes_yes\":0,\"votes_no\":0,\"finalized\":false}")
    )

    return Seq(
        App.box_create(box_name, Int(512)),
        App.box_put(box_name, proposal_json),
        proposal_count.set(i + Int(1)),
        output.set("Proposal submitted")
    )


@app.external
def vote(
    proposal_id: abi.Uint64,
    choice: abi.Uint64,  # 1 = yes, 0 = no
    *,
    output: abi.String
) -> Expr:
    box_name = Itob(proposal_id.get())
    proposal = App.box_get(box_name)

    return Seq(
        Assert(proposal.hasValue(), comment="Proposal not found"),
        # Parse and replace vote counts manually — real JSON parsing isn't available
        # This is a simplified placeholder, not a real vote counter
        App.box_put(box_name, proposal.value()),  # In real impl, you'd update string
        output.set("Vote registered (placeholder)")
    )


@app.external
def finalize_proposal(
    proposal_id: abi.Uint64,
    *,
    output: abi.String
) -> Expr:
    box_name = Itob(proposal_id.get())
    proposal = App.box_get(box_name)

    return Seq(
        Assert(proposal.hasValue(), comment="Proposal not found"),
        # Simulate finalization by replacing proposal box data
        App.box_put(box_name, proposal.value()),  # In real impl, you'd mark finalized = true
        output.set("Proposal finalized (placeholder)")
    )
