import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

type TaskActivityType =
  | "CREATED"
  | "UPDATED"
  | "STATUS_CHANGED"
  | "PRIORITY_CHANGED"
  | "ASSIGNEE_ADDED"
  | "ASSIGNEE_REMOVED"
  | "COMMENT_ADDED"
  | "COMMENT_UPDATED"
  | "COMMENT_DELETED"
  | "DELETED";

type TaskActivityMetadata = {
  [key: string]: string | number | boolean | null;
};

export const createTaskActivity = async ({
  taskId,
  userId,
  type,
  metadata,
}: {
  taskId: string;
  userId: string;
  type: TaskActivityType;
  metadata?: TaskActivityMetadata;
}) => {
  return prisma.taskActivity.create({
    data: {
      taskId,
      userId,
      type,
      ...(metadata !== undefined
        ? {
            metadata: metadata as any,
          }
        : {}),
    },
  });
};

export const getTaskActivities = async (taskId: string, userId: string) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!task) {
    throw AppError("Task not found", 404);
  }

  const projectMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: task.projectId,
        userId,
      },
    },
  });

  if (!projectMember) {
    throw AppError("You are not a member of this project", 403);
  }

  return prisma.taskActivity.findMany({
    where: {
      taskId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
