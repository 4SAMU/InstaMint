/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Typography,
  ClickAwayListener,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  InnerModal,
  ModalWrapper,
  PrimaryButton,
  SecondaryButton,
  StyledTextField,
} from "@/styles/common-styles";

interface ResellModalProps {
  open: boolean;
  onClose: () => void;
  nft: any;
  onResell: (newPrice: string) => Promise<void>;
  loading: boolean;
}

const ResellModal: React.FC<ResellModalProps> = ({
  open,
  onClose,
  nft,
  onResell,
  loading,
}) => {
  const [newPrice, setNewPrice] = useState("");

  if (!open || !nft) return null;

  const handleSubmit = async () => {
    if (!newPrice) return;
    await onResell(newPrice);
    onClose();
  };

  return (
    <ModalWrapper>
      <ClickAwayListener onClickAway={onClose}>
        <InnerModal>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            Resell Memory(NFT)
          </Typography>

          {/* NFT Image */}
          <Box sx={{ width: "100%", mb: 2 }}>
            <img
              src={nft.image}
              alt={nft.title}
              style={{
                width: "100%",
                height: "200px",
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
          </Box>

          {/* Readonly Details */}
          <Typography variant="subtitle2" color="text.secondary">
            Title
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {nft.title}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary">
            Description
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {nft.description || "No description"}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary">
            Previous Price
          </Typography>
          <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>
            {nft.price} XTZ
          </Typography>

          {/* New Price Input */}
          <StyledTextField
            label="New Price (XTZ)"
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <SecondaryButton
              onClick={handleSubmit}
              disabled={loading || !newPrice}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={18} sx={{ color: "#fff" }} />
                  <Typography variant="body2" color="#fff">
                    Listing...
                  </Typography>
                </Box>
              ) : (
                "Confirm Resell"
              )}
            </SecondaryButton>
            <PrimaryButton onClick={onClose}>Cancel</PrimaryButton>
          </Box>
        </InnerModal>
      </ClickAwayListener>
    </ModalWrapper>
  );
};

export default ResellModal;
