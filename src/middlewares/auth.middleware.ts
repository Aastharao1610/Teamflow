import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    deviceId: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!
    ) as {
      userId: string;
      deviceId: string;
    };

    req.user = payload;
    console.log("SIGN SECRET:", process.env.ACCESS_TOKEN_SECRET);

    next();
  } catch(error) {
    console.error("JWT Verify Error:", error);

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};