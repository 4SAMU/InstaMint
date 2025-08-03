/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Typography,
  ClickAwayListener,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  InnerModal,
  ModalWrapper,
  PrimaryButton,
  StyledTextField,
} from "@/styles/common-styles";
import { useAuth } from "@/context/AuthContext";
import { useActiveAccount } from "thirdweb/react";
import WalletConnectModal from "./WalletConnect";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  isMintModalOpen?: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  isMintModalOpen,
}) => {
  const account = useActiveAccount();
  const currentAddress = account ? account.address : undefined;
  const { login, register, loading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async () => {
    setLocalLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        onClose();
      } else {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          name: formData.name,
          // walletAddress: address || "",
        });

        setSuccess("Registration successful! You are now logged in.");
        setFormData({
          username: "",
          name: "",
          email: "",
          password: "",
        });
        onClose(); // Close modal after successful registration
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLocalLoading(false);
    }
  };

  const switchAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ ...formData, password: "" });
    setError("");
    setSuccess("");
  };

  if (!open) return null;

  return (
    <ModalWrapper>
      <ClickAwayListener onClickAway={onClose}>
        <InnerModal
          sx={{
            position: "relative",
            left: isMintModalOpen ? "2%" : "unset",
            bottom: isMintModalOpen ? "5%" : "unset",
            transform: isMintModalOpen ? "translateX(50)" : "unset",
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            {isLogin ? "Login" : "Register"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {!isLogin && (
              <>
                <StyledTextField
                  label="Username"
                  name="username"
                  value={formData.username}
                  fullWidth
                  margin="dense"
                  onChange={handleChange}
                  required
                />
                <StyledTextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  fullWidth
                  margin="dense"
                  onChange={handleChange}
                />
              </>
            )}
            <StyledTextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              fullWidth
              margin="dense"
              onChange={handleChange}
              required
            />
            <StyledTextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              fullWidth
              margin="dense"
              onChange={handleChange}
              required
            />

            {!account ? (
              <WalletConnectModal />
            ) : (
              <Typography
                sx={{
                  mt: 1,
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1976d2",
                  textAlign: "center",
                }}
              >
                Wallet: {currentAddress?.slice(0, 6)}...
                {currentAddress?.slice(-4)}
              </Typography>
            )}

            <PrimaryButton
              sx={{ mt: 2, fontWeight: 600 }}
              onClick={handleSubmit}
              disabled={authLoading || localLoading}
            >
              {authLoading || localLoading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : isLogin ? (
                "Login"
              ) : (
                "Register"
              )}
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
                  ":hover": { textDecoration: "underline" },
                },
              }}
            >
              {isLogin ? (
                <>
                  Don&#39;t have an account?
                  <span onClick={switchAuthMode}>Register</span>
                </>
              ) : (
                <>
                  Already have an account?
                  <span onClick={switchAuthMode}>Login</span>
                </>
              )}
            </Typography>
          </div>
        </InnerModal>
      </ClickAwayListener>
    </ModalWrapper>
  );
};

export default AuthModal;
