import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";

import {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  addTaskAssignee,
  getTaskAssignees,
  removeTaskAssignee,
  createTaskComment,
  getTaskComments,
  updateTaskComment,
  deleteTaskComment,
  getMyTasks,
  getTaskActivity,
} from "./task.controller";

import {
  createTaskSchema,
  updateTaskSchema,
  addTaskAssigneeSchema,
  createTaskCommentSchema,
  updateTaskCommentSchema,
  getTasksByProjectSchema,
} from "./task.validation";

const router = Router();
router.get("/my", authenticate, getMyTasks);

router.post("/", authenticate, validate(createTaskSchema), createTask);

router.get(
  "/project/:projectId",
  authenticate,
  validate(getTasksByProjectSchema),
  getTasksByProject,
);

router.get("/:taskId/activity", authenticate, getTaskActivity);

router.get("/:taskId", authenticate, getTaskById);

router.put("/:taskId", authenticate, validate(updateTaskSchema), updateTask);

router.delete("/:taskId", authenticate, deleteTask);

router.post(
  "/:taskId/assignees",
  authenticate,
  validate(addTaskAssigneeSchema),
  addTaskAssignee,
);

router.get("/:taskId/assignees", authenticate, getTaskAssignees);

router.delete("/:taskId/assignees/:userId", authenticate, removeTaskAssignee);

router.post(
  "/:taskId/comments",
  authenticate,
  validate(createTaskCommentSchema),
  createTaskComment,
);

router.get("/:taskId/comments", authenticate, getTaskComments);

router.put(
  "/:taskId/comments/:commentId",
  authenticate,
  validate(updateTaskCommentSchema),
  updateTaskComment,
);

router.delete("/:taskId/comments/:commentId", authenticate, deleteTaskComment);

export default router;
