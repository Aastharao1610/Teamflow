import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Task title must be at least 2 characters")
    .max(200, "Task title cannot exceed 200 characters"),

  description: z
    .string()
    .trim()
    .max(2000, "Task description cannot exceed 2000 characters")
    .optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),

  dueDate: z.coerce.date().optional(),

  projectId: z.string().trim().min(1, "Project ID is required"),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Task title must be at least 2 characters")
    .max(200, "Task title cannot exceed 200 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(2000, "Task description cannot exceed 2000 characters")
    .optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),

  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELLED"]).optional(),

  dueDate: z.coerce.date().optional(),
});

export const addTaskAssigneeSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
});

export const createTaskCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(5000, "Comment cannot exceed 5000 characters"),
});

export const updateTaskCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(5000, "Comment cannot exceed 5000 characters"),
});

export const getTasksByProjectSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),

  search: z.string().trim().max(200).optional(),

  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELLED"]).optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),

  assigneeId: z.string().trim().optional(),

  sortBy: z
    .enum(["createdAt", "updatedAt", "title", "dueDate"])
    .default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
