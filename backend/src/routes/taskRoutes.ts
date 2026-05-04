import { Router } from "express";
import { body, param } from "express-validator";
import { authenticate } from "../middleware/auth";
import { requireProjectAdmin, requireProjectMember } from "../middleware/rbac";
import { validateRequest } from "../middleware/validate";
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
  updateTaskStatus
} from "../controllers/taskController";

const router = Router();

router.use(authenticate);

router.get(
  "/:projectId",
  [param("projectId").isMongoId()],
  validateRequest,
  requireProjectMember,
  listTasks
);
router.post(
  "/:projectId",
  [
    param("projectId").isMongoId(),
    body("title").isString().trim().notEmpty(),
    body("description").optional(),
    body("assignedTo").optional().isMongoId(),
    body("priority").optional().isIn(["low", "medium", "high"]),
    body("status").optional().isIn(["todo", "in_progress", "done"]),
    body("dueDate").optional().isISO8601()
  ],
  validateRequest,
  requireProjectAdmin,
  createTask
);
router.get(
  "/:projectId/:taskId",
  [param("projectId").isMongoId(), param("taskId").isMongoId()],
  validateRequest,
  requireProjectMember,
  getTask
);
router.patch(
  "/:projectId/:taskId",
  [
    param("projectId").isMongoId(),
    param("taskId").isMongoId(),
    body("title").optional(),
    body("description").optional(),
    body("assignedTo").optional().isMongoId(),
    body("priority").optional().isIn(["low", "medium", "high"]),
    body("status").optional().isIn(["todo", "in_progress", "done"]),
    body("dueDate").optional().isISO8601()
  ],
  validateRequest,
  requireProjectAdmin,
  updateTask
);
router.patch(
  "/:projectId/:taskId/status",
  [
    param("projectId").isMongoId(),
    param("taskId").isMongoId(),
    body("status").isIn(["todo", "in_progress", "done"])
  ],
  validateRequest,
  requireProjectMember,
  updateTaskStatus
);
router.delete(
  "/:projectId/:taskId",
  [param("projectId").isMongoId(), param("taskId").isMongoId()],
  validateRequest,
  requireProjectAdmin,
  deleteTask
);

export { router as taskRoutes };
