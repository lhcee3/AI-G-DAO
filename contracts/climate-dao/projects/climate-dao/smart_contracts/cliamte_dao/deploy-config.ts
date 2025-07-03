import { AppDeploymentConfig } from "@algorandfoundation/algokit-utils/types";

const deployConfig: AppDeploymentConfig = {
  appName: "climate_dao",
  creator: {
    address: "REPLACE_WITH_YOUR_TESTNET_ADDRESS"
  },
  deployTimeParams: {},
  deleteIfExists: true,
};

export default deployConfig;
