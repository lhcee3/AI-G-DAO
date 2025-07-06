from beaker import Application, GlobalStateValue
from pyteal import abi

class ClimateDAO:
    def __init__(self) -> None:
        self.app = Application("ClimateDAOApp", state=ClimateDAOState())

    def build(self) -> Application:
        return self.app

class ClimateDAOState:
    counter = GlobalStateValue(stack_type="uint64", default=0)

climate_dao = ClimateDAO()
app = climate_dao.build()

def get_app() -> Application:
    return app
