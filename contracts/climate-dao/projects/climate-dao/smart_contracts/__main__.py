import sys
from pathlib import Path

# Add the current directory to path to import modules
sys.path.append(str(Path(__file__).parent))

from smart_contracts.climate_dao.contract import ClimateDAO, ImpactAnalytics, VotingSystem
from smart_contracts.climate_dao.deploy_config import DAO_ADMIN, DAO_TOKEN_CONFIG

def main():
    """Main entry point for build and deploy commands"""
    if len(sys.argv) > 1 and sys.argv[1] == "deploy":
        deploy_contracts()
    elif len(sys.argv) > 1 and sys.argv[1] == "build":
        build_contracts()
    else:
        build_contracts()

def build_contracts():
    """Build and compile contracts"""
    print("[BUILD] Climate DAO Smart Contracts")
    print(f"Admin Wallet: {DAO_ADMIN}")
    print("Available Contracts:")
    print("- ClimateDAO")
    print("- ImpactAnalytics")
    print("- VotingSystem")
    print("[CONFIG] DAO Token Config:", DAO_TOKEN_CONFIG)
    
    # In a real AlgoKit project, this would compile the contracts
    # For now, we'll just show the info
    print("\n[SUCCESS] Contracts ready for deployment")

def deploy_contracts():
    """Deploy contracts to Algorand network"""
    print("[DEPLOY] Starting Climate DAO Contract Deployment")
    print("=" * 50)
    
    # Check if admin address is configured
    if DAO_ADMIN == "YOUR_ALGORAND_ADMIN_ADDRESS":
        print("[ERROR] Please configure DAO_ADMIN address in deploy_config.py")
        print("   1. Get a TestNet account: https://bank.testnet.algorand.network/")
        print("   2. Update DAO_ADMIN with your address")
        print("   3. Set DEPLOYER_MNEMONIC environment variable")
        return False
    
    print(f"[INFO] Deploying with admin address: {DAO_ADMIN}")
    print(f"[INFO] Network: TestNet")
    
    # Check for mnemonic
    import os
    mnemonic = os.getenv('DEPLOYER_MNEMONIC')
    if not mnemonic:
        print("\n[ERROR] DEPLOYER_MNEMONIC environment variable not set")
        print("   Please set it using: $env:DEPLOYER_MNEMONIC='your 25 word mnemonic'")
        return False
    
    try:
        print("\n[DEPLOY] Setting up Algorand client...")
        from algosdk.v2client import algod
        from algosdk import account, mnemonic as algo_mnemonic
        
        # Create Algorand client for TestNet
        algod_address = "https://testnet-api.algonode.cloud"
        algod_client = algod.AlgodClient("", algod_address, headers={"User-Agent": "AlgoKit"})
        
        # Get account from mnemonic
        private_key = algo_mnemonic.to_private_key(mnemonic)
        deployer_address = account.address_from_private_key(private_key)
        
        print(f"[INFO] Deployer address: {deployer_address}")
        
        # Check account balance
        account_info = algod_client.account_info(deployer_address)
        balance = account_info.get('amount', 0) / 1_000_000  # Convert microAlgos to Algos
        print(f"[INFO] Account balance: {balance} ALGO")
        
        if balance < 1:
            print("[WARNING] Low balance! Please fund your account at: https://bank.testnet.algorand.network/")
            print("   You need at least 1 ALGO to deploy contracts")
        
        # For now, just show successful connection
        print("\n[SUCCESS] Connected to Algorand TestNet")
        print("[INFO] Smart contract deployment would happen here")
        print("   - ClimateDAO main contract")
        print("   - VotingSystem contract") 
        print("   - ImpactAnalytics contract")
        print("\n[NEXT] Implement actual PyTeal contract compilation and deployment")
        
        return True
        
    except Exception as e:
        print(f"[ERROR] Deployment failed: {str(e)}")
        print("   Make sure your mnemonic is correct and account is funded")
        return False
    
    return True

if __name__ == "__main__":
    main()
