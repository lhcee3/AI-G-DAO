from algokit_utils.config import ConfigurableApplicationClient
from contract import ClimateDAO

climate_app = ClimateDAO()

def deploy():
    client = ConfigurableApplicationClient(
        app=climate_app,
        app_id=None,  # set manually if needed
    )
    client.create()
