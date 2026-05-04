import { AppError } from "../utils/errors";
import { Project } from "../models/Project";
import { ProjectMember } from "../models/ProjectMember";
import { Task } from "../models/Task";
import { User } from "../models/User";
import mongoose from "mongoose";

export const createProject = async (
  userId: string,
  data: { name: string; description?: string }
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [project] = await Project.create(
      [{ name: data.name, description: data.description ?? null, owner_id: userId }],
      { session }
    );

    await ProjectMember.create(
      [{ project_id: project._id, user_id: userId, role: "admin" }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      id: project._id.toString(),
      name: project.name,
      description: project.description,
      ownerId: project.owner_id.toString(),
      createdAt: project.createdAt,
      memberRole: "admin",
      totalTasks: 0,
      doneTasks: 0
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const listProjects = async (userId: string) => {
  const memberships = await ProjectMember.find({ user_id: userId });
  const projectIds = memberships.map((m) => m.project_id);
  const roleMap = new Map(
    memberships.map((m) => [m.project_id.toString(), m.role])
  );

  if (projectIds.length === 0) return [];

  const projects = await Project.find({ _id: { $in: projectIds } }).sort({
    createdAt: -1
  });

  const taskStats = await Task.aggregate([
    { $match: { project_id: { $in: projectIds } } },
    {
      $group: {
        _id: "$project_id",
        total: { $sum: 1 },
        done: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } }
      }
    }
  ]);

  const statsMap = new Map(
    taskStats.map((s) => [s._id.toString(), { total: s.total, done: s.done }])
  );

  return projects.map((p) => {
    const stats = statsMap.get(p._id.toString()) ?? { total: 0, done: 0 };
    return {
      id: p._id.toString(),
      name: p.name,
      description: p.description,
      ownerId: p.owner_id.toString(),
      createdAt: p.createdAt,
      memberRole: roleMap.get(p._id.toString()) ?? "member",
      totalTasks: stats.total,
      doneTasks: stats.done
    };
  });
};

export const getProject = async (userId: string, projectId: string) => {
  const membership = await ProjectMember.findOne({
    project_id: projectId,
    user_id: userId
  });


  if (!membership) {
    const userDoc = await User.findById(userId);
    if (!userDoc || userDoc.role !== "admin") {
      throw new AppError(403, "Not a project member");
    }
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(404, "Project not found");
  }

  const memberDocs = await ProjectMember.find({ project_id: projectId });
  const userIds = memberDocs.map((m) => m.user_id);
  const users = await User.find({ _id: { $in: userIds } }).select(
    "name email"
  );
  const userMap = new Map(users.map((u) => [u._id.toString(), u]));

  return {
    id: project._id.toString(),
    name: project.name,
    description: project.description,
    ownerId: project.owner_id.toString(),
    createdAt: project.createdAt,
    members: memberDocs.map((m) => {
      const u = userMap.get(m.user_id.toString());
      return {
        userId: m.user_id.toString(),
        role: m.role,
        addedAt: m.added_at,
        user: {
          id: m.user_id.toString(),
          name: u?.name ?? "",
          email: u?.email ?? ""
        }
      };
    })
  };
};

export const updateProject = async (
  projectId: string,
  payload: { name?: string; description?: string | null }
) => {
  const updateFields: Record<string, any> = {};
  if (payload.name !== undefined) updateFields.name = payload.name;
  if (payload.description !== undefined)
    updateFields.description = payload.description;

  const project = await Project.findByIdAndUpdate(projectId, updateFields, {
    new: true
  });

  if (!project) {
    throw new AppError(404, "Project not found");
  }

  return {
    id: project._id.toString(),
    name: project.name,
    description: project.description,
    ownerId: project.owner_id.toString(),
    createdAt: project.createdAt
  };
};

export const deleteProject = async (projectId: string) => {
  const project = await Project.findByIdAndDelete(projectId);
  if (!project) {
    throw new AppError(404, "Project not found");
  }

  await ProjectMember.deleteMany({ project_id: projectId });
  await Task.deleteMany({ project_id: projectId });
};

export const addMember = async (
  projectId: string,
  email: string,
  role: "admin" | "member" = "member"
) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "name email"
  );
  if (!user) {
    throw new AppError(404, "User not found");
  }

  await ProjectMember.findOneAndUpdate(
    { project_id: projectId, user_id: user._id },
    { project_id: projectId, user_id: user._id, role },
    { upsert: true, new: true }
  );

  return {
    userId: user._id.toString(),
    role,
    user: { id: user._id.toString(), name: user.name, email: user.email }
  };
};

export const listMembers = async (projectId: string) => {
  const memberDocs = await ProjectMember.find({ project_id: projectId });
  const userIds = memberDocs.map((m) => m.user_id);
  const users = await User.find({ _id: { $in: userIds } }).select(
    "name email"
  );
  const userMap = new Map(users.map((u) => [u._id.toString(), u]));

  return memberDocs.map((m) => {
    const u = userMap.get(m.user_id.toString());
    return {
      userId: m.user_id.toString(),
      role: m.role,
      addedAt: m.added_at,
      user: {
        id: m.user_id.toString(),
        name: u?.name ?? "",
        email: u?.email ?? ""
      }
    };
  });
};

export const removeMember = async (projectId: string, userId: string) => {
  const result = await ProjectMember.findOneAndDelete({
    project_id: projectId,
    user_id: userId
  });
  if (!result) {
    throw new AppError(404, "Member not found");
  }
};
