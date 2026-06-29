import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
import redis from "../../lib/redis";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";

type RefreshTokenInput = {
  refreshToken: string;
};

type LogoutInput = {
  userId: string;
  deviceId: string;
};

type LogoutAllInput = {
  userId: string;
};

export const refreshToken = async ({
  refreshToken,
}: RefreshTokenInput) => {
  const payload = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!
  ) as {
    userId: string;
    deviceId: string;
  };

  const redisKey = `refresh:${payload.userId}:${payload.deviceId}`;

  const storedToken = await redis.get(redisKey);

  if (!storedToken || storedToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const accessToken = generateAccessToken({
    userId: payload.userId,
    deviceId: payload.deviceId,
  });

  const newRefreshToken = generateRefreshToken({
    userId: payload.userId,
    deviceId: payload.deviceId,
  });

  await redis.set(redisKey, newRefreshToken, "EX", 60 * 60 * 24 * 7);

  await prisma.deviceSession.update({
    where: {
      deviceId: payload.deviceId,
    },
    data: {
      lastSeenAt: new Date(),
    },
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const logout = async ({
  userId,
  deviceId,
}: LogoutInput) => {
  await redis.del(`refresh:${userId}:${deviceId}`);

  await prisma.deviceSession.update({
    where: {
      deviceId,
    },
    data: {
      isRevoked: true,
    },
  });
};

export const logoutAll = async ({
  userId,
}: LogoutAllInput) => {
  const sessions = await prisma.deviceSession.findMany({
    where: {
      userId,
      isRevoked: false,
    },
  });

  for (const session of sessions) {
    await redis.del(`refresh:${userId}:${session.deviceId}`);
  }

  await prisma.deviceSession.updateMany({
    where: {
      userId,
    },
    data: {
      isRevoked: true,
    },
  });
};