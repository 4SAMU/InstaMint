import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { NFT } from "@/models/NFT";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    await connectToDatabase();

    // Disable caching
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const { id } = req.query;

    const nft = await NFT.findOne({ tokenId: id })
      .populate("owner", "username email")
      .populate({
        path: "comments.user",
        select: "username email",
        strictPopulate: false,
      });

    if (!nft) return res.status(404).json({ message: "NFT not found" });

    return res.status(200).json({ success: true, nft });
  } catch (error) {
    console.error("Get NFT Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
