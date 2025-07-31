/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import DefaultLayout from "@/components/layout";
import { SectionWrapper } from "@/styles/common-styles";
import LeftSideDetail from "@/components/ExplorePage/LeftSideDetails";
import RightSideGrid from "@/components/ExplorePage/RightSideCardsGrid";
import { useInstaMint } from "@/context/InstaMintNfts";

const Collections = () => {
  const { instaMintNFTitems } = useInstaMint();
  const [selectedNFT, setSelectedNFT] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCardClick = async (item: any) => {
    setLoading(true);
    let nftDetails = null;

    // 1. First, try to fetch from your backend (existing logic)
    try {
      const res = await fetch(`/api/nft/${item.id}`);
      if (res.ok) {
        const data = await res.json();
        nftDetails = data.nft;
        console.log("Fetched from backend:", nftDetails);
      } else {
        console.warn(
          `Backend fetch failed for token ID ${item.id}: ${res.status}. Attempting IPFS fallback.`
        );
      }
    } catch (err: any) {
      console.error("Error fetching from backend:", err.message || err);
      console.warn(`Attempting IPFS fallback for token ID ${item.id}.`);
    }

    // 2. If backend fetch failed or data is incomplete, fetch from IPFS
    if (!nftDetails || !nftDetails.metadata || !nftDetails.metadata.image) {
      try {
        // Find the full NFT object from context using tokenId
        const fullNftFromContext = instaMintNFTitems.find(
          (nft) => nft.tokenId === item.id
        );

        if (fullNftFromContext && fullNftFromContext.tokenURI) {
          const tokenURI = fullNftFromContext.tokenURI;
          const gatewayURI = `https://ipfs.io/ipfs/${tokenURI.slice(7)}`;
          const metadataRes = await fetch(gatewayURI);

          if (!metadataRes.ok)
            throw new Error(
              `Failed to fetch metadata from IPFS: ${metadataRes.status}`
            );

          const metadata = await metadataRes.json();

          // Construct the image URL from IPFS metadata
          const imageUrl = metadata.image?.startsWith("ipfs://")
            ? `https://ipfs.io/ipfs/${metadata.image.slice(7)}`
            : metadata.image;

          nftDetails = {
            tokenId: item.id,
            tokenURI: tokenURI,
            metadata: {
              name: metadata.name || "Untitled NFT",
              description: metadata.description || "No description provided.",
              image: imageUrl,
              // You might want to add other attributes from metadata if they are relevant for display
              attributes: metadata.attributes || [],
            },
            // Assuming price isn't directly in IPFS metadata,
            // you might need to get it from your context or adjust how it's stored.
            // For now, if the backend fetch failed, price might be missing.
            // You could potentially pass the price from `item` if it's available there.
            price: item.price || fullNftFromContext.metadata?.price || "N/A",
          };

          console.log("Fetched from IPFS:", nftDetails);

          // Optional: Attempt to save to backend if it was missing
          // This helps to "repair" your backend data.
          try {
            await fetch("/api/nft/save", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                tokenId: nftDetails.tokenId,
                tokenURI: nftDetails.tokenURI,
                metadata: nftDetails.metadata,
              }),
            });
            console.log("Successfully backfilled NFT data to backend.");
          } catch (backfillErr) {
            console.error(
              "Error backfilling NFT data to backend:",
              backfillErr
            );
          }
        } else {
          console.warn(
            `TokenURI not found in context for token ID ${item.id}. Cannot fetch from IPFS.`
          );
        }
      } catch (ipfsErr: any) {
        console.error("Error fetching from IPFS:", ipfsErr.message || ipfsErr);
        // If both backend and IPFS fail, then we genuinely can't get the data.
        // You might want to show an error message to the user.
        alert("Could not load NFT details. Please try again later.");
      }
    }

    setSelectedNFT(nftDetails);
    setLoading(false);
  };

  const handleCloseDetail = () => {
    setSelectedNFT(null);
  };

  // Transform context items into what RightSideGrid expects
  const gridItems = instaMintNFTitems.map((nft) => ({
    id: nft.tokenId, // matches the API's tokenId
    title: nft.metadata?.name || "Untitled", // Use optional chaining
    image: nft.metadata?.image, // Use optional chaining
    description: nft.metadata?.description, // Use optional chaining
    price: nft.metadata?.price, // Add price if available in context
    tokenURI: nft.tokenURI, // Ensure tokenURI is passed down
  }));

  return (
    <DefaultLayout>
      <SectionWrapper
        sx={{
          flexDirection: "row",
          position: "relative",
          minHeight: "calc(100vh - 80px)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "500px",
            background: "linear-gradient(to bottom, #e7a300, #ffffff)",
            zIndex: -1,
          },
        }}
      >
        {selectedNFT && (
          <LeftSideDetail data={selectedNFT} onClose={handleCloseDetail} />
        )}

        <RightSideGrid items={gridItems} onCardClick={handleCardClick} />

        {loading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <p>Loading NFT...</p>
          </div>
        )}
      </SectionWrapper>
    </DefaultLayout>
  );
};

export default Collections;
