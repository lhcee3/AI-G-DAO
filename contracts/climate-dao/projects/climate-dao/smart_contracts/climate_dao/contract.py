from pyteal import *

OFFSET_REQUESTED = Int(0)
OFFSET_SCORE     = Int(8)
OFFSET_YES       = Int(16)
OFFSET_NO        = Int(24)
OFFSET_FINALIZED = Int(32)

def approval_program():
    proposal_count = App.globalGetEx(Int(0), Bytes("count"))

    on_create = Seq(
        App.globalPut(Bytes("count"), Int(0)),
        Approve()
    )

    submit_proposal = Seq(
        (i := ScratchVar()).store(App.globalGet(Bytes("count"))),
        # Fix: Store the result of box_create or use Pop() to discard it
        Pop(App.box_create(Itob(i.load()), Int(64))),
        App.box_put(
            Itob(i.load()),
            Concat(
                Extract(Txn.application_args[1], Int(0), Int(8)), # amount
                Extract(Txn.application_args[2], Int(0), Int(8)), # score
                Itob(Int(0)),
                Itob(Int(0)),
                Itob(Int(0))
            )
        ),
        App.globalPut(Bytes("count"), i.load() + Int(1)),
        Approve()
    )

    vote = Seq(
        (pid := Btoi(Txn.application_args[1])),
        (choice := Btoi(Txn.application_args[2])),
        (data := App.box_get(Itob(pid))),
        Assert(data.hasValue()),
        (yes := ScratchVar()).store(Btoi(Extract(data.value(), OFFSET_YES, Int(8)))),
        (no := ScratchVar()).store(Btoi(Extract(data.value(), OFFSET_NO, Int(8)))),
        (finalized := Btoi(Extract(data.value(), OFFSET_FINALIZED, Int(8)))),
        Assert(finalized == Int(0)),
        If(choice == Int(1))
            .Then(yes.store(yes.load() + Int(1)))
            .Else(no.store(no.load() + Int(1))),
        App.box_put(
            Itob(pid),
            Concat(
                Extract(data.value(), OFFSET_REQUESTED, Int(16)),
                Itob(yes.load()),
                Itob(no.load()),
                Itob(Int(0))
            )
        ),
        Approve()
    )

    finalize = Seq(
        (pid := Btoi(Txn.application_args[1])),
        (data := App.box_get(Itob(pid))),
        Assert(data.hasValue()),
        (finalized := Btoi(Extract(data.value(), OFFSET_FINALIZED, Int(8)))),
        Assert(finalized == Int(0)),
        App.box_put(
            Itob(pid),
            Concat(
                Extract(data.value(), OFFSET_REQUESTED, Int(32)),
                Itob(Int(1))
            )
        ),
        Approve()
    )

    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.application_args[0] == Bytes("submit_proposal"), submit_proposal],
        [Txn.application_args[0] == Bytes("vote"), vote],
        [Txn.application_args[0] == Bytes("finalize_proposal"), finalize],
    )

    return program

def clear_program():
    return Approve()