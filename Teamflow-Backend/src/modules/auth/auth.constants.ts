export const ACCESS_TOKEN_EXPIRY = "15m";
export const REFRESH_TOKEN_EXPIRY = "7d";

export const PASSWORD_SALT_ROUNDS = 10;

export const REFRESH_TOKEN_TTL = 60 * 60 * 24 * 7; // 7 days

export const RESET_PASSWORD_TOKEN_TTL = 60 * 15; // 15 minutes

export const EMAIL_OTP_TTL = 60 * 10; // 10 minutes

export const OTP_LENGTH = 6;

export const REDIS_KEYS = {
  refreshToken: (userId: string, deviceId: string) =>
    `refresh:${userId}:${deviceId}`,

  resetPassword: (token: string) =>
    `reset-password:${token}`,

  emailOtp: (email: string) =>
    `email-otp:${email}`,
};

export const AUTH_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_EXISTS: "Email already exists",
  USER_NOT_FOUND: "User not found",

  UNAUTHORIZED: "Unauthorized",

  INVALID_REFRESH_TOKEN: "Invalid refresh token",

  PASSWORD_CHANGED: "Password changed successfully",

  RESET_TOKEN_INVALID: "Invalid or expired reset token",

  OTP_SENT: "OTP sent successfully",
  OTP_RESENT: "OTP resent successfully",
  OTP_INVALID: "Invalid OTP",
  OTP_EXPIRED: "OTP expired",
  OTP_VERIFIED: "OTP verified successfully",

  LOGOUT_SUCCESS: "Logged out successfully",
  LOGOUT_ALL_SUCCESS: "Logged out from all devices",
};