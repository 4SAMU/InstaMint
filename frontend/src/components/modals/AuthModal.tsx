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
  SecondaryButton,
  StyledTextField,
} from "@/styles/common-styles";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onConnectWallet: (address: string) => void;
  walletAddress?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  walletAddress,
  onConnectWallet,
}) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConnectWallet = async () => {
    try {
      // Replace with your actual wallet connection logic
      const address = "0x123..."; // Example address
      onConnectWallet(address);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to connect wallet");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        onClose();
      } else {
        await register({
          username: formData.username,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          walletAddress,
        });

        // Reset all form fields and switch to login mode
        setFormData({
          ...formData,
          password: "",
        });
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const switchAuthMode = () => {
    setIsLogin(!isLogin);
    // Clear password field when switching modes
    setFormData({ ...formData, password: "" });
  };

  if (!open) return null;

  return (
    <ModalWrapper>
      <ClickAwayListener onClickAway={onClose}>
        <InnerModal>
          <Typography variant="h5" fontWeight={600}>
            {isLogin ? "Login" : "Register"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {!isLogin && (
              <StyledTextField
                label="Username"
                name="username"
                value={formData.username}
                fullWidth
                margin="dense"
                onChange={handleChange}
                required
              />
            )}
            {!isLogin && (
              <StyledTextField
                label="Name"
                name="name"
                value={formData.name}
                fullWidth
                margin="dense"
                onChange={handleChange}
              />
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

            <SecondaryButton
              sx={{ mt: 2, borderRadius: "15px", fontWeight: 600 }}
              onClick={handleConnectWallet}
              disabled={loading}
            >
              {walletAddress
                ? `Wallet: ${walletAddress.slice(0, 6)}...${walletAddress.slice(
                    -4
                  )}`
                : "Connect Wallet"}
            </SecondaryButton>

            <PrimaryButton
              sx={{ mt: 2, borderRadius: "15px", fontWeight: 600 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
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
                  ":hover": {
                    textDecoration: "underline",
                  },
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
