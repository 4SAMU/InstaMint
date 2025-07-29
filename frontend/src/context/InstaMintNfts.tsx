/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import { ContractAddress } from "@/config/contract-address";
import { InstaMintABI } from "@/config/instamint-abi";
import { useAccount } from "wagmi";

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
  instaMintNFTitems: InstaMintNFTItem[];
}

// context is created with undefined so we can detect missing provider
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
  const { isConnected } = useAccount();
  const [instaMintNFTitems, setInstaMintNFTItems] = useState<
    InstaMintNFTItem[]
  >([]);

  useEffect(() => {
    let isMounted = true;

    async function loadNFTs() {
      try {
        if (!isConnected) return;
        if (typeof window === "undefined" || !window.ethereum) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          ContractAddress,
          InstaMintABI,
          signer
        );

        const listed = await contract.fetchItemsListed();

        const enriched = await Promise.all(
          listed.map(async (i: any) => {
            try {
              const tokenURI = await contract.tokenURI(i.tokenId);

              if (!tokenURI.startsWith("ipfs://")) {
                console.log(
                  `Skipping token ${i.tokenId} (non-IPFS URI: ${tokenURI})`
                );
                return undefined;
              }

              const gatewayURI = `https://ipfs.io/ipfs/${tokenURI.slice(7)}`;
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
                  name: metadata.name,
                  description: metadata.description,
                  image: imageURL,
                  price: metadata.price,
                  attributes: metadata.attributes || [],
                },
              };
            } catch (err) {
              console.error(
                `Error processing token ${i.tokenId}:`,
                (err as Error).message
              );
              return undefined;
            }
          })
        );

        const validItems = enriched.filter(
          (item): item is InstaMintNFTItem => item !== undefined
        );

        if (isMounted) setInstaMintNFTItems(validItems);
      } catch (err) {
        console.error("Error loading NFTs:", err);
      }
    }

    loadNFTs(); // initial load
    const interval = setInterval(loadNFTs, 15000); // refresh every 15s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isConnected]);

  return (
    <InstaMintContext.Provider value={{ instaMintNFTitems }}>
      {children}
    </InstaMintContext.Provider>
  );
};
