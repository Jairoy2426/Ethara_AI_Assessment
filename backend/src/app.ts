import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/authRoutes";
import { projectRoutes } from "./routes/projectRoutes";
import { taskRoutes } from "./routes/taskRoutes";
import { dashboardRoutes } from "./routes/dashboardRoutes";
import { userRoutes } from "./routes/userRoutes";
import { errorHandler } from "./middleware/error";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

export { app };
