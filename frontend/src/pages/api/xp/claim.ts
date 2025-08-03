import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    const { userId, amount } = req.body;
    if (!userId || !amount) {
      return res.status(400).json({ error: "userId and amount are required" });
    }

    if (amount < 100) {
      return res.status(400).json({ error: "Minimum claim is 100 XP" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.xp < amount) {
      return res
        .status(400)
        .json({ error: "Not enough XP to claim this amount" });
    }

    // Deduct the claimed amount
    user.xp -= amount;
    await user.save();

    res.json({
      success: true,
      claimed: amount,
      remainingXp: user.xp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error claiming XP" });
  }
}
