// models/NFT.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReply extends Document {
  id: string;
  user: Types.ObjectId;
  username: string;
  text: string;
  createdAt?: Date;
}

export interface IComment extends Document {
  id: string;
  user: Types.ObjectId;
  username: string;
  text: string;
  createdAt?: Date;
  replies?: Types.DocumentArray<IReply>;
}

export interface INFT extends Document {
  _id: Types.ObjectId;
  tokenId: string;
  tokenURI: string;
  metadata: any;
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  txHash?: string;
  comments?: Types.DocumentArray<IComment>;
  likes?: Types.ObjectId[]; // 👈 new field for likes
  createdAt: Date;
  updatedAt: Date;
}

// Replies schema
const ReplySchema = new Schema<IReply>(
  {
    id: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

// Comments schema
const CommentSchema = new Schema<IComment>(
  {
    id: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
    replies: [ReplySchema],
  },
  { timestamps: true }
);

// NFT schema
const NFTSchema = new Schema<INFT>(
  {
    tokenId: { type: String, required: true, unique: true },
    tokenURI: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, required: true },
    title: { type: String },
    description: { type: String },
    price: { type: Number },
    imageUrl: { type: String },
    txHash: { type: String },
    comments: [CommentSchema],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const NFT =
  mongoose.models.NFT || mongoose.model<INFT>("NFT", NFTSchema);
