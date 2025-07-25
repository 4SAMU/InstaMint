import { Button, styled } from "@mui/material";

export const PrimaryButton = styled(Button)(() => ({
  textTransform: "none",
  background: "#000000",
  color: "white",
  fontWeight: "500",
  borderRadius: "20px",
  padding: "0px 20px",
  ontWeight: "500",
  transition: "all 0.3s ease-in-out",
  border: "1px solid transparent",

  ":hover": {
    background: "#302b03",
    border: "1px solid #e7a300",
  },
}));

export const SecondaryButton = styled(Button)(() => ({
  textTransform: "none",
  background: "#0bda49ff",
  color: "white",
  borderRadius: "5px",
  padding: "5px 20px",
  fontWeight: "500",
  transition: "all 0.3s ease-in-out",
}));

export const TextButton = styled(Button)(() => ({
  textTransform: "none",
  color: "#000000",
  fontSize: "16px",
  fontWeight: "500",
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
}));

export const OutlinedButton = styled(Button)(() => ({
  textTransform: "none",
  color: "#000000",
  fontSize: "16px",
  fontWeight: "500",
  border: "1px solid #000000",
  borderRadius: "20px",
  transition: "all 0.3s ease-in-out",
  ":hover": {
    background: "#e7a30090",
  },
}));

export const SectionWrapper = styled("section")(() => ({
  display: "flex",
  minHeight: "200px",
  padding: "0 400px",

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
}));
