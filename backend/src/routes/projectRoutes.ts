import { Router } from "express";
import { body, param } from "express-validator";
import { authenticate } from "../middleware/auth";
import {
  requireProjectAdmin,
  requireProjectMember,
  requireUserRole
} from "../middleware/rbac";
import { validateRequest } from "../middleware/validate";
import {
  addMember,
  createProject,
  deleteProject,
  getProject,
  listMembers,
  listProjects,
  removeMember,
  updateProject
} from "../controllers/projectController";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  [body("name").isString().trim().notEmpty(), body("description").optional()],
  validateRequest,
  requireUserRole("admin"),
  createProject
);
router.get("/", listProjects);
router.get(
  "/:projectId",
  [param("projectId").isMongoId()],
  validateRequest,
  requireProjectMember,
  getProject
);
router.patch(
  "/:projectId",
  [param("projectId").isMongoId(), body("name").optional(), body("description").optional()],
  validateRequest,
  requireProjectAdmin,
  updateProject
);
router.delete(
  "/:projectId",
  [param("projectId").isMongoId()],
  validateRequest,
  requireProjectAdmin,
  deleteProject
);
router.post(
  "/:projectId/members",
  [
    param("projectId").isMongoId(),
    body("email").isEmail(),
    body("role").optional().isIn(["admin", "member"])
  ],
  validateRequest,
  requireProjectAdmin,
  addMember
);
router.get(
  "/:projectId/members",
  [param("projectId").isMongoId()],
  validateRequest,
  requireProjectMember,
  listMembers
);
router.delete(
  "/:projectId/members/:userId",
  [param("projectId").isMongoId(), param("userId").isMongoId()],
  validateRequest,
  requireProjectAdmin,
  removeMember
);

export { router as projectRoutes };
