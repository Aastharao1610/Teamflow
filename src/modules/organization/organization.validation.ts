import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Organization name must be at least 3 characters")
    .max(100, "Organization name cannot exceed 100 characters"),
});

export const inviteMemberSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

export const acceptInvitationSchema = z.object({
  invitationToken: z.string().trim().min(1, "Invitation token is required"),
});
