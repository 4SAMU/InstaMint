import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ valid: false });

    jwt.verify(token, process.env.JWT_SECRET as string);
    res.status(200).json({ valid: true });
  } catch {
    res.status(401).json({ valid: false });
  }
}
