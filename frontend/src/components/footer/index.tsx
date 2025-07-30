// Footer.tsx
import { SectionWrapper } from "@/styles/common-styles";
import { Box } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <SectionWrapper
      sx={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "flex-start",
        background: "#f8f9fa",
        borderTop: "1px solid #ddd",
        gap: "2rem",
        "@media (min-width: 1536px)": {
          padding: "60px 400px",
        },
        "@media (max-width: 1535px)": {
          padding: "40px 8%",
        },

        a: {
          display: "flex",
          padding: "0 5px",
          ":hover": {
            textDecoration: "underline",
            textDecorationThickness: "2px",
            textUnderlineOffset: "4px",
          },
        },
      }}
    >
      <div className="footer-left">
        <h1>InstaMint</h1>
        <p>Own your moments. Mint them. Earn forever.</p>
      </div>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          ul: {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          },
        }}
      >
        <h4>Product</h4>
        <ul>
          <li>
            <a href="#how-it-works">How It Works</a>
          </li>
          <li>
            <a href="#explore">Explore</a>
          </li>
          <li>
            <a href="#mint">Mint Now</a>
          </li>
        </ul>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          ul: {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          },
        }}
      >
        <h4>Community</h4>
        <ul>
          <li>
            <a href="#creators">For Creators</a>
          </li>
          <li>
            <a href="#faq">FAQ</a>
          </li>
          <li>
            <a href="#support">Support</a>
          </li>
        </ul>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          ul: {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          },
        }}
      >
        <h4>Legal</h4>
        <ul>
          <li>
            <a href="#terms">Terms</a>
          </li>
          <li>
            <a href="#privacy">Privacy</a>
          </li>
        </ul>
      </Box>

      <div
        className="footer-bottom"
        style={{
          flexBasis: "100%",
          marginTop: "2rem",
          borderTop: "1px solid #ccc",
          paddingTop: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <p>&copy; {new Date().getFullYear()} InstaMint. All rights reserved.</p>
        <div className="social-icons" style={{ display: "flex", gap: "1rem" }}>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Footer;
