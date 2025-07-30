import { Box, styled } from "@mui/material";

export const FeaturedCards = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  flexWrap: "wrap",
  marginTop: "20px",
  "@media (max-width: 599px)": {
    justifyContent: "center",
  },

  ".the_card": {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "260px",
    minHeight: "300px",
    cursor: "pointer",

    ".image": {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      width: "260px",
      height: "300px",
      borderRadius: "8px",
      position: "relative",
      overflow: "hidden", // Important for inner border radius

      img: {
        width: "260px",
        height: "300px",
        borderRadius: "8px",
        objectFit: "cover",
      },

      ".likes_count, .comments_count": {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        fontSize: "14px",
        gap: "5px",
        svg: {
          fontSize: "22px",
        },
      },

      ".overlay": {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "50px",
        display: "flex",
        alignItems: "center",
        padding: "0 10px",
        gap: "20px",
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
        background:
          "linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))", // fade up
        backdropFilter: "blur(6px)", // glass blur
        WebkitBackdropFilter: "blur(6px)",
        color: "#fff",
        fontSize: "14px",
        zIndex: 1,
      },
    },

    ".content": {
      ".title": {
        display: "flex",
        fontWeight: "600",
        fontSize: "16px",
      },
      ".description": {
        display: "flex",
        fontWeight: "400",
        fontSize: "14px",
        marginTop: "5px",
      },
    },
  },
}));
