import sys
from pathlib import Path
import logging
from smart_contracts.climate_dao.contract import app
from algokit_utils import get_algod_client
from algokit_utils.deploy import deploy_app

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

artifacts_path = Path(__file__).parent / "artifacts"

def build():
    logger.info("🔨 Compiling smart contract...")
    app.build().export(artifacts_path)
    logger.info(f"✅ Contract compiled to: {artifacts_path}")

def deploy_localnet():
    logger.info("🚀 Deploying to localnet...")
    algod = get_algod_client(network="localnet")
    result = deploy_app(
        client=algod,
        app=app,
        signer=algod.account,
        allow_delete=True,
        allow_update=True,
    )
    logger.info(f"✅ Deployed App ID: {result.app_id}")
    logger.info(f"🌐 Global state: {result.app_client.get_global_state()}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python -m smart_contracts [build|deploy-localnet]")
        return

    command = sys.argv[1]
    if command == "build":
        build()
    elif command == "deploy-localnet":
        deploy_localnet()
    else:
        print(f"❌ Unknown command: {command}")

if __name__ == "__main__":
    main()
