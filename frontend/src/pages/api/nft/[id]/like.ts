/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { NFT } from "@/models/NFT";
import { User } from "@/models/User";
import { Types } from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    const { id: nftId } = req.query;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const nft = await NFT.findById(nftId);
    if (!nft) return res.status(404).json({ message: "NFT not found" });

    const userExists = await User.findById(userId);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const alreadyLiked = nft.likes?.some(
      (like: any) => like.toString() === userId
    );

    if (alreadyLiked) {
      // Unlike
      nft.likes = nft.likes?.filter((like: any) => like.toString() !== userId);
    } else {
      // Like
      nft.likes?.push(new Types.ObjectId(userId));
    }

    await nft.save();

    return res.status(200).json({
      success: true,
      likesCount: nft.likes?.length || 0,
      liked: !alreadyLiked,
    });
  } catch (error: any) {
    console.error("Like Error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
