import { Box, Button, styled, TextField } from "@mui/material";

export const PrimaryButton = styled(Button)(() => ({
  textTransform: "none",
  background: "#000000",
  color: "white",
  fontWeight: "500",
  borderRadius: "20px",
  padding: "0px 20px",
  transition: "all 0.3s ease-in-out",
  border: "1px solid transparent",
  height: "40px",

  ":hover": {
    background: "#302b03",
    border: "1px solid #e7a300",
  },
}));

export const SecondaryButton = styled(Button)(() => ({
  textTransform: "none",
  background: "#0bda49ff",
  color: "white",
  borderRadius: "20px",
  minHeight: "35px",
  padding: "5px 20px",
  fontWeight: "500",
  transition: "all 0.3s ease-in-out",
  height: "40px",
  width: "100%",
}));

export const TextButton = styled(Button)(() => ({
  textTransform: "none",
  color: "#000000",
  fontSize: "16px",
  fontWeight: "500",
  height: "40px",
  ":after": {
    content: "''",
    position: "absolute",
    width: "100%",
    height: "1px",
    bottom: "0",
    left: "0",
    backgroundColor: "#000000",
    transformOrigin: "bottom right",
    transition: "transform 0.3s ease-in-out",
    transform: "scaleX(0)",
  },

  ":hover:after": {
    transform: "scaleX(1)",
    transformOrigin: "bottom left",
  },

  "&.active:after": {
    transform: "scaleX(1)",
    transformOrigin: "bottom left",
  },
}));

export const OutlinedButton = styled(Button)(() => ({
  textTransform: "none",
  color: "#000000",
  fontSize: "16px",
  fontWeight: "500",
  border: "1px solid #000000",
  borderRadius: "20px",
  transition: "all 0.3s ease-in-out",
  padding: "5px 10px",
  width: "100%",
  height: "40px",
  maxWidth: "fit-content",
  svg: {
    transition: "transform 0.3s ease-in-out",
  },
  ":hover": {
    background: "#e7a30090",
    svg: {
      transform: "scale(1.1)",
    },
  },
}));

export const SectionWrapper = styled("section")(() => ({
  position: "relative",
  display: "flex",
  minHeight: "200px",
  padding: "0 400px",
  width: "100vw",

  h1: {
    fontSize: "28px",
    fontWeight: "600",
  },
  h2: {
    fontSize: "22px",
    fontWeight: "600",
  },
  h3: {
    fontSize: "20px",
    fontWeight: "500",
  },
  p: {
    fontSize: "16px",
    fontWeight: "400",
    lineHeight: "24px",
  },

  "@media (max-width: 1535px)": {
    padding: "0 15%",
  },
  "@media (max-width: 899px)": {
    padding: "0 8%",
  },
}));

// Reusable input
export const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
  },
}));

// Reusable modal background
export const ModalWrapper = styled(Box)(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 9999,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

// Reusable modal content box
export const InnerModal = styled(Box)(() => ({
  backgroundColor: "#fff",
  borderRadius: "16px",
  padding: "24px",
  minWidth: "350px",
  maxWidth: "420px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
}));

// Optional: Upload image preview box
export const UploadPreview = styled(Box)(() => ({
  height: "200px",
  borderRadius: "12px",
  border: "2px dashed #ccc",
  backgroundColor: "#f9f9f9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  overflow: "hidden",
}));
