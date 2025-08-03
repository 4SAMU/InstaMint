import React, { useState, useEffect } from "react";
import {
  OutlinedButton,
  PrimaryButton,
  SecondaryButton,
  SectionWrapper,
} from "@/styles/common-styles";
import { Avatar, Box } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import EastIcon from "@mui/icons-material/East";
import MintModal from "../modals/MintModal";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import toast from "react-hot-toast";

const sectionStyles = {
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: "80px",
  minHeight: "500px",
  background: "linear-gradient(to bottom, #e7a300, #ffffff)",

  ".left_content": {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "400px",

    ".buttons_wrapper": {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: "20px",
    },
  },

  ".phone_section": {
    display: "flex",
    flexDirection: "column",
    height: "480px",
    width: "280px",
    border: "2px solid #000000",
    borderRadius: "20px",
    padding: "20px",

    ".profile": {
      display: "flex",
      alignItems: "center",
      gap: "5px",

      ".avatar": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        border: "1px solid #000000",
      },

      ".name": {
        fontSize: "16px",
        fontWeight: 500,
      },
    },

    ".image_placeholder": {
      marginTop: "10px",
      borderRadius: "2px",
      background: "red",
      height: "250px",
      width: "100%",

      img: {
        width: "100%",
        height: "250px",
        objectFit: "cover",
        borderRadius: "2px",
      },
    },

    ".price": {
      fontSize: "16px",
      fontWeight: 600,
      marginTop: "5px",
    },

    ".reactions": {
      display: "flex",
      gap: "20px",
      marginTop: "10px",

      ".likes, .comments": {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        fontSize: "15px",
      },
    },
  },
  "@media (max-width: 1535px)": {
    padding: "80px 8% 0 8%",
  },

  "@media (max-width: 599px)": {
    padding: "80px 5% 0 5%",
    flexDirection: "column",
    gap: "50px",
  },
};

const HeroSection = () => {
  const router = useRouter();
  const [isMintOpen, setMintOpen] = useState(false);
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [pendingRedirect, setPendingRedirect] = useState(false);
  const [connectTimeout, setConnectTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleExploreCollections = () => {
    if (!isConnected) {
      toast.error("Please connect wallet to view collectibles");
      setPendingRedirect(true);

      const timeout = setTimeout(() => {
        openConnectModal?.();
      }, 2500);

      setConnectTimeout(timeout);
      return;
    }
    router.push("/collections");
  };

  // cleanup if user cancels (wallet still not connected)
  useEffect(() => {
    if (!pendingRedirect) return;

    // if after 10s they haven’t connected, cancel
    const cancelTimer = setTimeout(() => {
      setPendingRedirect(false);
    }, 10000);

    return () => clearTimeout(cancelTimer);
  }, [pendingRedirect]);

  // auto redirect when connected
  useEffect(() => {
    if (pendingRedirect && isConnected) {
      router.push("/collections");
      setPendingRedirect(false);
      if (connectTimeout) clearTimeout(connectTimeout);
    }
  }, [pendingRedirect, isConnected, router, connectTimeout]);

  return (
    <>
      <SectionWrapper sx={sectionStyles}>
        <Box className="left_content">
          <h1>Own the Moment. Mint Instantly. Earn Forever.</h1>
          <p>
            InstaMint lets you transform everyday images into valuable digital
            assets, minted instantly on <i>Etherlink</i>. Start earning whenever
            fans collect your creations.
          </p>
          <Box className="buttons_wrapper">
            <PrimaryButton
              className="mint-button"
              onClick={() => setMintOpen(true)}
            >
              Start Minting
            </PrimaryButton>
            <OutlinedButton
              className="explore-collection"
              onClick={handleExploreCollections}
            >
              Explore Collections&nbsp;&nbsp;
              <EastIcon />
            </OutlinedButton>
          </Box>
        </Box>

        <Box className="phone_section">
          <Box className="profile">
            <Box className="avatar">
              <Avatar
                alt="Remy Traveler"
                src="/assets/hiker.webp"
                sx={{ width: 35, height: 35 }}
              />
            </Box>
            <Box className="name">Remy Traveler</Box>
          </Box>

          <Box className="image_placeholder">
            <img src="/assets/Beaches_for_Everyone_dadc6885a5.avif" alt="NFT" />
          </Box>

          <Box className="reactions">
            <Box className="likes">
              <FavoriteBorderIcon />
              12k
            </Box>
            <Box className="comments">
              <ChatBubbleOutlineIcon />
              5000
            </Box>
          </Box>

          <p className="price">12 XTZ</p>
          <SecondaryButton sx={{ mt: "10px" }}>Buy</SecondaryButton>
        </Box>
      </SectionWrapper>
      {isMintOpen && (
        <MintModal
          isMintModalOpen={isMintOpen}
          onClose={() => setMintOpen(false)}
        />
      )}
    </>
  );
};

export default HeroSection;
