import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

import type {
  CreateNotificationInput,
  GetNotificationsInput,
} from "./notification.types";

export const createNotification = async ({
  userId,
  type,
  title,
  message,
  data,
}: CreateNotificationInput) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw AppError("User not found", 404);
  }

  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      ...(data !== undefined
        ? {
            data: data as any,
          }
        : {}),
    },
  });

  return notification;
};

export const getMyNotifications = async ({
  userId,
  page = 1,
  limit = 20,
  unreadOnly = false,
}: GetNotificationsInput) => {
  const skip = (page - 1) * limit;

  const where = {
    userId,
    ...(unreadOnly
      ? {
          read: false,
        }
      : {}),
  };

  const [notifications, total] = await prisma.$transaction([
    prisma.notification.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.notification.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const getUnreadNotificationCount = async (userId: string) => {
  const count = await prisma.notification.count({
    where: {
      userId,
      read: false,
    },
  });

  return {
    count,
  };
};

export const markNotificationAsRead = async (
  notificationId: string,
  userId: string,
) => {
  const notification = await prisma.notification.findUnique({
    where: {
      id: notificationId,
    },
  });

  if (!notification) {
    throw AppError("Notification not found", 404);
  }

  if (notification.userId !== userId) {
    throw AppError("You do not have access to this notification", 403);
  }

  const updatedNotification = await prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      read: true,
    },
  });

  return updatedNotification;
};

export const markAllNotificationsAsRead = async (userId: string) => {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: {
      read: true,
    },
  });

  return {
    message: "All notifications marked as read",
    count: result.count,
  };
};

export const deleteNotification = async (
  notificationId: string,
  userId: string,
) => {
  const notification = await prisma.notification.findUnique({
    where: {
      id: notificationId,
    },
  });

  if (!notification) {
    throw AppError("Notification not found", 404);
  }

  if (notification.userId !== userId) {
    throw AppError("You do not have access to this notification", 403);
  }

  await prisma.notification.delete({
    where: {
      id: notificationId,
    },
  });

  return {
    message: "Notification deleted successfully",
  };
};
