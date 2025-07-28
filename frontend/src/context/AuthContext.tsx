/* eslint-disable @typescript-eslint/no-explicit-any */
// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  walletAddress?: string | null;
}

interface DecodedToken {
  exp: number; // token expiry timestamp in seconds
  userId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    name?: string;
    walletAddress?: string;
  }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // On first load, check if token is valid
  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const expiry = localStorage.getItem("tokenExpiry");

        if (token && expiry) {
          const now = Date.now() / 1000;
          if (Number(expiry) > now) {
            const res = await axios.get("/api/auth/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data.user);
          } else {
            // expired
            localStorage.removeItem("token");
            localStorage.removeItem("tokenExpiry");
          }
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
      } finally {
        setLoading(false);
      }
    };
    checkInitialAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const token = res.data.token;
      const decoded: DecodedToken = jwtDecode(token);

      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiry", decoded.exp.toString());

      setUser(res.data.user);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    password: string;
    name?: string;
    walletAddress?: string;
  }) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/register", data);
      const token = res.data.token;
      const decoded: DecodedToken = jwtDecode(token);

      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiry", decoded.exp.toString());

      setUser(res.data.user);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    router.push("/login");
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("tokenExpiry");

    if (!token || !expiry) return false;

    const now = Date.now() / 1000;
    if (Number(expiry) <= now) {
      logout();
      return false;
    }

    try {
      const res = await axios.get("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.valid;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
