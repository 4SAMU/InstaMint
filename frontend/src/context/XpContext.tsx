/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface XpContextProps {
  xp: number;
  claimable: number;
  loading: boolean;
  fetchXp: (userId: string) => Promise<number>;
  claimXp: (userId: string, amount: number) => Promise<number>;
  addXp: (userId: string, action: "mint" | "buy" | "resell") => Promise<number>;
}

const XpContext = createContext<XpContextProps | undefined>(undefined);

export const XpProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [xp, setXp] = useState<number>(0);
  const [claimable, setClaimable] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useAuth();

  const fetchXp = async (userId: string): Promise<number> => {
    try {
      setLoading(true);
      const res = await fetch(`/api/xp/get?userId=${userId}`);
      const data = await res.json();
      if (res.ok) {
        setXp(data.claimableXp || 0);
        return data.claimableXp || 0;
      }
      return xp;
    } catch (error) {
      console.error("Error fetching XP:", error);
      return xp;
    } finally {
      setLoading(false);
    }
  };

  const claimXp = async (userId: string, amount: number): Promise<number> => {
    try {
      setLoading(true);
      const res = await fetch(`/api/xp/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Claim failed");
      }

      const data = await res.json();
      setXp(data.remainingXp || 0);
      setClaimable(data.claimable || 0);
      return data.remainingXp || 0;
    } catch (error) {
      console.error("Error claiming XP:", error);
      return xp;
    } finally {
      setLoading(false);
    }
  };

  const addXp = async (
    userId: string,
    action: "mint" | "buy" | "resell"
  ): Promise<number> => {
    try {
      setLoading(true);
      const res = await fetch(`/api/xp/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Add XP failed");
      }

      const data = await res.json();
      setXp(data.xp || xp);
      return data.xp || xp;
    } catch (error) {
      console.error("Error adding XP:", error);
      return xp;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Automatically fetch XP when provider mounts & user changes
  useEffect(() => {
    if (user?._id || user?.id) {
      fetchXp(user._id || user.id);
    }
  }, [user?._id, user?.id]);

  return (
    <XpContext.Provider
      value={{
        xp,
        claimable,
        loading,
        fetchXp,
        claimXp,
        addXp,
      }}
    >
      {children}
    </XpContext.Provider>
  );
};

export const useXp = () => {
  const context = useContext(XpContext);
  if (!context) {
    throw new Error("useXp must be used within an XpProvider");
  }
  return context;
};
