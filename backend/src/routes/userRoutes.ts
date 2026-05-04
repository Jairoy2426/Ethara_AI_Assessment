import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireUserRole } from "../middleware/rbac";
import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get(
  "/",
  authenticate,
  requireUserRole("admin"),
  asyncHandler(async (_req, res) => {
    const users = await User.find({}).select("-password_hash").sort({ createdAt: -1 });
    res.json(users.map(u => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt
    })));
  })
);

export { router as userRoutes };
