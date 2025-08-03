/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import { InstaMintNftContractAddress } from "@/config/contract-address";
import { InstaMintNFTABI } from "@/config/instamint-abi";
import { useActiveAccount } from "thirdweb/react";

export interface InstaMintNFTItem {
  tokenId: number;
  tokenURI: string;
  seller: string;
  owner: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    price?: string;
    attributes?: { trait_type: string; value: any }[];
  };
}

interface InstaMintContextValue {
  marketNFTs: InstaMintNFTItem[];
  myNFTs: InstaMintNFTItem[];
  fetchMarketNFTs: () => Promise<void>;
  fetchMyNFTs: () => Promise<void>;
}

const InstaMintContext = createContext<InstaMintContextValue | undefined>(
  undefined
);

export const useInstaMint = () => {
  const context = useContext(InstaMintContext);
  if (!context) {
    throw new Error("useInstaMint must be used within an InstaMintProvider");
  }
  return context;
};

export const InstaMintProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const account = useActiveAccount();
  const [marketNFTs, setMarketNFTs] = useState<InstaMintNFTItem[]>([]);
  const [myNFTs, setMyNFTs] = useState<InstaMintNFTItem[]>([]);

  // ---- Helper to connect contract ----
  const etherlinkGhostnetRpc = "https://node.ghostnet.etherlink.com";
  const fallbackProvider = new ethers.JsonRpcProvider(etherlinkGhostnetRpc);

  const getContract = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);

      const signer = await browserProvider.getSigner();
      return new ethers.Contract(
        InstaMintNftContractAddress,
        InstaMintNFTABI,
        signer
      );
    }

    // fallback read-only
    return new ethers.Contract(
      InstaMintNftContractAddress,
      InstaMintNFTABI,
      fallbackProvider
    );
  };

  // ---- Helper to enrich NFT metadata ----
  const enrichItems = async (items: any[], contract: any) => {
    return Promise.all(
      items.map(async (i) => {
        try {
          const tokenURI = await contract.tokenURI(i.tokenId);
          const gatewayURI = tokenURI.startsWith("ipfs://")
            ? `https://ipfs.io/ipfs/${tokenURI.slice(7)}`
            : tokenURI;

          const response = await fetch(gatewayURI);
          if (!response.ok) throw new Error("Failed to fetch metadata");

          const metadata = await response.json();
          const imageURL = metadata.image?.startsWith("ipfs://")
            ? `https://ipfs.io/ipfs/${metadata.image.slice(7)}`
            : metadata.image;

          return {
            tokenId: Number(i.tokenId),
            tokenURI,
            seller: i.seller,
            owner: i.owner,
            metadata: {
              name: metadata.name ?? "Unnamed NFT",
              description: metadata.description ?? "",
              image: imageURL ?? "",
              price: i.price ? ethers.formatEther(i.price) : undefined,
              attributes: metadata.attributes || [],
            },
          } as InstaMintNFTItem;
        } catch (err) {
          console.error(`Error processing token ${i.tokenId}:`, err);
          return null;
        }
      })
    ).then((items) =>
      items.filter((item): item is InstaMintNFTItem => item !== null)
    );
  };

  // ---- Fetch Market NFTs ----
  const fetchMarketNFTs = async () => {
    try {
      if (!account) return;
      const contract = await getContract();
      if (!contract) return;

      const marketItems = await contract.fetchMarketItems();
      const enrichedMarket = await enrichItems(marketItems, contract);
      setMarketNFTs(enrichedMarket.reverse());
    } catch (err) {
      console.error("Error loading Market NFTs:", err);
    }
  };

  // ---- Fetch My NFTs ----
  const fetchMyNFTs = async () => {
    try {
      if (!account) return;
      const contract = await getContract();
      if (!contract) return;

      const ownedItems = await contract.fetchMyNFTs();
      const enrichedOwned = await enrichItems(ownedItems, contract);
      setMyNFTs(enrichedOwned.reverse());
    } catch (err) {
      console.error("Error loading My NFTs:", err);
    }
  };

  // ---- Load on mount & refresh every 15s ----
  useEffect(() => {
    let isMounted = true;

    const loadAll = async () => {
      if (!isMounted) return;
      await fetchMarketNFTs();
      await fetchMyNFTs();
    };

    if (account) {
      loadAll();
      const interval = setInterval(loadAll, 15000);
      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <InstaMintContext.Provider
      value={{ marketNFTs, myNFTs, fetchMarketNFTs, fetchMyNFTs }}
    >
      {children}
    </InstaMintContext.Provider>
  );
};
