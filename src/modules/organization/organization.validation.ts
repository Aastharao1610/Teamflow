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
  token: z.string().min(1),
});

export const rejectInvitationSchema = z.object({
  token: z.string().min(1),
});

export const transferOwnershipSchema = z.object({
  newOwnerId: z.string().min(1),
});
