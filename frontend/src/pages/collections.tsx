/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import DefaultLayout from "@/components/layout";
import { SectionWrapper } from "@/styles/common-styles";
import LeftSideDetail from "@/components/ExplorePage/LeftSideDetails";
import RightSideGrid from "@/components/ExplorePage/RightSideCardsGrid";

const dummyNFTs = Array.from({ length: 200 }, (_, i) => {
  const id = (i + 1).toString();
  return {
    id,
    title: `NFT #${id}`,
    image: `https://picsum.photos/seed/nft${id}/400/400`,
  };
});

const Collections = () => {
  const [selectedNFT, setSelectedNFT] = useState<any | null>(null);

  const handleCardClick = (item: any) => {
    setSelectedNFT(item);
  };

  const handleCloseDetail = () => {
    setSelectedNFT(null);
  };

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
        <RightSideGrid items={dummyNFTs} onCardClick={handleCardClick} />
      </SectionWrapper>
    </DefaultLayout>
  );
};

export default Collections;
