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

    const { tokenId, tokenURI, seller, owner, metadata } = req.body;

    if (!tokenId || !tokenURI || !seller || !owner || !metadata) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const nft = await NFT.create({
      tokenId,
      tokenURI,
      seller,
      owner,
      metadata,
    });

    res.status(201).json({ success: true, nft });
  } catch (error) {
    console.error("Save NFT Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
