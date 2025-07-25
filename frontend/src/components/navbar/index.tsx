import React from "react";
import { NavbarWrapper } from "./style";
import { Box } from "@mui/material";
import {
  OutlinedButton,
  PrimaryButton,
  TextButton,
} from "@/styles/common-styles";

const Navbar = () => {
  return (
    <NavbarWrapper>
      <Box className="logo">InstaMint</Box>

      <Box className="buttons">
        <TextButton>Explore</TextButton>
        <TextButton>Mint</TextButton>
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
        <PrimaryButton>Connect Wallet</PrimaryButton>
      </Box>
    </NavbarWrapper>
  );
};

export default Navbar;
