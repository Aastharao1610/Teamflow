// import type { Request, Response } from "express";
// import * as authService from "./auth.service";
// import prisma from "../../lib/prisma";
// import type { AuthRequest } from "../../middlewares/auth.middleware";

// export const register = async (req: Request, res: Response) => {
//   try {
//     const user = await authService.register(req.body);

//     res.status(201).json({
//       success: true,
//       data: user,
//     });
//   } catch (error) {
//     const message =
//       error instanceof Error ? error.message : "Internal Server Error";

//     res.status(500).json({
//       success: false,
//       message,
//     });
//   }
// };

// export const login = async (req: Request, res: Response) => {
//   try {
//     const result = await authService.login(req.body);

//     res.status(200).json({
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     const message =
//       error instanceof Error ? error.message : "Internal Server Error";

//     res.status(401).json({
//       success: false,
//       message,
//     });
//   }
// };

// export const refreshToken = async (req: Request, res: Response) => {
//   try {
//     const result = await authService.refreshToken(req.body.refreshToken);

//     res.status(200).json({
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     const message =
//       error instanceof Error ? error.message : "Internal Server Error";

//     res.status(401).json({
//       success: false,
//       message,
//     });
//   }
// };

// export const getMe = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   const user = await prisma.user.findUnique({
//     where: {
//       id: req.user.userId,
//     },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       createdAt: true,
//     },
//   });

//   res.status(200).json({
//     success: true,
//     data: user,
//   });
// };


// export const logout = async (req: AuthRequest, res: Response) => {
//   try {
//     console.log(req.user)
//     await authService.logout(req.user!);

//     res.status(200).json({
//       success: true,
//       message: "Logged out successfully",
//     });
//     console.log("VERIFY SECRET:", process.env.ACCESS_TOKEN_SECRET);
//   } catch (error) {
//     const message =
//       error instanceof Error ? error.message : "Internal Server Error";

//     res.status(500).json({
//       success: false,
//       message,
//     });
//   }
// };



import type { Request, Response } from "express";
import prisma from "../../lib/prisma";

import * as authService from "./auth.service";
import * as tokenService from "./token.service";

import type { AuthRequest } from "../../middlewares/auth.middleware";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(401).json({
      success: false,
      message,
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const result = await tokenService.refreshToken(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(401).json({
      success: false,
      message,
    });
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    await tokenService.logout(req.user!);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const logoutAll = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    await tokenService.logoutAll({
      userId: req.user!.userId,
    });

    res.status(200).json({
      success: true,
      message: "Logged out from all devices",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user!.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(500).json({
      success: false,
      message,
    });
  }
};