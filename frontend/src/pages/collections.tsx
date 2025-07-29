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
    try {
      const res = await fetch(`/api/nft/${item.id}`);
      if (!res.ok) throw new Error("Failed to fetch NFT");
      const nft = await res.json();
      setSelectedNFT(nft);
    } catch (err) {
      console.error("Error loading NFT:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedNFT(null);
  };

  // Transform context items into what RightSideGrid expects
  const gridItems = instaMintNFTitems.map((nft) => ({
    id: nft.tokenId,
    title: nft.metadata.name,
    image: nft.metadata.image,
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

        <RightSideGrid
          items={gridItems}
          onCardClick={(item: any) => handleCardClick(item)}
        />

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
