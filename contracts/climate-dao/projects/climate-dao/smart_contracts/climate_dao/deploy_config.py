from algokit_utils.deploy import AppSpec, DeployCallArgs, deploy_dry_run_create
from beaker import Application
from .contract import get_app

def deploy():
    app: Application = get_app()

    print("🚀 Deploying ClimateDAO contract...")

    deploy_dry_run_create(
        app=app,
        app_spec=AppSpec.from_app(app),
        call_config=DeployCallArgs()
    )

    print("✅ Deployment complete.")
