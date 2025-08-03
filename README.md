# InstaMint

## Overview

`InstaMint` is an innovative decentralized NFT marketplace designed to transform everyday images into valuable digital assets on the blockchain. Built on the Tezos ecosystem via Etherlink, InstaMint offers a seamless and rewarding experience for minting, buying, selling, and collecting unique digital collectibles. Beyond core marketplace functionalities, InstaMint features an Experience Point (XP) system that rewards active participation, allowing users to earn INSTA tokens, which are pegged 1:1 to XTZ.

`Our mission is to make digital ownership accessible and engaging for everyone, fostering a vibrant community around unique visual content.`

✨ Key Features
-- Effortless NFT Minting: Transform your photos into unique NFTs with a simple, intuitive process, by providing a title, description, and price.

-- Decentralized Marketplace: Buy, sell, and browse a diverse collection of digital art securely on the Etherlink blockchain.

-- XP & Reward System: Earn Experience Points for various actions:

- Mint NFT: 15 XP

- Buy NFT: 10 XP

- Resell NFT: 5 XP

- Claiming XP rewards is coming soon! Users will need at least 100 XP to claim INSTA tokens.

-- `IPFS` Integration: All NFT media and metadata are securely and immutably stored on IPFS via `Pinata`.

-- `Wallet Compatibility`: Seamlessly connect your preferred Etherlink-compatible wallets, including Brave Wallet, MetaMask, Rainbow, Coinbase Wallet, and WalletConnect.

-- User-Friendly Interface: A modern and responsive web application built with Next.js ensures a smooth user experience.

-- Secure Authentication: Login and registration available via email and password, with an option to connect wallet.

### Technical Stack

InstaMint leverages a robust combination of decentralized and centralized technologies to deliver a powerful and user-friendly experience.

-- Blockchain Network: Tezos (via Etherlink Testnet/Mainnet)

-- Smart Contracts: Solidity (ERC721URIStorage for NFTs, ERC20 for INSTA token)

-- Utilizes OpenZeppelin Contracts for security and best practices.

-- Decentralized Storage: IPFS (via Pinata for reliable pinning)

-- Frontend: Next.js (React Framework)

-- Backend: Next.js (API Routes)

-- Database: MongoDB

### Architecture

InstaMint employs a hybrid architecture:

-- Frontend (Next.js): Provides the user interface, handles wallet interactions, and facilitates direct communication with IPFS for content uploads.

-- Backend (Next.js API Routes): Manages user accounts, tracks XP, stores an indexed copy of NFT metadata in MongoDB for quick searches, and will eventually manage the INSTA token distribution.

-- Smart Contracts (on Etherlink): Handle the core logic for NFT creation, marketplace listings, sales, and the INSTA token mechanics.

-- IPFS (via Pinata): Stores the immutable NFT image files and their JSON metadata.

-- MongoDB: The NoSQL database used by the Next.js backend for persistent storage of user data, XP, and cached NFT metadata.

```shell
  graph TD
    A[User] -->|Browser/Client| B[InstaMint Frontend (Next.js)]
    B -- API Calls --> C[InstaMint Backend (Next.js API Routes)]
    B -- Wallet Interaction --> D[Blockchain Network (Etherlink)]
    C -- (Owner Tx) --> D

    D -- Reads/Writes --> E[InstaMint NFT Contract]
    D -- Reads/Writes --> F[InstaToken Contract]

    C -- Reads/Writes --> G[MongoDB Database]
    B -- Uploads to --> H[IPFS (via Pinata)]
    H -- Returns URI --> B
    B -->|Passes URI| C
    C -->|Passes URI| D
    E -->|tokenURI| H
```

### Getting Started

To get a local copy up and running, follow these simple steps.
Prerequisites

- Node.js (v18 or higher recommended)

- Yarn or npm

- Git

- MongoDB instance (local or cloud-hosted like MongoDB Atlas)

- An Etherlink-compatible wallet (e.g., MetaMask configured for Etherlink Testnet)

- Testnet XTZ from an Etherlink Faucet (for transaction fees)

- Pinata API Key + jwt and gateway_url (for IPFS uploads)

### Installation

1.Clone the repository:

```Shell
git clone https://github.com/4SAMU/InstaMint.git
cd InstaMint
```

2. Install Frontend & Backend Dependencies (they are in the same Next.js project):

```Shell
cd frontend
npm install # or yarn install
```

3.Set-up the `.env`

```shell
# Authentication
JWT_SECRET="your_jwt_secret_here"

# Database
MONGODB_URI="your_mongodb_connection_string_here"

# Pinata Configuration
PINATA_JWT="your_pinata_jwt_here"
PINATA_API_KEY="your_pinata_api_key_here"
PINATA_API_SECRET="your_pinata_api_secret_here"

# Public Gateway
NEXT_PUBLIC_GATEWAY_URL="your_pinata_gateway_url"

```

Running the Application
Start the Next.js Development Server (this runs both frontend and backend API routes):

```Shell
npm run dev # or yarn dev
```

4. Install smart-contract Dependencies
   Navigate to your smart-contracts directory

```Shell
cd smart-contract
npm install # or yarn install
```

Set up your .env file with your testnet private key and verification private api.

```Shell
VERIFICATION_API_KEY=""
ETHERLINK_PRIVATE_KEY=""
```

Deploy contract

```Shell
npm run deployInstaMintNft # or yarn deployInstaMintNft # for nft
npm run deployInstaToken # or yarn deployInstaToken # for ERC-20 token (INSTA)
```

After successful deployment, update frontend `frontend/src/config` with the respective items, abis and contract addresses from the `smart-contract/deployed`
