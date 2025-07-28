# InstaMint NFT Marketplace

**InstaMint** is an Ethereum-based NFT marketplace smart contract that lets users mint NFTs, list them for sale, purchase listed NFTs, and resell previously purchased ones. It's built using the ERC-721 standard and integrates with OpenZeppelin libraries.

---

## 🚀 Features

- Mint new NFTs with metadata URI
- List NFTs for sale on the marketplace
- Buy NFTs listed by others
- Resell NFTs that you own
- Fetch marketplace listings, owned NFTs, and listed items
- Owner-controlled listing fee

---

## 🛠 Tech Stack

- Solidity ^0.8.17
- Hardhat
- OpenZeppelin Contracts
- Ethereum (or compatible EVM networks)

---

## 📦 Installation & Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd <project-folder>

# 2. Initialize Node project
npm init -y

# 3. Install Hardhat
npm install --save-dev hardhat

# 4. Create Hardhat project
npx hardhat

# 5. Install OpenZeppelin Contracts
npm install @openzeppelin/contracts
```

---

## 📤 Deploy the Contract

Create a file at `scripts/deploy.js` and paste the following:

```js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with:", deployer.address);

  const InstaMint = await ethers.getContractFactory("InstaMint");
  const instaMint = await InstaMint.deploy();
  await instaMint.waitForDeployment();

  console.log("Contract deployed to:", instaMint.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Then deploy the contract:

```bash
# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Or deploy to testnet
npx hardhat run scripts/deploy.js --network etherlink_testnet
```

Make sure your `hardhat.config.js` includes:

```js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    etherlink_testnet: {
      url: "https://node.ghostnet.etherlink.com",
      accounts: [process.env.ETHERLINK_PRIVATE_KEY],
    },
  },
};
```

And your `.env` should contain:

```env
ETHERLINK_PRIVATE_KEY="your_private_key_here"
```

---

## 🧠 How It Works

### 🔹 Struct: MarketItem

```solidity
struct MarketItem {
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
}
```

### 🔑 Key Functions

#### ✅ Create & List NFT

```solidity
function createToken(string memory tokenURI, uint256 price) public payable returns (uint)
```

#### 💸 Buy NFT

```solidity
function createMarketSale(uint256 tokenId) public payable
```

#### 🔁 Resell NFT

```solidity
function resellToken(uint256 tokenId, uint256 price) public payable
```

#### 📃 View Functions

```solidity
function fetchMarketItems() public view returns (MarketItem[] memory)
function fetchMyNFTs() public view returns (MarketItem[] memory)
function fetchItemsListed() public view returns (MarketItem[] memory)
```

#### ⚙️ Admin Functions

```solidity
function updateListingPrice(uint _listingPrice) public payable
function getListingPrice() public view returns (uint256)
```

---

## 🧪 Example Usage Flow

1. **User mints NFT** using `createToken(tokenURI, price)` and pays listing fee.
2. NFT is transferred to contract and listed for sale.
3. Another user calls `createMarketSale(tokenId)` with the sale price.
4. NFT ownership transfers to buyer, seller is paid, and fee goes to contract owner.
5. Buyer can call `resellToken(tokenId, newPrice)` to relist it.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- [OpenZeppelin](https://openzeppelin.com/)
- [Hardhat](https://hardhat.org/)
