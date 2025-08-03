// pages/api/xp/add.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

const XP_REWARDS: Record<string, number> = {
  mint: 15,
  buy: 10,
  resell: 5,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, action } = req.body;
    if (!userId || !action) {
      return res.status(400).json({ error: "userId and action are required" });
    }

    const points = XP_REWARDS[action];
    if (!points) {
      return res.status(400).json({ error: "Invalid action" });
    }

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.xp += points;
    await user.save();

    return res.status(200).json({ success: true, xp: user.xp });
  } catch (error) {
    console.error("Add XP error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
