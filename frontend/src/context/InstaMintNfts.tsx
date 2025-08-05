/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import { InstaMintNftContractAddress } from "@/config/contract-address";
import { InstaMintNFTABI } from "@/config/instamint-abi";
import {
  useActiveAccount,
  useActiveWallet,
  useNetworkSwitcherModal,
} from "thirdweb/react";
import { EtherlinkTestnet, thirdWebClient } from "@/config/thirdWebConfig";

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
    attributes?: { trait_type: string; value: string | number }[];
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

// ---- Helpers ----

const etherlinkGhostnetRpc = "https://node.ghostnet.etherlink.com";
const fallbackProvider = new ethers.JsonRpcProvider(etherlinkGhostnetRpc);

const getGatewayURI = (uri: string): string => {
  if (!uri) return "";
  return uri.startsWith("ipfs://")
    ? `https://ipfs.io/ipfs/${uri.slice(7)}`
    : uri;
};

const getContract = async (): Promise<ethers.Contract> => {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    const browserProvider = new ethers.BrowserProvider(
      (window as any).ethereum
    );
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

const enrichItems = async (items: any[]): Promise<InstaMintNFTItem[]> => {
  const contract = await getContract();

  const results = await Promise.all(
    items.map(async (i) => {
      try {
        const tokenURI: string = await contract.tokenURI(i.tokenId);
        const gatewayURI = getGatewayURI(tokenURI);

        const response = await fetch(gatewayURI);
        if (!response.ok) throw new Error("Failed to fetch metadata");

        const metadata = await response.json();
        const imageURL = getGatewayURI(metadata.image);

        return {
          tokenId: Number(i.tokenId),
          tokenURI,
          seller: i.seller,
          owner: i.owner,
          metadata: {
            name: metadata.name ?? "Unnamed NFT",
            description: metadata.description ?? "",
            image: imageURL,
            price: i.price ? ethers.formatEther(i.price) : undefined,
            attributes: metadata.attributes || [],
          },
        } as InstaMintNFTItem;
      } catch (err) {
        console.error(`Error processing token ${i.tokenId}:`, err);
        return null;
      }
    })
  );

  return results.filter((item): item is InstaMintNFTItem => item !== null);
};

// ---- Provider ----

export const InstaMintProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const chain = wallet?.getChain();
  const networkSwitcher = useNetworkSwitcherModal();

  const [marketNFTs, setMarketNFTs] = useState<InstaMintNFTItem[]>([]);
  const [myNFTs, setMyNFTs] = useState<InstaMintNFTItem[]>([]);

  const currentChainId = chain?.id;

  // Auto-switch to Etherlink Testnet
  useEffect(() => {
    if (!account?.address) return;

    const switchNetwork = async () => {
      if (currentChainId !== EtherlinkTestnet.id) {
        await networkSwitcher.open({
          client: thirdWebClient,
          theme: "light",
          sections: [{ label: "Required Network", chains: [EtherlinkTestnet] }],
        });
      }
    };

    switchNetwork();
  }, [account, currentChainId, networkSwitcher]);

  const fetchMarketNFTs = useCallback(async () => {
    try {
      if (!account || currentChainId !== EtherlinkTestnet.id) return;
      const contract = await getContract();
      const marketItems = await contract.fetchMarketItems();
      const enriched = await enrichItems(marketItems);
      setMarketNFTs(enriched.reverse());
    } catch (err) {
      console.error("Error loading Market NFTs:", err);
    }
  }, [account, currentChainId]);

  const fetchMyNFTs = useCallback(async () => {
    try {
      if (!account || currentChainId !== EtherlinkTestnet.id) return;
      const contract = await getContract();
      const ownedItems = await contract.fetchMyNFTs();
      const enriched = await enrichItems(ownedItems);
      setMyNFTs(enriched.reverse());
    } catch (err) {
      console.error("Error loading My NFTs:", err);
    }
  }, [account, currentChainId]);

  // Load data on mount & refresh every 15s
  useEffect(() => {
    if (!account) return;

    let isMounted = true;

    const loadAll = async () => {
      if (!isMounted) return;
      await fetchMarketNFTs();
      await fetchMyNFTs();
    };

    loadAll();
    const interval = setInterval(loadAll, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [account, fetchMarketNFTs, fetchMyNFTs]);

  return (
    <InstaMintContext.Provider
      value={{ marketNFTs, myNFTs, fetchMarketNFTs, fetchMyNFTs }}
    >
      {children}
    </InstaMintContext.Provider>
  );
};
