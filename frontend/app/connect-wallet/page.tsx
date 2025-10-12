import { WalletConnectPage } from "@/components/connect-wallet"
import { WalletLayout } from "@/components/wallet-layout"

export default function ConnectWallet() {
  return (
    <WalletLayout>
      <WalletConnectPage />
    </WalletLayout>
  )
}
