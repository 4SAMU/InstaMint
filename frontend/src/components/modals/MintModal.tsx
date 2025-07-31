/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Typography,
  ClickAwayListener,
  CircularProgress,
  Box,
} from "@mui/material";
import {
  InnerModal,
  ModalWrapper,
  PrimaryButton,
  SecondaryButton,
  StyledTextField,
  UploadPreview,
} from "@/styles/common-styles";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import { InstaMintABI } from "@/config/instamint-abi";
import toast from "react-hot-toast";
import { ContractAddress } from "@/config/contract-address";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";

interface MintModalProps {
  onClose: () => void;
  isMintModalOpen: boolean;
}

const MintModal: React.FC<MintModalProps> = ({ onClose, isMintModalOpen }) => {
  const { isConnected } = useAccount();
  const { isLoggedIn } = useAuth();
  const { openConnectModal } = useConnectModal();

  const [isAuthOpen, setAuthOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState("Please wait...");
  const [rejected, setRejected] = useState(false);

  const getSigner = async () => {
    if (!window.ethereum) throw new Error("MetaMask not detected");
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider.getSigner();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadAndMint = async () => {
    const trimmedDescription = description.slice(0, 250);

    const formData = new FormData();
    formData.append("file", image!);
    formData.append("name", title || "");
    formData.append("description", trimmedDescription);
    formData.append("price", price);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload API failed");
    const { tokenURI } = await res.json();
    return tokenURI as string;
  };

  const mintNFT = async (tokenURI: string, price: string) => {
    const signer = await getSigner();
    const contract = new ethers.Contract(ContractAddress, InstaMintABI, signer);

    const listingFeeWei = await contract.getListingPrice();
    const priceInWei = ethers.parseEther(price);

    const tx = await contract.createToken(tokenURI, priceInWei, {
      value: listingFeeWei,
    });

    const receipt = await tx.wait();

    const transferEvent = receipt.logs
      .map((log: any) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((parsed: any) => parsed && parsed.name === "Transfer");

    if (!transferEvent) throw new Error("No Transfer event found");
    const tokenId = transferEvent.args?.tokenId.toString();
    return { tx, tokenId };
  };

  const handleSubmit = async () => {
    setRejected(false);

    if (!image || !description || !price) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      ethers.parseEther(price);
    } catch {
      toast.error("Invalid price format");
      return;
    }

    setIsUploading(true);
    setUploadStep("Uploading to IPFS...");
    try {
      const tokenURI = await uploadAndMint();

      setUploadStep("Minting NFT on blockchain...");
      const { tokenId } = await mintNFT(tokenURI, price);

      setUploadStep("Saving metadata...");
      const gatewayURI = `https://ipfs.io/ipfs/${tokenURI.slice(7)}`;
      const metadataRes = await fetch(gatewayURI);
      const metadata = await metadataRes.json();

      const imageUrl = metadata.image?.startsWith("ipfs://")
        ? `https://ipfs.io/ipfs/${metadata.image.slice(7)}`
        : metadata.image;

      await fetch("/api/nft/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          tokenId,
          tokenURI,
          metadata: {
            name: title || metadata.name,
            description: description || metadata.description,
            image: imageUrl,
            price,
            attributes: metadata.attributes || [],
          },
        }),
      });

      setUploadStep("Finalizing...");
      toast.success(`NFT minted! Token ID: ${tokenId}`);
      onClose();
    } catch (err: any) {
      if (
        err.code === 4001 ||
        err.message?.toLowerCase().includes("user denied") ||
        err.message?.toLowerCase().includes("user rejected action")
      ) {
        toast("You cancelled the transaction", { icon: "❌" });
        setRejected(true);
      } else {
        toast.error(err.message ?? "Mint failed");
      }
      console.error("Error:", err);
    } finally {
      setIsUploading(false);
      setUploadStep("Please wait...");
    }
  };

  const renderForm = () => (
    <>
      <input
        type="file"
        accept="image/*"
        id="mint-upload"
        style={{ display: "none" }}
        onChange={handleImageChange}
        disabled={isUploading}
      />
      <label htmlFor="mint-upload">
        <UploadPreview>
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Typography color="#aaa">Click to upload image</Typography>
          )}
        </UploadPreview>
      </label>

      {/* Title max 35 chars */}
      <StyledTextField
        label="Title (optional)"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value.slice(0, 35))}
        fullWidth
        disabled={isUploading}
        helperText={`${title.length}/35 characters`}
        slotProps={{
          formHelperText: {
            style: {
              textAlign: "right",
              color: title.length === 35 ? "red" : "#888",
            },
          },
        }}
      />

      {/* Description max 250 chars */}
      <StyledTextField
        label="Description *"
        variant="outlined"
        value={description}
        onChange={(e) => setDescription(e.target.value.slice(0, 250))}
        fullWidth
        required
        multiline
        disabled={isUploading}
        helperText={`${description.length}/250 characters`}
        slotProps={{
          formHelperText: {
            style: {
              textAlign: "right",
              color: description.length === 250 ? "red" : "#888",
            },
          },
        }}
      />

      {/* Price */}
      <StyledTextField
        label="Price (XTZ) *"
        variant="outlined"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        fullWidth
        required
        onKeyDown={(e) => {
          if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
        }}
        sx={{
          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
            {
              WebkitAppearance: "none",
              margin: 0,
            },
        }}
        disabled={isUploading}
      />

      {/* Auth / Wallet / Mint Buttons */}
      {!isLoggedIn ? (
        <PrimaryButton onClick={() => setAuthOpen(true)}>
          Login / Signup
        </PrimaryButton>
      ) : !isConnected ? (
        <PrimaryButton onClick={openConnectModal}>Connect Wallet</PrimaryButton>
      ) : (
        <Box sx={{ display: "flex", gap: "10px", flexDirection: "column" }}>
          <SecondaryButton onClick={handleSubmit} disabled={isUploading}>
            {isUploading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} sx={{ color: "#ffffff" }} />
                <Typography variant="body2" color="#fff">
                  {uploadStep}
                </Typography>
              </Box>
            ) : (
              "Mint Now"
            )}
          </SecondaryButton>
          {rejected && !isUploading && (
            <PrimaryButton onClick={handleSubmit}>Retry</PrimaryButton>
          )}
        </Box>
      )}

      <AuthModal
        open={isAuthOpen}
        onClose={() => setAuthOpen(false)}
        isMintModalOpen={isMintModalOpen}
      />
    </>
  );

  return (
    <ModalWrapper>
      {isUploading ? (
        <InnerModal>
          <Typography variant="h5" fontWeight={600}>
            Mint Your Image
          </Typography>
          {renderForm()}
        </InnerModal>
      ) : (
        <ClickAwayListener onClickAway={onClose}>
          <InnerModal>
            <Typography variant="h5" fontWeight={600}>
              Mint Your Image
            </Typography>
            {renderForm()}
          </InnerModal>
        </ClickAwayListener>
      )}
    </ModalWrapper>
  );
};

export default MintModal;
