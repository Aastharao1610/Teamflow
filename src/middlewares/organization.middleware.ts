import type { NextFunction, Response } from "express";

import prisma from "../lib/prisma";
import type { AuthRequest } from "./auth.middleware";

export const authorizeOrganization =
  (roles: string[]) =>
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const organizationId = req.params.id;

      const member = await prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId,
            userId: req.user!.userId,
          },
        },
      });

      if (!member) {
        return res.status(403).json({
          success: false,
          message: "You are not a member of this organization",
        });
      }
      if (!roles.includes(member.role)) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied. You don't have the required role to perform this action",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
