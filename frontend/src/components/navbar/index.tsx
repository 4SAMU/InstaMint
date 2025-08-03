import React, { useState } from "react";
import { NavbarWrapper, XpContainer, XpBadge } from "./style";
import {
  Box,
  IconButton,
  Popover,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useXp } from "@/context/XpContext";
import { useActiveAccount } from "thirdweb/react";
import WalletConnectModal from "../modals/WalletConnect";

const Navbar = () => {
  const router = useRouter();
  const { xp } = useXp();
  const account = useActiveAccount();
  const { user, isLoggedIn, logout } = useAuth();
  const { startTour, completed } = useAppTour();

  const [isMintOpen, setMintOpen] = useState(false);
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePrimaryClick = () => {
    if (isLoggedIn) return;
    setAuthOpen(true);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const eligible = xp >= 100;

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

          {router.pathname === "/" && !completed && !account && !isLoggedIn && (
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
        </Box>

        {isLoggedIn ? (
          <Box className="login-signup">
            <WalletConnectModal blackButtonBg={true} />
          </Box>
        ) : (
          <PrimaryButton className="login-signup" onClick={handlePrimaryClick}>
            Login / Sign Up
          </PrimaryButton>
        )}

        {/* XP Counter + Account (whole group opens popover) */}
        <XpContainer onClick={handleOpenPopover} sx={{ cursor: "pointer" }}>
          <XpBadge>XP</XpBadge>
          <span style={{ fontSize: "16px" }}>{xp}</span>
          <IconButton sx={{ padding: "4px", color: "white" }}>
            <AccountCircleIcon />
          </IconButton>
        </XpContainer>
      </NavbarWrapper>

      {/* Popover with user details */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            p: 2,
            borderRadius: "12px",
            minWidth: "260px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
          },
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {user?.username || "Guest User"}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          <strong>Name:</strong> {user?.name || "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          <strong>Email:</strong> {user?.email || "Not logged in"}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Claim XP button with eligibility tag */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <TextButton
            onClick={() => {
              if (eligible) {
                router.push("/claim");
                handleClosePopover();
              }
            }}
            sx={{
              textAlign: "left",
              fontWeight: "bold",
              color: eligible ? "primary.main" : "text.disabled",
            }}
            disabled={!eligible}
          >
            Claim XP
          </TextButton>
          <Chip
            label={eligible ? "Eligible" : "Not Eligible"}
            color={eligible ? "success" : "default"}
            size="small"
          />
        </Box>

        {isLoggedIn ? (
          <PrimaryButton
            variant="contained"
            fullWidth
            sx={{ background: "#f5310fff", fontWeight: "bold" }}
            onClick={() => {
              logout();
              handleClosePopover();
            }}
          >
            Logout
          </PrimaryButton>
        ) : (
          <PrimaryButton
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              setAuthOpen(true);
              handleClosePopover();
            }}
          >
            Login / Sign Up
          </PrimaryButton>
        )}
      </Popover>

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
