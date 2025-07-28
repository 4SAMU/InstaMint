import type { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "@/lib/auth";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, email, password, name, walletAddress } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await connectToDatabase(); // connect once per request

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(422).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      name: name || "",
      password: hashedPassword,
      walletAddress: walletAddress || null,
    });

    return res.status(201).json({
      message: "User created",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        walletAddress: newUser.walletAddress,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
