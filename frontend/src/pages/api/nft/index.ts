/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { NFT } from "@/models/NFT";
import { verifyToken } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  try {
    if (req.method === "GET") {
      // Get all NFTs
      const nfts = await NFT.find({});
      return res.status(200).json({ success: true, nfts });
    }

    if (req.method === "POST") {
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

      return res.status(201).json({ success: true, nft });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("NFT Index API Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
