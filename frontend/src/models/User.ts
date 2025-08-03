// models/User.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  name?: string;
  email: string;
  password: string;
  walletAddress?: string | null;
  xp: number; // displayed XP
  realXp: number; // backend-tracked XP
  instaEarned: number; // total INSTA earned
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    walletAddress: {
      type: String,
      default: null,
      sparse: true,
      match: [/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"],
    },
    xp: {
      type: Number,
      default: 0, // frontend displayed XP
    },
    realXp: {
      type: Number,
      default: 0, // backend audited XP
    },
    instaEarned: {
      type: Number,
      default: 0, // lifetime INSTA minted
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
