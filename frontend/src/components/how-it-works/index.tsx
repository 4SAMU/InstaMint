import React from "react";
import { SectionWrapper } from "@/styles/common-styles";
import { Box, useTheme } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import TransformIcon from "@mui/icons-material/Transform";
import StarsIcon from "@mui/icons-material/Stars";
const HowItWorks = () => {
  const theme = useTheme();

  return (
    <SectionWrapper
      sx={{
        padding: "100px 400px",
        flexDirection: "column",
        gap: "40px",
        "@media (max-width: 1535px)": {
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
            <h3 className="title">Create and Mint</h3>
            <p className="paragraph">
              Share your photos like on social media and mint them instantly as
              NFTs with one tap.
            </p>
          </Box>
        </Box>

        <Box className="card_step">
          <TransformIcon />
          <Box className="content">
            <h3 className="title">Trade with Ease</h3>
            <p className="paragraph">
              Buy and resell NFTs directly in the app while growing your
              collection and supporting the marketplace.
            </p>
          </Box>
        </Box>

        <Box className="card_step">
          <StarsIcon />
          <Box className="content">
            <h3 className="title">Earn XP and Rewards</h3>
            <p className="paragraph">
              Minting, buying, and reselling give you XP. Once you reach 100 XP,
              you can claim INSTA tokens.
            </p>
          </Box>
        </Box>
      </Box>
    </SectionWrapper>
  );
};

export default HowItWorks;
