import { Box } from "@mui/material";
import React from "react";
import Navbar from "../navbar";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <main>{children}</main>
    </Box>
  );
};

export default DefaultLayout;
