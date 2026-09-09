import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../src/lib/prisma";

export const createTestUser = async ({
  name = "Test User",
  email,
  password = "Password@123",
}: {
  name?: string;
  email: string;
  password?: string;
}) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      isEmailVerified: true,
    },
  });

  return {
    user,
    password,
  };
};

export const createAccessToken = ({
  userId,
  deviceId = "test-device",
}: {
  userId: string;
  deviceId?: string;
}) => {
  return jwt.sign(
    {
      userId,
      deviceId,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15m",
    },
  );
};

export const authHeader = (userId: string) => {
  const token = createAccessToken({
    userId,
  });

  return `Bearer ${token}`;
};
