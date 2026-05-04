import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProject extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string | null;
  owner_id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    owner_id: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", projectSchema);
