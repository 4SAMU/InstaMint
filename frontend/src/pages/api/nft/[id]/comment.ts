import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { NFT } from "@/models/NFT";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDatabase();
    const { id } = req.query;
    const { author, text } = req.body;

    if (!author || !text) {
      return res.status(400).json({ message: "Missing author or text" });
    }

    const nft = await NFT.findById(id);
    if (!nft) return res.status(404).json({ message: "NFT not found" });

    nft.comments.push({ author, text });
    await nft.save();

    return res.status(201).json({ success: true, comments: nft.comments });
  } catch (error) {
    console.error("Add Comment Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
