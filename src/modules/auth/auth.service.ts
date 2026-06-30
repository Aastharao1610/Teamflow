import prisma from  "../../lib/prisma";
import bcrypt from "bcrypt";
import redis from "../../lib/redis";
import jwt  from "jsonwebtoken";


import { generateAccessToken ,generateRefreshToken } from "../../utils/jwt";
import { sendOtp } from "./otp.service";
import { AppError } from "../../utils/AppError";


type LoginInput ={
     email: string;
  password: string;
  deviceId: string;
  deviceName?: string;
  userAgent?: string;
  ipAddress?: string;
};

type LogoutInput = {
  userId: string;
  deviceId: string;
};

export const login = async ({
    email,
    password,
    deviceId,
    deviceName,
    userAgent,
    ipAddress,
  }: LoginInput 
) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        }
    });
    if(!user){
        throw AppError("Invalid email or password" , 401);
    }
    const isPasswordValid =await bcrypt.compare(password , user.password);
    if(!isPasswordValid){
        throw AppError("Invalid email or password" ,401);
    }

    const accessToken = generateAccessToken({userId :user.id ,deviceId} );
    const refreshToken = generateRefreshToken({userId :user.id ,deviceId} );

     await redis.set(
    `refresh:${user.id}:${deviceId}`,
    refreshToken,
    "EX",
    60 * 60 * 24 * 7
  );

  await prisma.deviceSession.upsert({
    where: {
        deviceId
    },
     update: {
      lastSeenAt: new Date(),
      isRevoked: false,
      ...(ipAddress !== undefined ? { ipAddress } : {}),
      ...(deviceName !== undefined ? { deviceName } : {}),
      ...(userAgent !== undefined ? { userAgent } : {}),
    },
     create: {
      userId: user.id,
      deviceId,
      ...(deviceName !== undefined ? { deviceName } : {}),
      ...(userAgent !== undefined ? { userAgent } : {}),
      ...(ipAddress !== undefined ? { ipAddress } : {}),
    },
  })

  return{
    accessToken,
    refreshToken,
    user:{
        id:user.id,
        name: user.name,
        email :user.email,
    }
  }
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {

   const hashedPassword = await bcrypt.hash(data.password, 10);
  const existingUser = await prisma.user.findUnique({
  where: {
    email: data.email,
  },
});

if (existingUser) {
  throw AppError("A user with this email address already exists." , 409);
}

const user = await prisma.user.create({
  data:{
    ...data, 
    password: hashedPassword
  }
});
await sendOtp({
  email: user.email,
});


return {
  id: user.id,
  name: user.name,
  email: user.email,
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

  return;
};
