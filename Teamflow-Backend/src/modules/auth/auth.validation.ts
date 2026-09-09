import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(3).max(50),

  email: z.email().trim().toLowerCase(),

  password: z
    .string()
    .min(8)
    .max(100),
});




export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),

  password: z.string().min(8),

  deviceId: z.string().min(1),

  deviceName: z.string().optional(),

  userAgent: z.string().optional(),

  ipAddress: z.string().optional(),
});



export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});


export const forgotPasswordSchema = z.object({
  email: z.email().trim().toLowerCase(),
});


export const resetPasswordSchema = z.object({
  token: z.string().min(1),

  password: z
    .string()
    .min(8)
    .max(100),
});


export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),

  newPassword: z
    .string()
    .min(8)
    .max(100),
});

export const sendOtpSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

export const verifyOtpSchema = z.object({
  email: z.email().trim().toLowerCase(),

  otp: z
    .string()
    .length(6),
});

export const resendOtpSchema = z.object({
  email: z.email().trim().toLowerCase(),
});