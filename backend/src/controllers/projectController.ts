import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as projectService from "../services/projectService";

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.createProject(req.user!.id, req.body);
  res.status(201).json(project);
});

export const listProjects = asyncHandler(async (req: Request, res: Response) => {
  const projects = await projectService.listProjects(req.user!.id);
  res.json(projects);
});

export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.getProject(
    req.user!.id,
    req.params.projectId
  );
  res.json(project);
});

export const addMember = asyncHandler(async (req: Request, res: Response) => {
  const member = await projectService.addMember(
    req.params.projectId,
    req.body.email,
    req.body.role
  );
  res.status(201).json(member);
});

export const listMembers = asyncHandler(async (_req: Request, res: Response) => {
  const members = await projectService.listMembers(_req.params.projectId);
  res.json(members);
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.updateProject(req.params.projectId, req.body);
  res.json(project);
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  await projectService.deleteProject(req.params.projectId);
  res.status(204).send();
});

export const removeMember = asyncHandler(async (req: Request, res: Response) => {
  await projectService.removeMember(req.params.projectId, req.params.userId);
  res.status(204).send();
});
