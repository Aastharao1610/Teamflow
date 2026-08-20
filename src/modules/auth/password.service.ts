import bcrypt from "bcrypt";
import crypto from "crypto";

import prisma from "../../lib/prisma";
import redis from "../../lib/redis";
import { AppError } from "../../utils/AppError";
import { readTemplate } from "../../utils/readtemplates";
import { sendMail } from "../../lib/mail";

type ForgotPasswordInput = {
  email: string;
};

type ResetPasswordInput = {
  token: string;
  password: string;
};

type ChangePasswordInput = {
  userId: string;
  currentPassword: string;
  newPassword: string;
};

export const forgotPassword = async ({ email }: ForgotPasswordInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return {
      message: "If the email exists, a password reset link has been sent",
    };
  }

  const token = crypto.randomBytes(32).toString("hex");

  await redis.set(`reset-password:${token}`, user.id, "EX", 60 * 15);

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  let html = await readTemplate("reset-password.html", {
    resetLink,
  });

  await sendMail({
    to: email,
    subject: "Password Reset Request",
    html,
  });
  return {
    message: "Password reset email sent successfully",
  };
};

export const resetPassword = async ({
  token,
  password,
}: ResetPasswordInput) => {
  const userId = await redis.get(`reset-password:${token}`);

  if (!userId) {
    throw AppError("Invalid or expired reset token", 401);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.deviceSession.updateMany({
    where: {
      userId,
    },
    data: {
      isRevoked: true,
    },
  });

  const sessions = await prisma.deviceSession.findMany({
    where: {
      userId,
    },
    select: {
      deviceId: true,
    },
  });

  for (const session of sessions) {
    await redis.del(`refresh:${userId}:${session.deviceId}`);
  }

  await redis.del(`reset-password:${token}`);
};

export const changePassword = async ({
  userId,
  currentPassword,
  newPassword,
}: ChangePasswordInput) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw AppError("User with this email is  not found", 404);
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw AppError("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
};
