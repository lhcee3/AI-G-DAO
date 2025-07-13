
from pyteal import (
    Approve,
    Assert,
    Btoi,
    Bytes,
    Concat,
    Cond,
    Extract,
    ExtractBytes,
    ExtractUint64,
    Expr,
    Global,
    If,
    Int,
    Itob,
    Len,
    Not,
    OnComplete,
    Return,
    ScratchVar,
    Seq,
    Subroutine,
    Substring,
    TealType,
    Txn,
    TxnField,
    TxnType,
    TxnObject,
    TxnGroupIndex,
    TxnApplicationArgs,
    TxnSender,
    TxnOnCompletion,
    TxnApplicationId,
    TxnAccounts,
    TxnForeignApps,
    TxnForeignAssets,
    TxnNote,
    TxnReceiver,
    TxnAmount,
    TxnCloseRemainderTo,
    TxnRekeyTo,
    TxnFee,
    App,
    AppParam,
    AppLocalGet,
    AppGlobalGet,
    AppGlobalPut,
    AppLocalPut,
    AppLocalDel,
    AppGlobalDel,
    AppLocalGetEx,
    AppGlobalGetEx,
    TxnGroupSize,
    GlobalGroupSize,
    Mode,
    compileTeal,
)


def approval_program():
    # ========================
    # GLOBAL STATE VARIABLES
    # ========================
    proposal_count_key = Bytes("proposal_count")

    # ========================
    # LOCAL STATE VARIABLES
    # ========================
    voted_key = Bytes("voted")  # We'll store JSON-style stringified IDs for simplicity

    # ========================
    # SUBROUTINE: Compose proposal key
    # ========================
    @Subroutine(TealType.bytes)
    def proposal_key(proposal_id: Expr) -> Expr:
        return Concat(Bytes("p_"), Itob(proposal_id))   

    # ========================
    # SUBMIT PROPOSAL
    # ========================
    @Subroutine(TealType.none)
    def submit_proposal():
        id = App.globalGet(proposal_count_key)
        key = proposal_key(id)

        title = Txn.application_args[1]
        desc = Txn.application_args[2]
        impact = Txn.application_args[3]
        proposer = Txn.sender()
        timestamp = Global.latest_timestamp()

        data = Concat(
            Itob(id),
            Bytes("|"), title,
            Bytes("|"), desc,
            Bytes("|"), proposer,
            Bytes("|"), impact,
            Bytes("|"), Itob(Int(0)),  # yes
            Bytes("|"), Itob(Int(0)),  # no
            Bytes("|"), Itob(timestamp)
        )

        return Seq([
            App.globalPut(key, data),
            App.globalPut(proposal_count_key, id + Int(1)),
            Approve()
        ])

    # ========================
    # VOTE
    # ========================
    @Subroutine(TealType.none)
    def vote():
        pid = Btoi(Txn.application_args[1])
        vote_yes = Txn.application_args[2]
        key = proposal_key(pid)
        existing = App.globalGet(key)

        # Decode
        parts = ScratchVar(TealType.bytes)
        yes_votes = ScratchVar(TealType.uint64)
        no_votes = ScratchVar(TealType.uint64)

        # Get previous votes
        yes_votes_val = ExtractUint64(existing, Len(existing) - 16)
        no_votes_val = ExtractUint64(existing, Len(existing) - 8)

        # Check local voted proposals
        voted = App.localGet(Txn.sender(), voted_key)
        has_voted = Substring(voted, Int(0), Int(4096)).find(Itob(pid)) != -1  # crude check

        return Seq([
            Assert(key != Bytes("")),
            Assert(Not(has_voted)),

            yes_votes.store(yes_votes_val),
            no_votes.store(no_votes_val),

            If(vote_yes == Bytes("yes")).Then(
                yes_votes.store(yes_votes.load() + Int(1))
            ).Else(
                no_votes.store(no_votes.load() + Int(1))
            ),

            App.globalPut(
                key,
                Concat(
                    Substring(existing, Int(0), Len(existing) - Int(16)),
                    Itob(yes_votes.load()),
                    Itob(no_votes.load())
                )
            ),

            App.localPut(
                Txn.sender(),
                voted_key,
                Concat(voted, Itob(pid), Bytes(","))
            ),

            Approve()
        ])


    # ========================
    # GET PROPOSAL
    # ========================
    @Subroutine(TealType.bytes)
    def get_proposal():
        pid = Btoi(Txn.application_args[1])
        key = proposal_key(pid)
        return App.globalGet(key)

    # ========================
    # HANDLERS
    # ========================
    on_create = Seq([
        App.globalPut(proposal_count_key, Int(0)),
        Approve()
    ])

    on_opt_in = Seq([
        App.localPut(Txn.sender(), voted_key, Bytes("")),
        Approve()
    ])

    on_call = Cond(
        [Txn.application_args[0] == Bytes("submit_proposal"), submit_proposal()],
        [Txn.application_args[0] == Bytes("vote"), vote()],
        [Txn.application_args[0] == Bytes("get_proposal"), Return(get_proposal())]
    )

    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.on_completion() == OnComplete.OptIn, on_opt_in],
        [Txn.on_completion() == OnComplete.NoOp, on_call],
    )

    return program


def clear_state_program():
    return Approve()