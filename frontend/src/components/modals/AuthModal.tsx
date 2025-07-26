// components/modals/AuthModal.tsx
import { Typography, ClickAwayListener } from "@mui/material";
import React, { useState } from "react";
import {
  InnerModal,
  ModalWrapper,
  PrimaryButton,
  SecondaryButton,
  StyledTextField,
} from "@/styles/common-styles";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onConnectWallet: () => void;
  walletAddress?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  onConnectWallet,
  walletAddress,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (isLogin) {
      // Handle login logic
    } else {
      // Handle register logic
    }
  };

  if (!open) return null;

  return (
    <ModalWrapper>
      <ClickAwayListener onClickAway={onClose}>
        <InnerModal>
          <Typography variant="h5" fontWeight={600}>
            {isLogin ? "Login" : "Register"}
          </Typography>

          <form style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <StyledTextField
              label="Username"
              name="username"
              fullWidth
              margin="dense"
              onChange={handleChange}
            />
            {!isLogin && (
              <>
                <StyledTextField
                  label="Name"
                  name="name"
                  fullWidth
                  margin="dense"
                  onChange={handleChange}
                />
                <StyledTextField
                  label="Email"
                  name="email"
                  fullWidth
                  margin="dense"
                  onChange={handleChange}
                />
              </>
            )}
            <StyledTextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="dense"
              onChange={handleChange}
            />

            <SecondaryButton
              sx={{ mt: 2, borderRadius: "15px", fontWeight: 600 }}
              onClick={onConnectWallet}
            >
              {walletAddress
                ? `Wallet: ${walletAddress.slice(0, 6)}...`
                : "Connect Wallet"}
            </SecondaryButton>

            <PrimaryButton
              sx={{ mt: 2, borderRadius: "15px", fontWeight: 600 }}
              onClick={handleSubmit}
            >
              {isLogin ? "Login" : "Register"}
            </PrimaryButton>

            <Typography
              sx={{
                mt: 1,
                textAlign: "center",
                fontSize: "14px",

                span: {
                  padding: "10px 2px",
                  color: "#1976d2",
                  cursor: "pointer",
                  fontWeight: 600,
                  ":hover": {
                    textDecoration: "underline",
                    textUnderlineOffset: "2px",
                  },
                },
              }}
            >
              {isLogin ? (
                <>
                  Don&#39;t have an account?
                  <span onClick={() => setIsLogin(false)}>Register</span>
                </>
              ) : (
                <>
                  Already have an account?
                  <span onClick={() => setIsLogin(true)}>Login</span>
                </>
              )}
            </Typography>
          </form>
        </InnerModal>
      </ClickAwayListener>
    </ModalWrapper>
  );
};

export default AuthModal;
