/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { NFT } from "@/models/NFT";
import { verifyToken } from "@/lib/auth";

interface NFTRequest {
  tokenId: string;
  tokenURI: string;
  metadata: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const { tokenId, tokenURI, metadata }: NFTRequest = req.body;
    if (!tokenId || !tokenURI || !metadata) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["tokenId", "tokenURI", "metadata"],
      });
    }

    const existingNFT = await NFT.findOne({ tokenId });
    if (existingNFT) {
      return res.status(409).json({
        message: "NFT with this tokenId already exists",
        tokenId: existingNFT.tokenId,
      });
    }

    const nft = await NFT.create({ tokenId, tokenURI, metadata });

    return res.status(201).json({
      success: true,
      data: nft,
    });
  } catch (error: any) {
    console.error("Save NFT Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
