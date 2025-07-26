import React, { useState } from "react";
import { NavbarWrapper } from "./style";
import { Box } from "@mui/material";
import {
  OutlinedButton,
  PrimaryButton,
  TextButton,
} from "@/styles/common-styles";
import MintModal from "../modals/MintModal";
import AuthModal from "../modals/AuthModal"; // ⬅️ Make sure this path is correct
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const [isMintOpen, setMintOpen] = useState(false);
  const [isAuthOpen, setAuthOpen] = useState(false);

  const handleConnectWallet = () => {
    // Replace with actual wallet connection logic
    console.log("Connect wallet clicked");
  };

  return (
    <>
      <NavbarWrapper>
        <Box className="logo" onClick={() => router.push("/")}>
          InstaMint
        </Box>

        <Box className="buttons">
          <TextButton>Explore</TextButton>
          <TextButton onClick={() => setMintOpen(true)}>Mint</TextButton>
          <TextButton>My Collections</TextButton>
          <OutlinedButton
            sx={{
              padding: "2px 25px",
              ":hover": {
                background: "#36270390",
                color: "white",
                border: "1px solid white",
              },
            }}
          >
            get started
          </OutlinedButton>
          <PrimaryButton onClick={() => setAuthOpen(true)}>
            Login / Sign Up
          </PrimaryButton>
        </Box>
      </NavbarWrapper>

      {isMintOpen && <MintModal onClose={() => setMintOpen(false)} />}

      {/* 🔓 AuthModal integration */}
      <AuthModal
        open={isAuthOpen}
        onClose={() => setAuthOpen(false)}
        onConnectWallet={handleConnectWallet}
      />
    </>
  );
};

export default Navbar;
