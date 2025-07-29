/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { NFT } from "@/models/NFT";
import { verifyToken } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    await connectToDatabase();

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const decoded: any = verifyToken(token);
    if (!decoded) return res.status(401).json({ message: "Invalid token" });

    const { nftId, text, parentCommentId } = req.body;
    if (!nftId || !text) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const nft = await NFT.findById(nftId);
    if (!nft) return res.status(404).json({ message: "NFT not found" });

    const newComment = {
      _id: new Date().getTime().toString(),
      user: decoded.userId,
      text,
      replies: [],
      createdAt: new Date(),
    };

    if (parentCommentId) {
      // Recursive helper
      const addReplyRecursive = (comments: any[]): boolean => {
        for (const comment of comments) {
          if (comment._id.toString() === parentCommentId) {
            comment.replies.push(newComment);
            return true;
          }
          if (addReplyRecursive(comment.replies)) return true;
        }
        return false;
      };

      const added = addReplyRecursive(nft.comments);
      if (!added) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
    } else {
      nft.comments.push(newComment);
    }

    await nft.save();
    res.status(200).json({ success: true, nft });
  } catch (error) {
    console.error("Comment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
