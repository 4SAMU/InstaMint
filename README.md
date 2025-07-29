# InstaMint

**Own the Moment. Mint Instantly. Earn Forever.**

InstaMint lets you transform everyday images into valuable digital assets — minted instantly on **Etherlink**. Whether it’s a candid snap, travel highlight, or viral memory — mint it with a tap, grow your fanbase, and earn royalties every time it’s traded.

---

## ✨ What is InstaMint?

A decentralized NFT-powered platform where:

- Users **share content** like on social media
- Content becomes **collectible NFTs** on Etherlink instantly
- Creators **earn royalties** and **XP** through engagement
- Collectors discover, collect, and trade **verifiable digital moments**

---

## 🚀 Key Features

- 🖼️ **Post and Mint Instantly**  
  Upload photos or memories and mint them on-chain with one tap. No crypto expertise required.

- 💸 **Earn XP + Royalties**  
  Gain XP for every reaction. Earn ETH each time your content is sold or resold.

- 🌍 **On Etherlink**  
  Low fees, instant finality, and environmentally-friendly blockchain powered by Tezos.

- 📈 **Engagement-Driven Growth**  
  The more people engage, the more valuable your moments become.

- 🔥 **Trending Moments**  
  Explore and collect trending digital memories from top creators.

---

## 🧱 Powered by Smart Contracts

The heart of InstaMint is a Solidity smart contract built with OpenZeppelin and deployed on **Etherlink**.

### 📄 Contract Summary

- **Name:** `INSTAMINT NFTS`
- **Symbol:** `INSTA`
- **Standard:** ERC-721
- **Network:** Etherlink Testnet
- **Listing Fee:** Default is `0.0001 ETH` (updatable by owner)

### 🔐 Core Capabilities

- Mint NFTs instantly with metadata URI
- List NFTs for sale on-chain
- Buy and resell NFTs securely
- Track XP and sales across users (future integration)

---

## 🛠 Developer Setup

```bash
# Clone the project
git clone <your-repo-url>
cd instamint

# Initialize Hardhat project
npm init -y
npm install --save-dev hardhat
npx hardhat

# Install dependencies
npm install @openzeppelin/contracts dotenv
```

### Deployment

Create `scripts/deploy.js`:

```js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const InstaMint = await ethers.getContractFactory("InstaMint");
  const contract = await InstaMint.deploy();
  await contract.waitForDeployment();

  console.log("Contract deployed to:", contract.target);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

Update `hardhat.config.js`:

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

Create a `.env` file:

```env
ETHERLINK_PRIVATE_KEY="your_ETHERLINK_PRIVATE_KEY"
```

Then run:

```bash
npx hardhat run scripts/deploy.js --network etherlink_testnet
```

---

## 🧠 Smart Contract Functions

### ➕ Mint & List NFT

```solidity
createToken(string memory tokenURI, uint256 price)
```

### 💰 Buy NFT

```solidity
createMarketSale(uint256 tokenId)
```

### ♻️ Resell NFT

```solidity
resellToken(uint256 tokenId, uint256 price)
```

### 📥 Fetch Functions

```solidity
fetchMarketItems()
fetchMyNFTs()
fetchItemsListed()
```

### 🔧 Admin

```solidity
updateListingPrice(uint256 newPrice)
getListingPrice()
```

---

## 📸 Sample Content Flow

### Featured Collectible

> **Remy Traveler**  
> Visited Bahamas – _Enjoyed the sun kisses, wanna go back there fr_  
> 🖼️ NFT ID: 5000  
> ❤️ Reactions: 12k  
> 💰 Value: 12 ETH

---

## 📢 Community & Support

Explore, mint, and connect with others through our growing community:

- [Twitter](#)
- [Instagram](#)
- [Discord](#)

For help, check our:

- [FAQ](#)
- [Creator Docs](#)
- [Support Center](#)

---

## 📄 License

MIT License

---

© 2025 InstaMint. All rights reserved.

**InstaMint** – Own your moments. Mint them. Earn forever.
