import React from "react";
import { SectionWrapper } from "@/styles/common-styles";
import { Box, useTheme } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import TransformIcon from "@mui/icons-material/Transform";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";

const HowItWorks = () => {
  const theme = useTheme();

  return (
    <SectionWrapper
      sx={{
        padding: "100px 400px",
        flexDirection: "column",
        gap: "40px",
        "@media (max-width: 1535px)": {
          padding: "100px 15% 100px 15%",
        },
        "@media (max-width: 899px)": {
          padding: "100px 8% 100px 8%",
        },

        ".steps": {
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          gap: "30px",

          ".card_step": {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            padding: "30px",
            borderRadius: "8px",
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[1],
            transition: "transform 0.3s ease",

            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: theme.shadows[4],
            },

            svg: {
              fontSize: "38px",
              color: "#000000",
            },

            ".content": {
              textAlign: "center",
              ".title": {
                fontSize: "20px",
                fontWeight: "700",
                marginBottom: "10px",
                color: theme.palette.text.primary,
              },
              ".paragraph": {
                fontSize: "16px",
                fontWeight: "400",
                color: theme.palette.text.secondary,
              },
            },
          },
        },
      }}
    >
      <h2>How InstaMint Works</h2>

      <Box className="steps">
        <Box className="card_step">
          <AddPhotoAlternateIcon />
          <Box className="content">
            <h3 className="title">Share Your World</h3>
            <p className="paragraph">
              Post images like social media, but earn XP for every reaction. The
              more engagement you get, the more you earn.
            </p>
          </Box>
        </Box>

        <Box className="card_step">
          <TransformIcon />
          <Box className="content">
            <h3 className="title">Instant Digital Collectibles</h3>
            <p className="paragraph">
              With one tap, your content becomes a verifiable NFT on Etherlink.
              No complicated setup needed.
            </p>
          </Box>
        </Box>

        <Box className="card_step">
          <PriceCheckIcon />
          <Box className="content">
            <h3 className="title">Grow Your Value</h3>
            <p className="paragraph">
              Earn royalties on every sale while your XP grows with community
              engagement. Watch your creations appreciate.
            </p>
          </Box>
        </Box>
      </Box>
    </SectionWrapper>
  );
};

export default HowItWorks;
