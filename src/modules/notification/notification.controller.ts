import type { NextFunction, Response } from "express";

import type { AuthRequest } from "../../middlewares/auth.middleware";

import * as notificationService from "./notification.service";

export const getMyNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const unreadOnly = req.query.unreadOnly === "true";

    const result = await notificationService.getMyNotifications({
      userId: req.user!.userId,
      page,
      limit,
      unreadOnly,
    });

    res.status(200).json({
      success: true,
      data: result.notifications,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getUnreadNotificationCount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await notificationService.getUnreadNotificationCount(
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { notificationId } = req.params;

    if (!notificationId || Array.isArray(notificationId)) {
      throw new Error("Invalid notification ID");
    }

    const notification = await notificationService.markNotificationAsRead(
      notificationId,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await notificationService.markAllNotificationsAsRead(
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { notificationId } = req.params;

    if (!notificationId || Array.isArray(notificationId)) {
      throw new Error("Invalid notification ID");
    }

    const result = await notificationService.deleteNotification(
      notificationId,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
