import { styled } from "@mui/material";

export const NavbarWrapper = styled("header")(() => ({
  display: "flex",
  flexDirection: "row",
  padding: "10px 50px 10px 400px",
  justifyContent: "space-between",
  alignItems: "center",
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
  "@media (max-width: 1535px)": {
    padding: "20px 8%",
  },
}));

// XP Container
export const XpContainer = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "linear-gradient(135deg, #E2913D, #000000)",
  borderRadius: "25px",
  padding: "4px 12px",
  color: "white",
  fontWeight: "bold",
  boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
}));

// XP Badge Circle
export const XpBadge = styled("div")(() => ({
  background: "white",
  color: "#000",
  fontSize: "14px",
  fontWeight: 700,
  borderRadius: "50%",
  width: "28px",
  height: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "inset 0 0 6px rgba(0,0,0,0.2)",
}));
