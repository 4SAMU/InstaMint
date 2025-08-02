import React, { useState } from "react";
import { NavbarWrapper } from "./style";
import { Box } from "@mui/material";
import {
  OutlinedButton,
  PrimaryButton,
  TextButton,
} from "@/styles/common-styles";
import MintModal from "../modals/MintModal";
import AuthModal from "../modals/AuthModal";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useAppTour } from "@/context/TourContext";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const Navbar = () => {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { startTour, completed } = useAppTour();
  const { isLoggedIn } = useAuth();

  const [isMintOpen, setMintOpen] = useState(false);
  const [isAuthOpen, setAuthOpen] = useState(false);

  const handlePrimaryClick = () => {
    if (isLoggedIn) return;
    setAuthOpen(true);
  };

  return (
    <>
      <NavbarWrapper>
        <Box className="logo" onClick={() => router.push("/")}>
          InstaMint
        </Box>

        <Box className="buttons">
          <TextButton
            onClick={() => router.push("/collections")}
            className={router.pathname === "/collections" ? "active" : ""}
          >
            Explore
          </TextButton>

          <TextButton
            onClick={() => setMintOpen(true)}
            className={isMintOpen ? "active" : ""}
          >
            Mint
          </TextButton>

          <TextButton
            onClick={() => router.push("/my-collections")}
            className={router.pathname === "/my-collections" ? "active" : ""}
          >
            My Collections
          </TextButton>

          {router.pathname === "/" &&
            !completed &&
            !isConnected &&
            !isLoggedIn && (
              <OutlinedButton
                sx={{
                  padding: "2px 25px",
                  ":hover": {
                    background: "#36270390",
                    color: "white",
                    border: "1px solid white",
                  },
                }}
                onClick={() => startTour()}
              >
                Get Started
              </OutlinedButton>
            )}

          {isLoggedIn ? (
            <Box className="login-signup">
              <ConnectButton />
            </Box>
          ) : (
            <PrimaryButton
              className="login-signup"
              onClick={handlePrimaryClick}
            >
              Login / Sign Up
            </PrimaryButton>
          )}
        </Box>
      </NavbarWrapper>

      {isMintOpen && (
        <MintModal
          isMintModalOpen={isMintOpen}
          onClose={() => setMintOpen(false)}
        />
      )}

      <AuthModal open={isAuthOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;
