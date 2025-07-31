/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { NFT } from "@/models/NFT";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    const { id } = req.query;
    console.log("🔎 Fetching NFT with tokenId:", id);

    // Only search by tokenId
    const nft = await NFT.findOne({ tokenId: String(id) });

    if (!nft) {
      return res
        .status(404)
        .json({ success: false, message: `NFT not found for tokenId: ${id}` });
    }

    return res.status(200).json({ success: true, nft });
  } catch (error: any) {
    console.error("❌ Get NFT Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}
