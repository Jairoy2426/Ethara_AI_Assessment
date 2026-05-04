import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProjectMember extends Document {
  _id: Types.ObjectId;
  project_id: Types.ObjectId;
  user_id: Types.ObjectId;
  role: "admin" | "member";
  added_at: Date;
}

const projectMemberSchema = new Schema<IProjectMember>(
  {
    project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    added_at: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

projectMemberSchema.index({ project_id: 1, user_id: 1 }, { unique: true });
projectMemberSchema.index({ user_id: 1 });

export const ProjectMember = mongoose.model<IProjectMember>(
  "ProjectMember",
  projectMemberSchema
);
