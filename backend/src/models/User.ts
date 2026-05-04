import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password_hash: string;
  role: "admin" | "member";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ["admin", "member"], default: "member" }
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });

export const User = mongoose.model<IUser>("User", userSchema);
