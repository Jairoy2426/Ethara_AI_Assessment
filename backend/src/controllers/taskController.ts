import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as taskService from "../services/taskService";

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.createTask(
    req.user!.id,
    req.params.projectId,
    req.body
  );
  res.status(201).json(task);
});

export const listTasks = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await taskService.listTasks(req.params.projectId);
  res.json(tasks);
});

export const getTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.getTask(
    req.params.projectId,
    req.params.taskId
  );
  res.json(task);
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.updateTask(
    req.params.projectId,
    req.params.taskId,
    req.body
  );
  res.json(task);
});

export const updateTaskStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const isAdmin = req.user?.role === "admin" || req.projectRole === "admin";
    const isAssignee = await taskService.isTaskAssignee(
      req.params.taskId,
      req.user!.id
    );
    if (!isAdmin && !isAssignee) {
      return res.status(403).json({ error: "Admin or assignee required" });
    }
    const task = await taskService.updateTaskStatus(
      req.params.projectId,
      req.params.taskId,
      req.body.status
    );
    res.json(task);
  }
);

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  await taskService.deleteTask(req.params.projectId, req.params.taskId);
  res.status(204).send();
});
