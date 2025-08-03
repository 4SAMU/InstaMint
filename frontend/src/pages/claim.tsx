import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useXp } from "@/context/XpContext";
import DefaultLayout from "@/components/layout";
import { SecondaryButton, SectionWrapper } from "@/styles/common-styles";

const ClaimPage: React.FC = () => {
  const { xp, loading } = useXp();

  return (
    <DefaultLayout>
      <SectionWrapper
        sx={{
          flexDirection: "row",
          position: "relative",
          minHeight: "calc(100vh - 80px)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "500px",
            background: "linear-gradient(to bottom, #e7a300, #ffffff)",
            zIndex: -1,
          },
        }}
      >
        <Box
          sx={{
            mx: "auto",
            mt: 8,
            p: 4,
            border: "1px solid #ddd",
            borderRadius: "12px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            background: "#fff",
            height: "600px",
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Claim Your XP
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Current XP:{" "}
            <strong>{loading ? <CircularProgress size={14} /> : xp}</strong>
          </Typography>

          <Typography
            variant="body2"
            color="orange"
            sx={{ mb: 2, fontStyle: "italic" }}
          >
            🚧 Claiming XP rewards is coming soon! Stay tuned.
          </Typography>

          {/* Disabled Claim Button */}
          <SecondaryButton
            disabled
            sx={{
              mb: 5,
              width: "200px",
              background: "gray !important",
              color: "#fff !important",
              cursor: "not-allowed",
            }}
          >
            Coming Soon
          </SecondaryButton>

          {/* XP Rewards Table */}
          <Typography variant="h5" gutterBottom fontWeight="bold">
            How You Earn XP
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Action</strong>
                  </TableCell>
                  <TableCell>
                    <strong>XP Earned</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Notes</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Mint NFT</TableCell>
                  <TableCell>15 XP</TableCell>
                  <TableCell>
                    Highest of the three since minting contributes new content
                    to the platform.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Buy NFT</TableCell>
                  <TableCell>10 XP</TableCell>
                  <TableCell>
                    Moderate reward; buying supports creators and drives
                    marketplace activity.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Resell NFT</TableCell>
                  <TableCell>5 XP</TableCell>
                  <TableCell>
                    Lowest reward; reselling maintains liquidity but adds less
                    new value.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </SectionWrapper>
    </DefaultLayout>
  );
};

export default ClaimPage;
