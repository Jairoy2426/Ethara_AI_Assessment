import { Request, Response } from "express";
import { Task } from "../models/Task";
import { Project } from "../models/Project";
import { asyncHandler } from "../utils/asyncHandler";

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const taskDocs = await Task.find({ assigned_to: userId }).sort({
    due_date: 1
  });


  const projectIds = [...new Set(taskDocs.map((t) => t.project_id.toString()))];
  const projects = await Project.find({ _id: { $in: projectIds } }).select(
    "name"
  );
  const projectMap = new Map(
    projects.map((p) => [p._id.toString(), p.name])
  );

  const tasks = taskDocs.map((t) => ({
    id: t._id.toString(),
    title: t.title,
    description: t.description,
    projectId: t.project_id.toString(),
    project: {
      id: t.project_id.toString(),
      name: projectMap.get(t.project_id.toString()) ?? ""
    },
    assignedTo: t.assigned_to?.toString() ?? null,
    createdBy: t.created_by.toString(),
    status: t.status,
    priority: t.priority,
    dueDate: t.due_date,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt
  }));

  const now = new Date();
  const total = tasks.length;
  const done = tasks.filter((task) => task.status === "done").length;
  const overdue = tasks.filter(
    (task) => task.dueDate && new Date(task.dueDate) < now && task.status !== "done"
  );

  res.json({
    kpis: {
      total,
      done,
      overdue: overdue.length
    },
    myTasks: tasks,
    overdue
  });
});
