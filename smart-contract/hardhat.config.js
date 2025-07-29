require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    etherlinkTestnet: {
      url: "https://node.ghostnet.etherlink.com",
      accounts: [process.env.ETHERLINK_PRIVATE_KEY],
      chainId: 128123,
    },
    etherlinkMainnet: {
      url: "https://node.etherlink.com",
      accounts: [process.env.ETHERLINK_PRIVATE_KEY],
      chainId: 42793,
    },
  },
};
