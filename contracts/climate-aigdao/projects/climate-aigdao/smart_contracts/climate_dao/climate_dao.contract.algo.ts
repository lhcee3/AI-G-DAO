import {
  Application,
  GlobalState,
  BoxState,
  Method,
  abi,
  Runtime,
  AccountAddress,
  UInt64,
  String,
} from "@algorandfoundation/algokit-utils/types";

type Proposal = {
  id: number;
  title: string;
  description: string;
  requestedAmount: bigint;
  aiScore: number;
  votesYes: number;
  votesNo: number;
};

export class ClimateDAO extends Application {
  constructor() {
    super("climate_dao");
  }

  @GlobalState(UInt64)
  proposalCount = 0;

  @BoxState(abi.Uint64, abi.String) // Box stores proposals (id, serialized JSON)
  proposals!: Map<number, string>;

  @Method
  submitProposal = (
    id: UInt64,
    title: String,
    description: String,
    requestedAmount: UInt64,
    aiScore: UInt64
  ) => {
    this.proposals.set(id, JSON.stringify({
      id,
      title,
      description,
      requestedAmount,
      aiScore,
      votesYes: 0,
      votesNo: 0,
    }));

    this.proposalCount = id + 1n;
  };

  @Method
  vote = (id: UInt64, choice: UInt64) => {
    const proposalJson = this.proposals.get(id);
    if (!proposalJson) return;

    const proposal: Proposal = JSON.parse(proposalJson);
    if (choice === 1n) {
      proposal.votesYes += 1;
    } else {
      proposal.votesNo += 1;
    }

    this.proposals.set(id, JSON.stringify(proposal));
  };

  @Method
  finalizeProposal = (id: UInt64) => {
    const proposalJson = this.proposals.get(id);
    if (!proposalJson) return;

    const proposal: Proposal = JSON.parse(proposalJson);
    if (proposal.votesYes > proposal.votesNo) {
      // ✅ Proposal approved: execute reward logic here (e.g. ASA transfer)
    } else {
      // ❌ Rejected: do nothing
    }
  };
}
