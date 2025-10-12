import { DashboardPage } from "@/components/dashboard-page"
import { WalletGuard } from "@/components/wallet-guard"
import { WalletLayout } from "@/components/wallet-layout"

export default function Dashboard() {
  return (
    <WalletLayout>
      <WalletGuard requireBalance={0.1}>
        <DashboardPage />
      </WalletGuard>
    </WalletLayout>
  )
}
