import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { DashboardData } from "./dashboard.types";
import { TaskStatus } from "../../../generated/prisma/enums";

export const getDashboard = async (userId: string): Promise<DashboardData> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw AppError("User not found", 404);
  }

  const now = new Date();

  const [
    organizations,
    workspaceCount,
    projectCount,
    totalTasks,
    todoTasks,
    inProgressTasks,
    doneTasks,
    cancelledTasks,
    overdueTasks,
    myTasks,
    recentActivity,
    unreadNotifications,
  ] = await Promise.all([
    prisma.organization.findMany({
      where: {
        OR: [
          {
            ownerId: userId,
          },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        ownerId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.workspace.count({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    }),

    prisma.project.count({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    }),

    prisma.task.count({
      where: {
        project: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    }),

    prisma.task.count({
      where: {
        status: "TODO",
        project: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    }),

    prisma.task.count({
      where: {
        status: "IN_PROGRESS",
        project: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    }),

    prisma.task.count({
      where: {
        status: "DONE",
        project: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    }),

    prisma.task.count({
      where: {
        status: "CANCELLED",
        project: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    }),

    prisma.task.count({
      where: {
        dueDate: {
          lt: now,
        },
        status: {
          notIn: [TaskStatus.DONE, TaskStatus.CANCELLED],
        },
        project: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    }),

    prisma.task.findMany({
      where: {
        assignees: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        dueDate: "asc",
      },
      take: 10,
    }),

    prisma.taskActivity.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        taskId: true,
        type: true,
        metadata: true,
        createdAt: true,
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),

    prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    }),
  ]);

  return {
    organizations,
    workspaceCount,
    projectCount,
    taskStats: {
      total: totalTasks,
      todo: todoTasks,
      inProgress: inProgressTasks,
      done: doneTasks,
      cancelled: cancelledTasks,
      overdue: overdueTasks,
    },
    myTasks,
    recentActivity,
    unreadNotifications,
  };
};
