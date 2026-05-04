import { AppError } from "../utils/errors";
import { Task } from "../models/Task";
import { ProjectMember } from "../models/ProjectMember";
import { User } from "../models/User";

type TaskInput = {
  title: string;
  description?: string;
  assignedTo?: string | null;
  status?: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
  dueDate?: string | null;
};

type TaskUpdate = {
  title?: string;
  description?: string;
  assignedTo?: string | null;
  status?: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
  dueDate?: string | null;
};

const ensureAssigneeIsMember = async (
  projectId: string,
  userId: string
) => {
  const member = await ProjectMember.findOne({
    project_id: projectId,
    user_id: userId
  });
  if (!member) {
    throw new AppError(400, "Assignee must be a project member");
  }
};

const populateTask = async (taskDoc: any) => {
  const assigneeDoc = taskDoc.assigned_to
    ? await User.findById(taskDoc.assigned_to).select("name email")
    : null;
  const creatorDoc = await User.findById(taskDoc.created_by).select(
    "name email"
  );

  return {
    id: taskDoc._id.toString(),
    title: taskDoc.title,
    description: taskDoc.description,
    projectId: taskDoc.project_id.toString(),
    assignedTo: taskDoc.assigned_to?.toString() ?? null,
    createdBy: taskDoc.created_by.toString(),
    status: taskDoc.status,
    priority: taskDoc.priority,
    dueDate: taskDoc.due_date,
    createdAt: taskDoc.createdAt,
    updatedAt: taskDoc.updatedAt,
    assignee: assigneeDoc
      ? {
          id: assigneeDoc._id.toString(),
          name: assigneeDoc.name,
          email: assigneeDoc.email
        }
      : null,
    creator: creatorDoc
      ? {
          id: creatorDoc._id.toString(),
          name: creatorDoc.name,
          email: creatorDoc.email
        }
      : null
  };
};

export const createTask = async (
  userId: string,
  projectId: string,
  data: TaskInput
) => {
  if (data.assignedTo) {
    await ensureAssigneeIsMember(projectId, data.assignedTo);
  }

  const task = await Task.create({
    title: data.title,
    description: data.description ?? null,
    project_id: projectId,
    assigned_to: data.assignedTo ?? null,
    created_by: userId,
    status: data.status ?? "todo",
    priority: data.priority ?? "medium",
    due_date: data.dueDate ?? null
  });

  return populateTask(task);
};

export const listTasks = async (projectId: string) => {
  const tasks = await Task.find({ project_id: projectId }).sort({
    createdAt: -1
  });


  const userIds = new Set<string>();
  tasks.forEach((t) => {
    if (t.assigned_to) userIds.add(t.assigned_to.toString());
    userIds.add(t.created_by.toString());
  });

  const users = await User.find({
    _id: { $in: Array.from(userIds) }
  }).select("name email");
  const userMap = new Map(users.map((u) => [u._id.toString(), u]));

  return tasks.map((t) => {
    const assignee = t.assigned_to
      ? userMap.get(t.assigned_to.toString())
      : null;
    const creator = userMap.get(t.created_by.toString());
    return {
      id: t._id.toString(),
      title: t.title,
      description: t.description,
      projectId: t.project_id.toString(),
      assignedTo: t.assigned_to?.toString() ?? null,
      createdBy: t.created_by.toString(),
      status: t.status,
      priority: t.priority,
      dueDate: t.due_date,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      assignee: assignee
        ? {
            id: assignee._id.toString(),
            name: assignee.name,
            email: assignee.email
          }
        : null,
      creator: creator
        ? {
            id: creator._id.toString(),
            name: creator.name,
            email: creator.email
          }
        : null
    };
  });
};

export const getTask = async (projectId: string, taskId: string) => {
  const task = await Task.findOne({ _id: taskId, project_id: projectId });
  if (!task) {
    throw new AppError(404, "Task not found");
  }
  return populateTask(task);
};

export const updateTask = async (
  projectId: string,
  taskId: string,
  data: TaskUpdate
) => {
  if (data.assignedTo) {
    await ensureAssigneeIsMember(projectId, data.assignedTo);
  }

  const updateFields: Record<string, any> = {};
  if (data.title !== undefined) updateFields.title = data.title;
  if (data.description !== undefined)
    updateFields.description = data.description;
  if (data.assignedTo !== undefined) updateFields.assigned_to = data.assignedTo;
  if (data.status !== undefined) updateFields.status = data.status;
  if (data.priority !== undefined) updateFields.priority = data.priority;
  if (data.dueDate !== undefined) updateFields.due_date = data.dueDate;

  const task = await Task.findOneAndUpdate(
    { _id: taskId, project_id: projectId },
    updateFields,
    { new: true }
  );

  if (!task) {
    throw new AppError(404, "Task not found");
  }

  return populateTask(task);
};

export const updateTaskStatus = async (
  projectId: string,
  taskId: string,
  status: "todo" | "in_progress" | "done"
) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, project_id: projectId },
    { status },
    { new: true }
  );
  if (!task) {
    throw new AppError(404, "Task not found");
  }
  return populateTask(task);
};

export const deleteTask = async (projectId: string, taskId: string) => {
  const result = await Task.findOneAndDelete({
    _id: taskId,
    project_id: projectId
  });
  if (!result) {
    throw new AppError(404, "Task not found");
  }
};

export const isTaskAssignee = async (taskId: string, userId: string) => {
  const task = await Task.findOne({ _id: taskId, assigned_to: userId });
  return !!task;
};
