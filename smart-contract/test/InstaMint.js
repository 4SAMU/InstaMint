const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("InstaMint", function () {
  async function deployInstaMintFixture() {
    const [owner, user1] = await ethers.getSigners();
    const InstaMint = await ethers.getContractFactory("InstaMint");
    const contract = await InstaMint.deploy();

    const listingPrice = await contract.getListingPrice();
    const price = ethers.parseEther("1"); // NFT price

    return { contract, owner, user1, listingPrice, price };
  }

  describe("Deployment", function () {
    it("Should set the owner correctly", async function () {
      const { contract, owner } = await loadFixture(deployInstaMintFixture);
      expect(await contract.getListingPrice()).to.equal("100000000000000"); // 0.0001 ether
    });
  });

  describe("Minting and Listing", function () {
    it("Should mint a token and list it", async function () {
      const { contract, owner, listingPrice, price } = await loadFixture(
        deployInstaMintFixture
      );

      const tx = await contract.createToken("ipfs://token1", price, {
        value: listingPrice,
      });
      const receipt = await tx.wait();

      const event = receipt.logs.find(
        (log) => log.fragment.name === "MarketItemCreated"
      );
      const tokenId = event.args.tokenId;

      const item = await contract.fetchMarketItems();
      expect(item.length).to.equal(1);
      expect(item[0].tokenId).to.equal(tokenId);
      expect(item[0].price).to.equal(price);
    });

    it("Should fail to create token if value sent is less than listing price", async function () {
      const { contract, price } = await loadFixture(deployInstaMintFixture);

      await expect(
        contract.createToken("ipfs://token1", price, { value: 0 })
      ).to.be.revertedWith("Price must be equal to listing price");
    });
  });

  describe("Buying and Selling", function () {
    it("Should allow a user to purchase a token", async function () {
      const { contract, user1, listingPrice, price } = await loadFixture(
        deployInstaMintFixture
      );

      const createTx = await contract.createToken("ipfs://token1", price, {
        value: listingPrice,
      });
      const receipt = await createTx.wait();
      const tokenId = receipt.logs.find(
        (log) => log.fragment.name === "MarketItemCreated"
      ).args.tokenId;

      await contract.connect(user1).createMarketSale(tokenId, { value: price });

      const myNFTs = await contract.connect(user1).fetchMyNFTs();
      expect(myNFTs.length).to.equal(1);
      expect(myNFTs[0].tokenId).to.equal(tokenId);
    });

    it("Should allow resale of token", async function () {
      const { contract, user1, listingPrice, price } = await loadFixture(
        deployInstaMintFixture
      );

      const createTx = await contract.createToken("ipfs://token1", price, {
        value: listingPrice,
      });
      const receipt = await createTx.wait();
      const tokenId = receipt.logs.find(
        (log) => log.fragment.name === "MarketItemCreated"
      ).args.tokenId;

      await contract.connect(user1).createMarketSale(tokenId, { value: price });

      const resalePrice = ethers.parseEther("2");
      await contract
        .connect(user1)
        .resellToken(tokenId, resalePrice, { value: listingPrice });

      const items = await contract.fetchMarketItems();
      expect(items.length).to.equal(1);
      expect(items[0].price).to.equal(resalePrice);
    });
  });
});
