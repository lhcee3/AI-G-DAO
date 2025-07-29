from smart_contracts.climate_dao.contract import ClimateDAO, ImpactAnalytics, VotingSystem
from smart_contracts.climate_dao.deploy_config import DAO_ADMIN, DAO_TOKEN_CONFIG

def main():
    print("[BUILD] Climate DAO Smart Contracts")
    print(f"Admin Wallet: {DAO_ADMIN}")
    print("Available Contracts:")
    print("- ClimateDAO")
    print("- ImpactAnalytics")
    print("- VotingSystem")
    print("[CONFIG] DAO Token Config:", DAO_TOKEN_CONFIG)

if __name__ == "__main__":
    main()
