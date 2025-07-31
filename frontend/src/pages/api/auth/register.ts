import type { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "@/lib/auth";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, email, password, name, walletAddress } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({
      message: "Missing required fields",
      details: {
        email: !email ? "Email is required" : undefined,
        password: !password ? "Password is required" : undefined,
        username: !username ? "Username is required" : undefined,
      },
    });
  }

  try {
    await connectToDatabase();

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(422).json({
        message: "User already exists",
        exists: {
          email: existingUser.email === email,
          username: existingUser.username === username,
        },
      });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      username,
      email,
      name: name || "",
      password: hashedPassword,
      walletAddress: walletAddress || null,
    });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "User created successfully",
      token,
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
