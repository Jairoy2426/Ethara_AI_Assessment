import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITask extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string | null;
  project_id: Types.ObjectId;
  assigned_to: Types.ObjectId | null;
  created_by: Types.ObjectId;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  due_date: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    assigned_to: { type: Schema.Types.ObjectId, ref: "User", default: null },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    due_date: { type: Date, default: null }
  },
  { timestamps: true }
);

taskSchema.index({ project_id: 1 });
taskSchema.index({ assigned_to: 1 });

export const Task = mongoose.model<ITask>("Task", taskSchema);
