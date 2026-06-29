import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  PASSWORD_SALT_ROUNDS,
  OTP_LENGTH,
} from "./auth.constants";

type JwtPayload = {
  userId: string;
  deviceId: string;
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateAccessToken = (
  payload: JwtPayload
) => {
  return jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    }
  );
};

export const generateRefreshToken = (
  payload: JwtPayload
) => {
  return jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const verifyAccessToken = (
  token: string
) => {
  return jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!
  ) as JwtPayload;
};

export const verifyRefreshToken = (
  token: string
) => {
  return jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET!
  ) as JwtPayload;
};

export const generateOtp = () => {
  const min = Math.pow(10, OTP_LENGTH - 1);
  const max = Math.pow(10, OTP_LENGTH) - 1;

  return crypto.randomInt(min, max + 1).toString();
};

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const getDeviceSessionKey = (
  userId: string,
  deviceId: string
) => {
  return `refresh:${userId}:${deviceId}`;
};

export const getOtpKey = (email: string) => {
  return `email-otp:${email}`;
};

export const getResetPasswordKey = (
  token: string
) => {
  return `reset-password:${token}`;
};