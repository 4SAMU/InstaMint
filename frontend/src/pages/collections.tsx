// Collections.tsx (Updated)
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import DefaultLayout from "@/components/layout";
import { SectionWrapper } from "@/styles/common-styles";
import LeftSideDetail from "@/components/ExplorePage/LeftSideDetails";
import RightSideGrid from "@/components/ExplorePage/RightSideCardsGrid";
import { useInstaMint } from "@/context/InstaMintNfts";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress for a better loader
import { Box, Skeleton, Typography } from "@mui/material";

const Collections = () => {
  const { marketNFTs } = useInstaMint();
  const [selectedNFT, setSelectedNFT] = useState<any | null>(null);
  const [isLoadingNFTDetail, setIsLoadingNFTDetail] = useState(false); // Renamed loading state for clarity

  const handleCardClick = async (item: any) => {
    setIsLoadingNFTDetail(true); // Indicate that a detail is being loaded
    let nftDetails = null;

    // 1. First, try to fetch from your backend (existing logic)
    try {
      const res = await fetch(`/api/nft/${item.id}`);
      if (res.ok) {
        const data = await res.json();
        nftDetails = data.nft;
        // console.log("Fetched from backend:", nftDetails);
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
        const fullNftFromContext = marketNFTs.find(
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

          const imageUrl = metadata.image?.startsWith("ipfs://")
            ? `https://ipfs.io/ipfs/${metadata.image.slice(7)}`
            : metadata.image;

          nftDetails = {
            tokenId: item.id,
            tokenURI: tokenURI,
            metadata: {
              name: metadata.name || "",
              description: metadata.description || "No description provided.",
              image: imageUrl,
              attributes: metadata.attributes || [],
            },
            price: item.price || fullNftFromContext.metadata?.price || "N/A",
          };

          console.log("Fetched from IPFS:", nftDetails);

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
        alert("Could not load NFT details. Please try again later.");
      }
    }

    setSelectedNFT(nftDetails);
    // Only set loading to false AFTER the data is retrieved and set.
    // If nftDetails is null here, it means the fetch failed, so we should also stop loading.
    setIsLoadingNFTDetail(false);
  };

  const handleCloseDetail = () => {
    setSelectedNFT(null);
  };

  const gridItems = marketNFTs.map((nft) => ({
    id: nft.tokenId,
    title: nft.metadata?.name || "",
    image: nft.metadata?.image,
    description: nft.metadata?.description,
    price: nft.metadata?.price,
    tokenURI: nft.tokenURI,
    owner: nft.owner,
    seller: nft.seller,
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
        {/*
          Conditionally render LeftSideDetail or its skeleton/loader.
          The skeleton for LeftSideDetail will show when isLoadingNFTDetail is true AND selectedNFT is null (initial click state).
          Once selectedNFT is populated, LeftSideDetail will render, and then isLoadingNFTDetail can be false.
        */}
        {
          selectedNFT ? ( // If selectedNFT has data, show the detail view
            <LeftSideDetail
              data={selectedNFT}
              onClose={handleCloseDetail}
              sx={{ width: "350px", flexShrink: 0 }}
            />
          ) : isLoadingNFTDetail ? ( // If loading a detail but none is selected yet (initial fetch)
            // You can show a skeleton for the LeftSideDetail here if you want
            <Box
              sx={{
                width: "350px", // Match the width of the actual LeftSideDetail
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
          ) : null // If no NFT selected and not loading, don't show anything on the left
        }

        <RightSideGrid
          nfts={gridItems}
          onCardClick={handleCardClick}
          // The loading prop here controls the skeletons for the grid itself.
          // If you want skeletons for the RightSideGrid ONLY when it's first loading ALL items,
          // you'd need a separate loading state for that.
          // For now, it will use the isLoadingNFTDetail state which makes sense if
          // clicking an item temporarily makes the whole grid "loading" while the detail loads.
          // However, if you want only the detail to show a loader, remove 'loading={isLoadingNFTDetail}'
          // and manage the initial grid load separately.
          loading={false} // Show RightSideGrid skeletons only if loading a detail and no detail is selected yet
          // This might be better if you only want the R-side to show skeletons
          // *before* the L-side is populated.
          isDetailViewOpen={!!selectedNFT || isLoadingNFTDetail} // Also consider it "open" visually while loading
        />

        {/* Removed this global loading spinner, as we're managing it more granularly */}
        {/*
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
        */}

        {/* A central loading spinner when the detail is being fetched, before LeftSideDetail has data */}
        {isLoadingNFTDetail && !selectedNFT && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 100, // Make sure it's above other content
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
      </SectionWrapper>
    </DefaultLayout>
  );
};

export default Collections;
