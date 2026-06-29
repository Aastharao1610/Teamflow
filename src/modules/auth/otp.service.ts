import prisma from "../../lib/prisma";
import redis from "../../lib/redis";
import { sendMail } from "../../lib/mail";

import { generateOtp } from "./auth.utils";
import { readTemplate } from "../../utils/readtemplates";

type SendOtpInput = {
  email: string;
};

type VerifyOtpInput = {
  email: string;
  otp: string;
};

export const sendOtp = async ({
  email,
}: SendOtpInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isEmailVerified) {
    throw new Error("Email already verified");
  }

  const otp = generateOtp();

  await redis.set(
    `email-otp:${email}`,
    otp,
    "EX",
    60 * 10
  );

  const html = await readTemplate(
    "verify-email.html",
    {
      OTP: otp,
    }
  );

  await sendMail({
    to: email,
    subject: "Verify your TeamFlow account",
    html,
  });

  return {
    message: "OTP sent successfully",
  };
};

export const verifyOtp = async ({
  email,
  otp,
}: VerifyOtpInput) => {
  const storedOtp = await redis.get(
    `email-otp:${email}`
  );

  if (!storedOtp) {
    throw new Error("OTP expired");
  }

  if (storedOtp !== otp) {
    throw new Error("Invalid OTP");
  }

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      isEmailVerified: true,
    },
  });

  await redis.del(`email-otp:${email}`);

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    const html = await readTemplate(
      "welcome.html",
      {
        NAME: user.name,
      }
    );

    await sendMail({
      to: email,
      subject: "Welcome to TeamFlow 🎉",
      html,
    });
  }

  return {
    message: "Email verified successfully",
  };
};

export const resendOtp = async ({
  email,
}: SendOtpInput) => {
  return sendOtp({
    email,
  });
};