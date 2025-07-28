const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const InstaMint = await ethers.getContractFactory("InstaMint");
  const instaMint = await InstaMint.deploy();

  await instaMint.waitForDeployment();
  const contractAddress = await instaMint.getAddress();

  console.log("InstaMint deployed to:", contractAddress);
  console.log(
    "Initial listing price:",
    (await instaMint.getListingPrice()).toString()
  );

  // ✅ Define deployed folder path
  const deployedDir = path.join(__dirname, "../deployed");

  // ✅ Create folder if it doesn't exist
  if (!fs.existsSync(deployedDir)) {
    fs.mkdirSync(deployedDir);
  }

  // ✅ Write contract address to config.json
  const config = {
    address: contractAddress,
  };

  fs.writeFileSync(
    path.join(deployedDir, "config.json"),
    JSON.stringify(config, null, 2)
  );

  // ✅ Write ABI to instamint.json
  const artifact = await hre.artifacts.readArtifact("InstaMint");

  fs.writeFileSync(
    path.join(deployedDir, "instamint.json"),
    JSON.stringify(artifact.abi, null, 2)
  );

  console.log("✅ Wrote to deployed/config.json and deployed/instamint.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
