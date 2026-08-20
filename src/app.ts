import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import organizationRoutes from "./modules/organization/organization.route";
import workspaceRoutes from "./modules/workspace/workspace.route";
import projectRoutes from "./modules/project/project.route";
import taskroutes from "./modules/task/task.route";
import notificationRoute from "./modules/notification/notification.route";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Testing the Server route is working fine" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/organization", organizationRoutes);
app.use("/api/v1/workspace", workspaceRoutes);
app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/task", taskroutes);
app.use("/api/v1/notification", notificationRoute);

app.use(errorMiddleware);

export default app;
