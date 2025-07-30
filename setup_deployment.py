#!/usr/bin/env python3
"""
Setup script for Climate DAO deployment
"""

def main():
    print("🌱 Climate DAO Deployment Setup")
    print("=" * 40)
    
    print("\n📋 Quick Setup Guide:")
    print("\n1. Get TestNet Account:")
    print("   • Visit: https://bank.testnet.algorand.network/")
    print("   • Click 'Generate Account'")
    print("   • Save your 25-word mnemonic phrase securely")
    print("   • Copy your account address")
    print("   • Fund with TestNet ALGOs")
    
    print("\n2. Configure Deployment:")
    print("   • Open: smart_contracts/climate_dao/deploy_config.py")
    print("   • Replace 'YOUR_ALGORAND_ADMIN_ADDRESS' with your address")
    
    print("\n3. Set Environment Variable:")
    print("   • In PowerShell: $env:DEPLOYER_MNEMONIC='your 25 words here'")
    print("   • Or create .env.local file with DEPLOYER_MNEMONIC=...")
    
    print("\n4. Deploy Contracts:")
    print("   • Run: algokit project deploy")
    
    print("\n5. Update Frontend:")
    print("   • Copy the deployed App IDs")
    print("   • Update frontend/.env.local")
    print("   • Update frontend/lib/algorand.ts")
    
    print("\n🔐 Security Notes:")
    print("• Never share your mnemonic phrase")
    print("• Never commit .env files with secrets")
    print("• Use TestNet for development only")
    
    print("\n🎯 After deployment, you'll get App IDs like:")
    print("   Climate DAO: 123456789")
    print("   Impact Analytics: 987654321")
    print("   Voting System: 456789123")

if __name__ == "__main__":
    main()
