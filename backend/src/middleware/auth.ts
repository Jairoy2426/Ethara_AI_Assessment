import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/errors";

export interface AuthPayload {
  sub: string;
  role: "admin" | "member";
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError(401, "Missing access token"));
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch {
    return next(new AppError(401, "Invalid access token"));
  }
};
