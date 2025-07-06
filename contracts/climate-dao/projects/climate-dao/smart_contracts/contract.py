from beaker import Application, GlobalStateValue
from pyteal import *

app = Application("climate_dao")

# Global: number of proposals
proposal_count = GlobalStateValue(TealType.uint64, key=Bytes("count"))

# Constants for byte layout
OFFSET_REQUESTED = Int(0)
OFFSET_SCORE     = Int(8)
OFFSET_YES       = Int(16)
OFFSET_NO        = Int(24)
OFFSET_FINALIZED = Int(32)

@app.external
def submit_proposal(
    requested_amount: abi.Uint64,
    ai_score: abi.Uint64,
    *,
    output: abi.String
) -> Expr:
    i = proposal_count.get()
    box_name = Itob(i)

    return Seq(
        App.box_create(box_name, Int(64)),
        App.box_put(
            box_name,
            Concat(
                Itob(requested_amount.get()),
                Itob(ai_score.get()),
                Itob(Int(0)),  # votes_yes
                Itob(Int(0)),  # votes_no
                Itob(Int(0))   # finalized
            )
        ),
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
    data = App.box_get(box_name)

    yes = Btoi(Extract(data.value(), OFFSET_YES, Int(8)))
    no  = Btoi(Extract(data.value(), OFFSET_NO, Int(8)))
    finalized = Btoi(Extract(data.value(), OFFSET_FINALIZED, Int(8)))

    return Seq(
        Assert(data.hasValue()),
        Assert(finalized == Int(0), comment="Proposal already finalized"),
        If(choice.get() == Int(1)).Then(
            yes := yes + Int(1)
        ).Else(
            no := no + Int(1)
        ),
        App.box_put(
            box_name,
            Concat(
                Extract(data.value(), OFFSET_REQUESTED, Int(16)),  # amount + score
                Itob(yes),
                Itob(no),
                Itob(Int(0))  # finalized remains 0
            )
        ),
        output.set("Vote cast")
    )

@app.external
def finalize_proposal(
    proposal_id: abi.Uint64,
    *,
    output: abi.String
) -> Expr:
    box_name = Itob(proposal_id.get())
    data = App.box_get(box_name)

    yes = Btoi(Extract(data.value(), OFFSET_YES, Int(8)))
    no  = Btoi(Extract(data.value(), OFFSET_NO, Int(8)))
    finalized = Btoi(Extract(data.value(), OFFSET_FINALIZED, Int(8)))

    return Seq(
        Assert(data.hasValue()),
        Assert(finalized == Int(0), comment="Already finalized"),
        App.box_put(
            box_name,
            Concat(
                Extract(data.value(), OFFSET_REQUESTED, Int(32)),
                Itob(Int(1))  # set finalized flag
            )
        ),
        output.set("Proposal finalized")
    )

@app.external
def get_stats(
    proposal_id: abi.Uint64,
    *,
    output: abi.String
) -> Expr:
    box_name = Itob(proposal_id.get())
    data = App.box_get(box_name)

    return Seq(
        Assert(data.hasValue()),
        output.set(
            Concat(
                Bytes("Votes Yes: "), Itob(Btoi(Extract(data.value(), OFFSET_YES, Int(8)))), Bytes(", "),
                Bytes("Votes No: "), Itob(Btoi(Extract(data.value(), OFFSET_NO, Int(8)))), Bytes(", "),
                Bytes("Finalized: "), Itob(Btoi(Extract(data.value(), OFFSET_FINALIZED, Int(8))))
            )
        )
    )