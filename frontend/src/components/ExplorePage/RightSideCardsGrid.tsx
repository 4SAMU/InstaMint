/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Masonry from "react-masonry-css";
import { SecondaryButton } from "@/styles/common-styles";
import { ethers } from "ethers";
import { ContractAddress } from "@/config/contract-address";
import { InstaMintABI } from "@/config/instamint-abi";
import toast from "react-hot-toast";

interface RightSideGridProps {
  items: any[];
  onCardClick: (item: any) => void;
  loading?: boolean;
  isDetailViewOpen: boolean;
}

const RightSideGrid: React.FC<RightSideGridProps> = ({
  items,
  onCardClick,
  loading = false,
  isDetailViewOpen,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

  //handleBuy nft
  const handleBuy = async (e: React.MouseEvent, nft: any) => {
    e.stopPropagation(); // prevent triggering onCardClick

    try {
      const signer = await getSigner();
      const contract = new ethers.Contract(
        ContractAddress,
        InstaMintABI,
        signer
      );
      const price = ethers.parseUnits(nft.price.toString(), "ether");
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });
      const txHash = await transaction.wait();
      console.log(txHash);
      toast.success("buying this nft");
    } catch (error) {
      console.error(error);
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
      {!loading && items.length > 0 && (
        <Masonry
          breakpointCols={currentBreakpointColumns}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {items.map((item) => (
            <Box
              key={item.id || item.tokenId}
              sx={{ cursor: "pointer", mb: 2, position: "relative" }}
              onClick={() => onCardClick(item)}
              onMouseEnter={() => setHoveredId(item.id || item.tokenId)}
              onMouseLeave={() => setHoveredId(null)}
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

              {hoveredId === (item.id || item.tokenId) && (
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
                      Price: {item.price} XTZ
                    </Typography>
                    <SecondaryButton
                      sx={{ width: "max-content" }}
                      onClick={(e) => handleBuy(e, item)}
                    >
                      Buy
                    </SecondaryButton>
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </Masonry>
      )}
    </Box>
  );
};

export default RightSideGrid;
