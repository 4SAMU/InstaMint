require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const { VERIFICATION_API_KEY } = process.env;

module.exports = {
  networks: {
    etherlink_testnet: {
      url: "https://node.ghostnet.etherlink.com",
      accounts: [process.env.ETHERLINK_PRIVATE_KEY],
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.6.3",
      },
      {
        version: "0.8.17",
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: VERIFICATION_API_KEY,
  },
};
