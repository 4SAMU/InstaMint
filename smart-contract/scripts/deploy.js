const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const InstaMint = await hre.ethers.getContractFactory("InstaMint");
  const instamint = await InstaMint.deploy();
  await instamint.deployed();
  console.log("instamint deployed to:", instamint.address);

  fs.writeFileSync(
    "./config.js",
    `
  export const marketplaceAddress = "${instamint.address}"
  `
  );

  const data = {
    address: instamint.address,
    abi: JSON.parse(instamint.interface.format("json")),
  };

  //This writes the ABI and address to the mktplace.json
  fs.writeFileSync("./Marketplace.json", JSON.stringify(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
