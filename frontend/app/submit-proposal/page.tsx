import { SubmitProposalPage } from "@/components/submit-propsoal"
import { WalletGuard } from "@/components/wallet-guard"
import { WalletLayout } from "@/components/wallet-layout"

export default function SubmitProposal() {
  return (
    <WalletLayout>
      <WalletGuard requireBalance={0.2} showBalanceWarning={true}>
        <SubmitProposalPage />
      </WalletGuard>
    </WalletLayout>
  )
}
