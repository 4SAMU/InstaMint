/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { NFT } from "@/models/NFT";
import { User } from "@/models/User";
import { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";

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
    const { commentId, text, userId } = req.body;

    if (!text || !userId || !commentId) {
      return res
        .status(400)
        .json({ message: "Missing text, userId, or commentId" });
    }

    const nft = await NFT.findById(nftId);
    if (!nft) return res.status(404).json({ message: "NFT not found" });

    const userDoc = await User.findById(userId).select("username");
    if (!userDoc) return res.status(404).json({ message: "User not found" });

    const newReply = {
      id: uuidv4(),
      user: new Types.ObjectId(userId),
      username: userDoc.username,
      text,
    };

    const parentComment = nft.comments.id(commentId);
    if (!parentComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    parentComment.replies.push(newReply);
    await nft.save();

    const populatedNFT = await NFT.findById(nftId)
      .populate("comments.user", "username name")
      .populate("comments.replies.user", "username name");

    return res.status(201).json({
      success: true,
      comments: populatedNFT?.comments,
    });
  } catch (error:any) {
    console.error("Add Reply Error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
