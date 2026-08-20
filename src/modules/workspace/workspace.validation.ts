import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Workspace name must be at least 3 characters")
    .max(100, "Workspace name cannot exceed 100 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Workspace description must be at least 10 characters")
    .max(500, "Workspace description cannot exceed 500 characters"),
  organizationId: z.string().trim().min(1, "Organization ID is required"),
});

export const addWorkspaceMemberSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
});

export const updateWorkspaceMemberRoleSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"]),
});
