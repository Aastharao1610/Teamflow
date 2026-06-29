import prisma from  "../../lib/prisma";
import bcrypt from "bcrypt";
import redis from "../../lib/redis";
import jwt  from "jsonwebtoken";


import { generateAccessToken ,generateRefreshToken } from "../../utils/jwt";
import { sendOtp } from "./otp.service";


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
        throw new Error("Invalid email or password");
    }
    const isPasswordValid =await bcrypt.compare(password , user.password);
    if(!isPasswordValid){
        throw new Error("Invalid email or password");
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
      ipAddress,
      deviceName,
      userAgent,
    },
     create: {
      userId: user.id,
      deviceId,
      deviceName,
      userAgent,
      ipAddress,
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
  throw new Error("Email already exists");
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


return user;
};

export const refreshToken = async (token: string) => {
  const payload = jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET!
  ) as {
    userId: string;
    deviceId: string;
  };

  const redisKey = `refresh:${payload.userId}:${payload.deviceId}`;
  const storedToken =await redis.get(redisKey);

   if (!storedToken || storedToken !== token) {
    throw new Error("Invalid refresh token");
  }

  const accessToken =generateAccessToken({
    userId :payload.userId,
    deviceId :payload.deviceId,
  })

  const newRefreshToken =generateRefreshToken({
    userId :payload.userId,
    deviceId : payload.deviceId
  })

  await redis.set(
    redisKey,
    newRefreshToken,
    "EX",
    60 * 60 * 24 * 7
  );


    await prisma.deviceSession.update({
    where: {
      deviceId: payload.deviceId,
    },
    data: {
      lastSeenAt: new Date(),
    },
  });

  return{
    accessToken,
    refreshToken : newRefreshToken
  }
}


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