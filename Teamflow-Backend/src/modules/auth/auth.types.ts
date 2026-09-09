export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
  deviceId: string;
  deviceName?: string;
  userAgent?: string;
  ipAddress?: string;
};

export type JwtPayload = {
  userId: string;
  deviceId: string;
};

export type RefreshTokenInput = {
  refreshToken: string;
};

export type LogoutInput = {
  userId: string;
  deviceId: string;
};

export type LogoutAllInput = {
  userId: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
};

export type ChangePasswordInput = {
  userId: string;
  currentPassword: string;
  newPassword: string;
};

export type SendOtpInput = {
  email: string;
};

export type VerifyOtpInput = {
  email: string;
  otp: string;
};