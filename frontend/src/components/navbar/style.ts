import { styled } from "@mui/material";

export const NavbarWrapper = styled("header")(() => ({
  display: "flex",
  flexDirection: "row",
  padding: "20px 400px",
  justifyContent: "space-between",
  background: "#e7a300",
  width: "100vw",

  ".logo": {
    fontWeight: "600",
    fontSize: "24px",
    cursor: "pointer",
  },

  ".buttons": {
    display: "flex",
    flexDirection: "row",
    gap: "50px",
  },
}));
