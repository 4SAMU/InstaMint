/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import DefaultLayout from "@/components/layout";
import {
  PrimaryButton,
  SecondaryButton,
  SectionWrapper,
} from "@/styles/common-styles";
import { useInstaMint } from "@/context/InstaMintNfts";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import MintModal from "@/components/modals/MintModal";
import ResellModal from "@/components/modals/ResellModal"; // 👈 import modal
import Masonry from "react-masonry-css";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { ContractAddress } from "@/config/contract-address";
import { InstaMintABI } from "@/config/instamint-abi";
import { useAuth } from "@/context/AuthContext";
import { useXp } from "@/context/XpContext";

const MyCollections = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { addXp } = useXp();
  const { address: currentAddress } = useAccount();
  const { myNFTs, fetchMarketNFTs, fetchMyNFTs } = useInstaMint();

  const [isMintOpen, setMintOpen] = useState(false);
  const [resellOpen, setResellOpen] = useState(false); // 👈 modal state
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const gridItems = myNFTs.map((nft) => ({
    id: nft.tokenId,
    title: nft.metadata?.name || "",
    image: nft.metadata?.image,
    description: nft.metadata?.description,
    price: nft.metadata?.price || "N/A",
    seller: nft.seller,
    owner: nft.owner,
  }));

  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const getSigner = async () => {
    if (!window.ethereum) throw new Error("MetaMask not detected");
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider.getSigner();
  };

  const handleResell = async (newPrice: string) => {
    if (!selectedNFT) return;
    setLoading(true);

    try {
      const signer = await getSigner();
      const contract = new ethers.Contract(
        ContractAddress,
        InstaMintABI,
        signer
      );

      const listingPrice = await contract.getListingPrice();
      const price = ethers.parseUnits(newPrice.toString(), "ether");

      const transaction = await contract.resellToken(selectedNFT.id, price, {
        value: listingPrice,
      });

      toast.loading("Resell transaction in progress...");
      const receipt = await transaction.wait();

      toast.dismiss();
      if (receipt.status === 1) {
        toast.success("NFT listed for resale successfully 🎉");
        await Promise.all([fetchMarketNFTs(), fetchMyNFTs()]);
        if (user) {
          const res = await addXp(user?._id || user?.id, "resell");
          console.log("add Xp on resell", res);
        }
      } else {
        toast.error("Transaction failed. Please try again.");
      }
    } catch (error: any) {
      toast.dismiss();
      console.error("Sell error:", error);

      if (error?.code === "ACTION_REJECTED" || error?.code === 4001) {
        toast.error("You rejected the transaction");
      } else {
        toast.error(
          error?.message || "Something went wrong while reselling NFT."
        );
      }
    } finally {
      setLoading(false);
    }
  };

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
                  Mint Now
                </SecondaryButton>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                flex: 1,
                padding: 2,
                overflowY: "auto",
                height: "calc(100vh - 80px)",
              }}
            >
              <Masonry
                breakpointCols={breakpointColumns}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {gridItems.map((item: any) => (
                  <Box
                    key={item.id}
                    sx={{
                      cursor: "default",
                      mb: 2,
                      position: "relative",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title || "NFT Image"}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                    />

                    {/* Gradient Overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "end",
                        gap: 1,
                        height: "50%",
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0))",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#fff",
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography sx={{ color: "#fff", fontWeight: 500 }}>
                        {item.price} XTZ
                      </Typography>

                      {item.owner?.toLowerCase() ===
                        currentAddress?.toLowerCase() && (
                        <SecondaryButton
                          sx={{
                            mt: 1,
                            alignSelf: "flex-start",
                            backgroundColor: "rgba(255,255,255,0.1)",
                            color: "#fff",
                            border: "1px solid rgba(255,255,255,0.3)",
                            ":hover": {
                              backgroundColor: "rgba(255,255,255,0.2)",
                            },
                            ":disabled": {
                              color: "#fff",
                            },
                          }}
                          onClick={() => {
                            setSelectedNFT(item);
                            setResellOpen(true);
                          }}
                        >
                          Resell
                        </SecondaryButton>
                      )}
                    </Box>
                  </Box>
                ))}
              </Masonry>
            </Box>
          )}
        </SectionWrapper>
      </DefaultLayout>

      {/* Mint Modal */}
      {isMintOpen && (
        <MintModal
          onClose={() => setMintOpen(false)}
          isMintModalOpen={isMintOpen}
        />
      )}

      {/* Resell Modal */}
      {resellOpen && (
        <ResellModal
          open={resellOpen}
          onClose={() => setResellOpen(false)}
          nft={selectedNFT}
          onResell={handleResell}
          loading={loading}
        />
      )}
    </>
  );
};

export default MyCollections;
