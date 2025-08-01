/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import DefaultLayout from "@/components/layout";
import {
  PrimaryButton,
  SecondaryButton,
  SectionWrapper,
} from "@/styles/common-styles";
import LeftSideDetail from "@/components/ExplorePage/LeftSideDetails";
import RightSideGrid from "@/components/ExplorePage/RightSideCardsGrid";
import { useInstaMint } from "@/context/InstaMintNfts";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Skeleton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import MintModal from "@/components/modals/MintModal";

const MyCollections = () => {
  const router = useRouter();
  const { myNFTs, fetchMyNFTs } = useInstaMint(); // your NFTs
  const [selectedNFT, setSelectedNFT] = useState<any | null>(null);
  const [isLoadingNFTDetail, setIsLoadingNFTDetail] = useState(false);
  const [isMintOpen, setMintOpen] = useState(false);

  const handleCardClick = async (item: any) => {
    setIsLoadingNFTDetail(true);
    let nftDetails = null;

    try {
      const res = await fetch(`/api/nft/${item.id}`);
      if (res.ok) {
        const data = await res.json();
        nftDetails = data.nft;
      }
    } catch (err: any) {
      console.error("Backend fetch error:", err.message || err);
    }

    if (!nftDetails || !nftDetails.metadata?.image) {
      try {
        const fullNft = myNFTs.find((nft) => nft.tokenId === item.id);
        if (fullNft?.tokenURI) {
          const tokenURI = fullNft.tokenURI;
          const gatewayURI = `https://ipfs.io/ipfs/${tokenURI.slice(7)}`;
          const metadataRes = await fetch(gatewayURI);

          if (metadataRes.ok) {
            const metadata = await metadataRes.json();
            const imageUrl = metadata.image?.startsWith("ipfs://")
              ? `https://ipfs.io/ipfs/${metadata.image.slice(7)}`
              : metadata.image;

            nftDetails = {
              tokenId: item.id,
              tokenURI,
              metadata: {
                name: metadata.name || "",
                description: metadata.description || "No description provided.",
                image: imageUrl,
                attributes: metadata.attributes || [],
              },
            };
          }
        }
      } catch (ipfsErr: any) {
        console.error("IPFS fetch error:", ipfsErr.message || ipfsErr);
      }
    }

    setSelectedNFT(nftDetails);
    setIsLoadingNFTDetail(false);
  };

  const handleCloseDetail = () => setSelectedNFT(null);

  const gridItems = myNFTs.map((nft) => ({
    id: nft.tokenId,
    title: nft.metadata?.name || "",
    image: nft.metadata?.image,
    description: nft.metadata?.description,
    tokenURI: nft.tokenURI,
  }));

  return (
    <>
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
          {myNFTs.length === 0 ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                p: 4,
              }}
            >
              <Typography variant="h5" sx={{ mb: 2, color: "#444" }}>
                You don’t own any NFTs yet
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: "#666" }}>
                Start minting or buying NFTs to see them here.
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                <PrimaryButton
                  sx={{ minWidth: "max-content !important" }}
                  onClick={() => router.push("/collections")}
                >
                  Explore NFTs
                </PrimaryButton>
                <SecondaryButton onClick={() => setMintOpen(true)}>
                  mint now
                </SecondaryButton>
              </Box>
            </Box>
          ) : (
            <>
              {selectedNFT ? (
                <LeftSideDetail
                  data={selectedNFT}
                  onClose={handleCloseDetail}
                  sx={{ width: "350px", flexShrink: 0 }}
                />
              ) : isLoadingNFTDetail ? (
                <Box
                  sx={{
                    width: "350px",
                    flexShrink: 0,
                    padding: 2,
                    borderRight: "1px solid #ddd",
                    backgroundColor: "#fff",
                    borderRadius: "20px",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    maxHeight: "calc(100vh - 100px)",
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={200}
                    sx={{ borderRadius: 2, mb: 2 }}
                  />
                  <Skeleton width="80%" height={30} sx={{ mb: 1 }} />
                  <Skeleton width="100%" height={60} sx={{ mb: 2 }} />
                  <Skeleton width="40%" height={20} sx={{ mb: 2 }} />
                  <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={50}
                    sx={{ borderRadius: 2 }}
                  />
                </Box>
              ) : null}

              <RightSideGrid
                items={gridItems}
                onCardClick={handleCardClick}
                loading={false}
                isDetailViewOpen={!!selectedNFT || isLoadingNFTDetail}
              />

              {isLoadingNFTDetail && !selectedNFT && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 100,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                    bgcolor: "rgba(255,255,255,0.8)",
                    borderRadius: "8px",
                  }}
                >
                  <CircularProgress />
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Loading NFT details...
                  </Typography>
                </Box>
              )}
            </>
          )}
        </SectionWrapper>
      </DefaultLayout>
      {isMintOpen && (
        <MintModal
          onClose={() => setMintOpen(false)}
          isMintModalOpen={isMintOpen}
        />
      )}
    </>
  );
};

export default MyCollections;
