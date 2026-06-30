import prisma from "../../lib/prisma";
import redis from "../../lib/redis";
import { sendMail } from "../../lib/mail";

import { generateOtp } from "./auth.utils";
import { readTemplate } from "../../utils/readtemplates";
import { AppError } from "../../utils/AppError";

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
    throw AppError("Usr with this email is not found" , 404);
  }

  if (user.isEmailVerified) {
    throw AppError("Email is  already verified" ,400);
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

  console.log("EMAIL INPUT:", email);
console.log("OTP INPUT:", otp);
console.log("STORED OTP FROM REDIS:", storedOtp);

  if (!storedOtp) {
    throw AppError("OTP expired" , 410);
  }

  if (storedOtp !== otp) {
    throw AppError("Invalid OTP", 400);
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