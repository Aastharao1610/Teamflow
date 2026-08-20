import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Project description cannot exceed 500 characters")
    .optional(),

  workspaceId: z.string().trim().min(1, "Workspace ID is required"),
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name cannot exceed 100 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(500, "Project description cannot exceed 500 characters")
    .optional(),
});

export const addProjectMemberSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
});

export const updateProjectMemberRoleSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"]),
});
