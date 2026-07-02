import { Router } from "express";

import {
  register,
  login,
 
  logout,
  logoutAll,
  resetPassword,forgotPassword,changePassword,
  getMe,
  verifyOtp ,resendOtp, sendOtp

} from "./auth.controller";
import { refreshToken } from "./token.service";

import { authenticate } from "../../middlewares/auth.middleware";
import { authLimiter } from "../../middlewares/rate-limit.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { changePasswordSchema, forgotPasswordSchema,  loginSchema, refreshTokenSchema, registerSchema, resendOtpSchema, resetPasswordSchema, sendOtpSchema, verifyOtpSchema } from "./auth.validation";

const router = Router();

router.post("/register",authLimiter, validate(registerSchema), register);

router.post("/login",authLimiter, validate(loginSchema), login);

router.post("/refresh-token", validate(refreshTokenSchema), refreshToken);

router.post("/logout", authenticate, logout);

router.post("/logout-all", authenticate, logoutAll);

router.post("/send-email-otp",authLimiter, validate(sendOtpSchema), sendOtp);

router.post("/verify-email-otp", authLimiter, validate(verifyOtpSchema), verifyOtp);

router.post("/resend-email-otp", authLimiter, validate(resendOtpSchema), resendOtp);

router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), forgotPassword);

router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

router.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  changePassword
);


router.get("/me", authenticate, getMe);

export default router;