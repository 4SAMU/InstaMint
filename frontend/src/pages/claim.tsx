/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useXp } from "@/context/XpContext";
import { useAuth } from "@/context/AuthContext";
import DefaultLayout from "@/components/layout";
import { SecondaryButton, SectionWrapper } from "@/styles/common-styles";

const ClaimPage: React.FC = () => {
  const { xp, claimXp, loading } = useXp();
  const { user } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  const handleClaim = async () => {
    if (!user) return;
    setClaiming(true);
    setMessage(null);
    try {
      const newXp = await claimXp(user._id || user.id, 100); // claim 100 XP
      setMessage(`✅ Successfully claimed 100 XP! Remaining XP: ${newXp}`);
    } catch (error: any) {
      setMessage("❌ Failed to claim XP. Please try again.");
      console.log(error);
    } finally {
      setClaiming(false);
    }
  };

  const eligible = xp >= 100;

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
            color={eligible ? "green" : "red"}
            sx={{ mb: 2 }}
          >
            Status:{" "}
            {eligible
              ? "✅ Eligible to claim rewards!"
              : "❌ Not eligible yet (need at least 100 XP)"}
          </Typography>

          {/* <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
            Each <strong>100 XP</strong> equals <strong>100 INSTA</strong>,
            pegged <strong>1:1 with XTZ</strong>. <br />
            Your balance: <strong>{xp} XP</strong> = <strong>{xp} INSTA</strong>{" "}
            = <strong>{xp} XTZ</strong>.
          </Typography> */}

          {message && (
            <Alert
              severity={message.startsWith("✅") ? "success" : "error"}
              sx={{ mb: 2 }}
            >
              {message}
            </Alert>
          )}

          <SecondaryButton
            onClick={handleClaim}
            disabled={!eligible || claiming}
            sx={{
              mb: 5,
              width: "200px",
              ":disabled": {
                background: "gray !important",
                color: "#fff",
              },
            }}
          >
            {claiming ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Claim 100 XP"
            )}
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
