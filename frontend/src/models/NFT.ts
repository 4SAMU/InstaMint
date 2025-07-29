// models/NFT.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReply {
  user: Types.ObjectId;
  text: string;
  createdAt?: Date;
}

export interface IComment {
  user: Types.ObjectId;
  text: string;
  createdAt?: Date;
  replies?: IReply[];
}

export interface INFT extends Document {
  tokenId: string;
  owner: Types.ObjectId;
  seller?: Types.ObjectId;
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  txHash?: string;
  comments?: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

// Replies schema
const ReplySchema = new Schema<IReply>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Comments schema
const CommentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    replies: [ReplySchema],
  },
  { _id: false }
);

// NFT schema
const NFTSchema = new Schema<INFT>(
  {
    tokenId: { type: String, required: true, unique: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String },
    description: { type: String },
    price: { type: Number },
    imageUrl: { type: String },
    txHash: { type: String },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

export const NFT =
  mongoose.models.NFT || mongoose.model<INFT>("NFT", NFTSchema);
