/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Masonry from "react-masonry-css";
import { SecondaryButton } from "@/styles/common-styles";
import { ethers } from "ethers";
import { ContractAddress } from "@/config/contract-address";
import { InstaMintABI } from "@/config/instamint-abi";
import toast from "react-hot-toast";
import { useInstaMint } from "@/context/InstaMintNfts";
import { useAccount } from "wagmi";

interface RightSideGridProps {
  nfts: any[];
  onCardClick: (item: any) => void;
  loading?: boolean;
  isDetailViewOpen: boolean;
}

const RightSideGrid: React.FC<RightSideGridProps> = ({
  nfts,
  onCardClick,
  loading = false,
  isDetailViewOpen,
}) => {
  const { address: currentAddress } = useAccount();
  const { fetchMarketNFTs, fetchMyNFTs } = useInstaMint();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [buyingId, setBuyingId] = useState<string | null>(null);

  // set first item as active by default
  useEffect(() => {
    if (nfts.length > 0 && !activeId) {
      setActiveId(nfts[0].id || nfts[0].tokenId);
      onCardClick(nfts[0]);
    }
  }, [nfts, activeId, onCardClick]);

  const normalBreakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const detailViewBreakpointColumns = {
    default: 3,
    1100: 2,
    700: 2,
    500: 1,
  };

  const currentBreakpointColumns = isDetailViewOpen
    ? detailViewBreakpointColumns
    : normalBreakpointColumns;

  const getSigner = async () => {
    if (!window.ethereum) throw new Error("MetaMask not detected");
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider.getSigner();
  };

  // handleBuy nft
  const handleBuy = async (e: React.MouseEvent, nft: any) => {
    e.stopPropagation();
    setBuyingId(nft.id); // start loading

    try {
      const signer = await getSigner();
      const contract = new ethers.Contract(
        ContractAddress,
        InstaMintABI,
        signer
      );

      const price = ethers.parseUnits(nft.price.toString(), "ether");
      const transaction = await contract.createMarketSale(nft.id, {
        value: price,
      });

      toast.loading("Transaction in progress...");
      const receipt = await transaction.wait();

      if (receipt.status === 1) {
        toast.dismiss();
        toast.success("NFT purchased successfully 🎉");
        await Promise.all([fetchMarketNFTs(), fetchMyNFTs()]);
      } else {
        toast.dismiss();
        toast.error("Transaction failed. Please try again.");
      }
    } catch (error: any) {
      toast.dismiss();
      console.error("Buy error:", error);

      if (error?.code === "ACTION_REJECTED" || error?.code === 4001) {
        toast.error("You rejected transaction");
      } else {
        toast.error(error?.message || "Something went wrong while buying NFT.");
      }
    } finally {
      setBuyingId(null); // stop loading
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        padding: 2,
        overflowY: "auto",
        height: "calc(100vh - 80px)",
      }}
    >
      {!loading && nfts.length > 0 && (
        <Masonry
          breakpointCols={currentBreakpointColumns}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {nfts.map((item) => {
            const itemId = item.id || item.tokenId;
            const isActive = activeId === itemId;
            const isHovered = hoveredId === itemId;
            const isBuying = buyingId === itemId;

            return (
              <Box
                key={itemId}
                sx={{
                  cursor: isBuying ? "not-allowed" : "pointer",
                  mb: 2,
                  position: "relative",
                  opacity: isBuying ? 0.9 : 1,
                }}
                onClick={() => {
                  if (!isBuying) {
                    setActiveId(itemId);
                    onCardClick(item);
                  }
                }}
                onMouseEnter={() => !isBuying && setHoveredId(itemId)}
                onMouseLeave={() => !isBuying && setHoveredId(null)}
              >
                <img
                  src={item.image}
                  alt={item.title || item.name || "NFT Image"}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 8,
                    display: "block",
                  }}
                />

                {(isHovered || isActive || isBuying) && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: "rgba(0,0,0,0.5)",
                      borderRadius: 2,
                      zIndex: 1,
                      padding: "10px",
                    }}
                  >
                    <Typography
                      className="title"
                      sx={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#fff",
                      }}
                    >
                      {item.title || item.name}
                    </Typography>

                    <Box
                      sx={{
                        position: "absolute",
                        bottom: "20px",
                        left: "10px",
                        right: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography className="price" sx={{ color: "#fff" }}>
                        {item.price} XTZ
                      </Typography>
                      {item.seller?.toLowerCase() !==
                        currentAddress?.toLowerCase() && (
                        <SecondaryButton
                          sx={{ width: "max-content", position: "relative" }}
                          onClick={(e) => handleBuy(e, item)}
                          disabled={isBuying}
                        >
                          {isBuying ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: "#fff" }}
                            />
                          ) : (
                            "Buy"
                          )}
                        </SecondaryButton>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            );
          })}
        </Masonry>
      )}
    </Box>
  );
};

export default RightSideGrid;
