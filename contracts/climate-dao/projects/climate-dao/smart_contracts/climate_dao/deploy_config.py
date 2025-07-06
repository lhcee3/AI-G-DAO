from algokit_utils.deploy import AppDeploymentContext, Deployable, DeploymentRequestedAction
from .contract import get_app

def deploy(ctx: AppDeploymentContext) -> Deployable:
    app = get_app()

    return {
        "app": app,
        "args": {
            "on_update": DeploymentRequestedAction.ALLOW,
            "on_delete": DeploymentRequestedAction.ALLOW,
        }
    }
