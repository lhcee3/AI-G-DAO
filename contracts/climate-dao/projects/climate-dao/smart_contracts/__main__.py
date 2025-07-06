import sys
from pathlib import Path
from beaker import Application
from algokit_utils import get_algod_client
from algokit_utils.deploy_dry_run import deploy_dry_run_create
from algokit_utils.models import DeployCallArgs
from algokit_utils import get_algod_client

from climate_dao.contract import app
import logging

# Setup basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Where artifacts will be written
artifacts_path = Path(__file__).parent / "artifacts"

def build():
    logger.info("🛠️ Compiling smart contract...")
    app.build().export(artifacts_path)
    logger.info(f"✅ Contract compiled to: {artifacts_path}")

def deploy_localnet():
    logger.info("🚀 Deploying to localnet...")
    algod = get_algod_client(network="localnet")
    deploy_result = deploy_app(
        client=algod,
        app=app,
        signer=algod.account,  # Automatically signs with default localnet account
        allow_delete=True,
        allow_update=True,
    )
    logger.info(f"✅ Deployed app ID: {deploy_result.app_id}")
    logger.info(f"🌐 Global state: {deploy_result.app_client.get_global_state()}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python -m climate_dao [build|deploy-localnet]")
        return

    command = sys.argv[1]

    if command == "build":
        build()
    elif command == "deploy-localnet":
        deploy_localnet()
    else:
        print(f"Unknown command: {command}")

if __name__ == "__main__":
    main()
