# Climate DAO - Smart Contract Integration

This guide explains how to connect your Climate DAO smart contracts with the Next.js frontend.

## 🏗️ Architecture Overview

```
Frontend (Next.js) → Algorand SDK → Smart Contracts (AlgoKit/PyTeal)
     ↓                    ↓              ↓
- React Components   - Transaction    - ClimateDAO
- Wallet Integration   Signing       - ImpactAnalytics  
- UI/UX             - State Queries   - VotingSystem
```

## 🚀 Quick Start

### 1. Deploy Smart Contracts

```bash
# Navigate to contract directory
cd contracts/climate-dao/projects/climate-dao

# Build contracts
algokit project run build

# Deploy to TestNet
algokit project run deploy
```

### 2. Update Frontend Configuration

After deployment, update the contract IDs:

**frontend/.env.local:**
```env
NEXT_PUBLIC_CLIMATE_DAO_APP_ID=123456789
NEXT_PUBLIC_IMPACT_ANALYTICS_APP_ID=987654321
NEXT_PUBLIC_VOTING_SYSTEM_APP_ID=456789123
```

**frontend/lib/algorand.ts:**
```typescript
export const CONTRACT_IDS = {
  CLIMATE_DAO: 123456789,
  IMPACT_ANALYTICS: 987654321,
  VOTING_SYSTEM: 456789123,
};
```

### 3. Test Integration

```bash
# Start frontend development server
cd frontend
npm run dev
```

## 📱 Available Components

### Wallet Integration
- **WalletProvider**: Global wallet state management
- **useWallet()**: Hook for wallet operations
- **ConnectWallet**: UI component for wallet connection

### Smart Contract Interactions
- **useClimateDAO()**: Hook for DAO operations
  - `joinDAO(fee)` - Join the DAO with membership fee
  - `submitProposal(title, desc, funding, impact)` - Submit proposals
  - `voteOnProposal(id, vote)` - Vote on proposals
  - `getMemberTokens()` - Get token balance
  - `getTotalProposals()` - Get proposal count

### Example Usage

```tsx
import { useWallet } from '@/hooks/use-wallet';
import { useClimateDAO } from '@/hooks/use-climate-dao';

function MyComponent() {
  const { isConnected, address } = useWallet();
  const { joinDAO, submitProposal, loading } = useClimateDAO();

  const handleJoinDAO = async () => {
    if (isConnected) {
      try {
        const txId = await joinDAO(1); // 1 ALGO membership fee
        console.log('Joined DAO:', txId);
      } catch (error) {
        console.error('Failed to join DAO:', error);
      }
    }
  };

  return (
    <div>
      {isConnected ? (
        <button onClick={handleJoinDAO} disabled={loading}>
          Join DAO
        </button>
      ) : (
        <p>Please connect your wallet</p>
      )}
    </div>
  );
}
```

## 🔧 Contract Methods

### ClimateDAO Contract
- `create_dao_tokens()` - Initialize DAO and credit tokens (admin only)
- `join_dao()` - Join DAO and receive governance tokens
- `submit_proposal()` - Submit climate project proposals
- `vote_on_proposal()` - Vote on proposals
- `execute_proposal()` - Execute approved proposals (admin only)

### Read-only Methods
- `get_dao_token_id()` - Get DAO token asset ID
- `get_credit_token_id()` - Get climate credit token asset ID
- `get_member_tokens()` - Get member token balance
- `get_total_proposals()` - Get total proposal count
- `get_total_members()` - Get total member count

## 🛠️ Development Workflow

1. **Smart Contract Development**
   ```bash
   cd contracts/climate-dao/projects/climate-dao
   # Edit contracts in smart_contracts/climate_dao/contract.py
   algokit project run build
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   # Edit components and hooks
   npm run dev
   ```

3. **Testing Integration**
   - Connect wallet in frontend
   - Test contract interactions
   - Verify transactions on TestNet

## 🌐 Network Configuration

### TestNet (Development)
- **Algod**: https://testnet-api.algonode.cloud
- **Indexer**: https://testnet-idx.algonode.cloud
- **Explorer**: https://testnet.algoexplorer.io

### MainNet (Production)
- **Algod**: https://mainnet-api.algonode.cloud
- **Indexer**: https://mainnet-idx.algonode.cloud
- **Explorer**: https://algoexplorer.io

## 🔐 Security Considerations

1. **Private Keys**: Never expose private keys in frontend code
2. **Wallet Integration**: Use trusted wallet providers (Pera, MyAlgo, etc.)
3. **Transaction Validation**: Always validate transaction parameters
4. **Smart Contract Auditing**: Audit contracts before MainNet deployment

## 📚 Additional Resources

- [Algorand Developer Portal](https://developer.algorand.org)
- [AlgoKit Documentation](https://algokit.io)
- [Algorand SDK Documentation](https://py-algorand-sdk.readthedocs.io)
- [PyTeal Documentation](https://pyteal.readthedocs.io)

## 🐛 Troubleshooting

### Common Issues

1. **"Wallet not connected"**
   - Ensure WalletProvider wraps your app
   - Check wallet connection state

2. **"Contract not found"**
   - Verify contract deployment
   - Check APPLICATION_ID configuration

3. **"Transaction failed"**
   - Check account funding
   - Verify transaction parameters
   - Check network connectivity

### Debug Commands

```bash
# Check account balance
algokit goal account list

# Check application info
algokit goal app info --app-id <APPLICATION_ID>

# View transaction details
algokit goal tx info --txid <TRANSACTION_ID>
```
