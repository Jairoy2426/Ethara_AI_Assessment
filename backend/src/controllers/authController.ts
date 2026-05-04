import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/errors";
import {
  createUser,
  getUserByEmail,
  getUserById,
  hashPassword,
  signAccessToken,
  verifyPassword
} from "../services/authService";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existing = await getUserByEmail(email);
  if (existing) {
    throw new AppError(409, "Email already in use");
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({ name, email, passwordHash });

  const accessToken = signAccessToken({ id: user.id, role: user.role });

  res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    throw new AppError(401, "Invalid credentials");
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    throw new AppError(401, "Invalid credentials");
  }

  const accessToken = signAccessToken({ id: user.id, role: user.role });

  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError(401, "Unauthorized");
  }

  const user = await getUserById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});
