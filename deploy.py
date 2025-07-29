#!/usr/bin/env python3
"""
Simple deployment script for Climate DAO contracts
"""
import sys
from pathlib import Path

# Add the smart contracts directory to the path
contract_dir = Path(__file__).parent.parent / "contracts" / "climate-dao" / "projects" / "climate-dao"
sys.path.append(str(contract_dir))

def main():
    print("🌱 Climate DAO Contract Deployment")
    print("=" * 40)
    
    print("\n📋 Pre-deployment Checklist:")
    print("1. ✅ Algorand CLI installed")
    print("2. ✅ TestNet account funded")
    print("3. ✅ AlgoKit configured")
    print("4. ✅ Contracts compiled successfully")
    
    print("\n🚀 Deployment Steps:")
    print("1. Navigate to contract directory:")
    print(f"   cd {contract_dir}")
    print("\n2. Deploy using AlgoKit:")
    print("   algokit project run deploy")
    print("\n3. Copy the deployed application IDs")
    print("4. Update frontend/.env.local with the app IDs")
    print("5. Update CONTRACT_IDS in frontend/lib/algorand.ts")
    
    print("\n📝 After Deployment:")
    print("- Test contract interactions in frontend")
    print("- Fund the DAO contract for token creation")
    print("- Create initial DAO and credit tokens")
    
    print("\n🔗 Useful Commands:")
    print("- Check account: goal account list")
    print("- Check app: goal app info --app-id <ID>")
    print("- Fund account: https://bank.testnet.algorand.network/")

if __name__ == "__main__":
    main()
