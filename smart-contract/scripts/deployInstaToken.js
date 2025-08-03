const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying InstaToken with the account:", deployer.address);

  // ✅ Deploy InstaToken contract
  const InstaToken = await ethers.getContractFactory("InstaToken");
  const instaToken = await InstaToken.deploy();

  await instaToken.waitForDeployment();
  const contractAddress = await instaToken.getAddress();

  console.log("InstaToken deployed to:", contractAddress);

  // ✅ Define deployed folder path
  const deployedDir = path.join(__dirname, "../deployed");

  // ✅ Create folder if it doesn't exist
  if (!fs.existsSync(deployedDir)) {
    fs.mkdirSync(deployedDir);
  }

  // ✅ Write contract address to config.json
  const config = {
    tokenAddress: contractAddress,
  };

  fs.writeFileSync(
    path.join(deployedDir, "tokenConfig.json"),
    JSON.stringify(config, null, 2)
  );

  // ✅ Write ABI to instatoken.json
  const artifact = await hre.artifacts.readArtifact("InstaToken");

  fs.writeFileSync(
    path.join(deployedDir, "instatoken.json"),
    JSON.stringify(artifact.abi, null, 2)
  );

  console.log(
    "✅ Wrote to deployed/tokenConfig.json and deployed/instatoken.json"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
