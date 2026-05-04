import { Router } from "express";
import { body } from "express-validator";
import { login, me, signup } from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";

const router = Router();

router.post(
  "/signup",
  [
    body("name").isString().trim().notEmpty(),
    body("email").isEmail(),
    body("password").isString().isLength({ min: 8 })
  ],
  validateRequest,
  signup
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").isString().notEmpty()],
  validateRequest,
  login
);

router.get("/me", authenticate, me);

export { router as authRoutes };
