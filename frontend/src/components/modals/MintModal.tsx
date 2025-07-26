import React, { useState } from "react";
import { Typography, ClickAwayListener } from "@mui/material";
import {
  InnerModal,
  ModalWrapper,
  SecondaryButton,
  StyledTextField,
  UploadPreview,
} from "@/styles/common-styles";

interface MintModalProps {
  onClose: () => void;
}

const MintModal: React.FC<MintModalProps> = ({ onClose }) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!image || !description || !price) {
      alert("Please fill all required fields.");
      return;
    }

    // Mint logic
    console.log({ image, title, description, price });
    onClose();
  };

  return (
    <ModalWrapper>
      <ClickAwayListener onClickAway={onClose}>
        <InnerModal>
          <Typography variant="h5" fontWeight={600}>
            Mint Your Image
          </Typography>

          <input
            type="file"
            accept="image/*"
            id="mint-upload"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <label htmlFor="mint-upload">
            <UploadPreview>
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Typography color="#aaa">Click to upload image</Typography>
              )}
            </UploadPreview>
          </label>

          <StyledTextField
            label="Title (optional)"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />

          <StyledTextField
            label="Caption / Description *"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
            multiline
          />

          <StyledTextField
            label="Price (ETH) *"
            variant="outlined"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            required
          />

          <SecondaryButton
            sx={{
              borderRadius: "30px",
              padding: "10px 16px",
              fontWeight: 600,
            }}
            onClick={handleSubmit}
          >
            Mint Now
          </SecondaryButton>
        </InnerModal>
      </ClickAwayListener>
    </ModalWrapper>
  );
};

export default MintModal;
