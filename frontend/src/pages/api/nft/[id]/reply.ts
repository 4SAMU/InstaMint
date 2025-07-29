import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { NFT } from "@/models/NFT";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    await connectToDatabase();

    const { parentId, author, text } = req.body;
    const { id } = req.query;

    if (!parentId || !author || !text)
      return res.status(400).json({ message: "Missing fields" });

    const nft = await NFT.findById(id);
    if (!nft) return res.status(404).json({ message: "NFT not found" });

    const parentComment = nft.comments.id(parentId);
    if (!parentComment)
      return res.status(404).json({ message: "Parent comment not found" });

    parentComment.replies.push({ author, text });
    await nft.save();

    res.status(201).json({ success: true, comments: nft.comments });
  } catch (error) {
    console.error("Add Reply Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
