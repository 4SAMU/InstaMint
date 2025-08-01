/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import dns from "dns";

// Force Google DNS (helps avoid ETIMEOUT issues)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000, // retry fail after 5s
        connectTimeoutMS: 10000, // allow DNS up to 10s
        socketTimeoutMS: 45000, // keep socket alive 45s
        serverApi: {
          version: "1",
          strict: true,
          deprecationErrors: true,
        },
      })
      .then(async (mongoose) => {
        const db = mongoose.connection.db;
        if (db) {
          try {
            await db.admin().command({ ping: 1 });
            console.log(
              "✅ Pinged MongoDB deployment. Connected successfully!"
            );
          } catch (pingError) {
            console.error("⚠️ Ping failed:", (pingError as Error).message);
          }
        }
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // reset so it can retry later
    throw err;
  }

  return cached.conn;
}
