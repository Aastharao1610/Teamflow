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

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh-token", refreshToken);

router.post("/logout", authenticate, logout);

router.post("/logout-all", authenticate, logoutAll);

router.post("/send-email-otp", sendOtp);

router.post("/verify-email-otp", verifyOtp);

router.post("/resend-email-otp", resendOtp);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post(
  "/change-password",
  authenticate,
  changePassword
);

router.get("/me", authenticate, getMe);

export default router;