import { NextFunction, Request, Response } from "express";
import { ProjectMember } from "../models/ProjectMember";
import { AppError } from "../utils/errors";

const getProjectId = (req: Request): string | null => {
  return req.params.projectId ?? req.body.projectId ?? null;
};

const getProjectRole = async (projectId: string, userId: string) => {
  const member = await ProjectMember.findOne({
    project_id: projectId,
    user_id: userId
  });
  return member?.role as "admin" | "member" | undefined;
};

export const requireProjectMember = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const projectId = getProjectId(req);
  if (!projectId) {
    return next(new AppError(400, "Missing projectId"));
  }
  if (!req.user?.id) {
    return next(new AppError(401, "Unauthorized"));
  }

  if (req.user.role === "admin") {
    req.projectRole = "admin";
    return next();
  }

  const role = await getProjectRole(projectId, req.user.id);
  if (!role) {
    return next(new AppError(403, "Not a project member"));
  }

  req.projectRole = role;
  return next();
};

export const requireProjectAdmin = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const projectId = getProjectId(req);
  if (!projectId) {
    return next(new AppError(400, "Missing projectId"));
  }
  if (!req.user?.id) {
    return next(new AppError(401, "Unauthorized"));
  }

  if (req.user.role === "admin") {
    req.projectRole = "admin";
    return next();
  }

  const role = await getProjectRole(projectId, req.user.id);
  if (role !== "admin") {
    return next(new AppError(403, "Admin role required"));
  }

  req.projectRole = role;
  return next();
};

export const requireUserRole = (role: "admin" | "member") => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, "Unauthorized"));
    }
    if (req.user.role !== role) {
      return next(new AppError(403, "Insufficient role"));
    }
    return next();
  };
};
