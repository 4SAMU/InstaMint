import { lightTheme, Theme } from "@rainbow-me/rainbowkit";

export const myCustomTheme: Theme = {
  ...lightTheme(),
  colors: {
    ...lightTheme().colors,
    accentColor: "#000000",
    accentColorForeground: "#ffffff",
  },
  radii: {
    ...lightTheme().radii,
    actionButton: "20px",
    connectButton: "20px",
    menuButton: "10px",
    modal: "20px",
    modalMobile: "20px",
  },
  fonts: {
    body: '"Inter", sans-serif',
  },
};
