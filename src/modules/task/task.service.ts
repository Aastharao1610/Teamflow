import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { createTaskActivity } from "./task.activity";
import { createNotification } from "../notification/notification.service";

import type {
  CreateTaskInput,
  UpdateTaskInput,
  DeleteTaskInput,
  AddTaskAssigneeInput,
  RemoveTaskAssigneeInput,
  CreateTaskCommentInput,
  UpdateTaskCommentInput,
  DeleteTaskCommentInput,
  GetTasksByProjectInput,
} from "./task.types";

export const createTask = async ({
  title,
  description,
  priority,
  dueDate,
  projectId,
  createdById,
}: CreateTaskInput) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      members: true,
    },
  });

  if (!project) {
    throw AppError("Project not found", 404);
  }

  const projectMember = project.members.find(
    (member) => member.userId === createdById,
  );

  if (!projectMember) {
    throw AppError("You are not a member of this project", 403);
  }

  const task = await prisma.task.create({
    data: {
      title,
      ...(description !== undefined ? { description } : {}),
      ...(priority !== undefined ? { priority } : {}),
      ...(dueDate !== undefined ? { dueDate } : {}),
      projectId,
      createdById,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignees: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  await createTaskActivity({
    taskId: task.id,
    userId: createdById,
    type: "CREATED",
  });

  return task;
};
export const getTasksByProject = async ({
  projectId,
  userId,
  page = 1,
  limit = 20,
  search,
  status,
  priority,
  assigneeId,
  sortBy = "createdAt",
  sortOrder = "desc",
}: GetTasksByProjectInput) => {
  const projectMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  if (!projectMember) {
    throw AppError("You are not a member of this project", 403);
  }

  const skip = (page - 1) * limit;

  const where = {
    projectId,

    ...(search
      ? {
          title: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {}),

    ...(status ? { status } : {}),

    ...(priority ? { priority } : {}),

    ...(assigneeId
      ? {
          assignees: {
            some: {
              userId: assigneeId,
            },
          },
        }
      : {}),
  };

  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      skip,
      take: limit,

      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        assignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },

      orderBy: {
        [sortBy]: sortOrder,
      },
    }),

    prisma.task.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    tasks,

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

export const getTaskById = async (taskId: string, userId: string) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          workspaceId: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignees: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
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

  return task;
};

export const updateTask = async ({
  taskId,
  title,
  description,
  priority,
  status,
  dueDate,
  updatedById,
}: UpdateTaskInput) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      project: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!task) {
    throw AppError("Task not found", 404);
  }

  const projectMember = task.project.members.find(
    (member) => member.userId === updatedById,
  );

  if (!projectMember) {
    throw AppError("You are not a member of this project", 403);
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(priority !== undefined ? { priority } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(dueDate !== undefined ? { dueDate } : {}),
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignees: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (status !== undefined && status !== task.status) {
    await createTaskActivity({
      taskId,
      userId: updatedById,
      type: "STATUS_CHANGED",
      metadata: {
        oldStatus: task.status,
        newStatus: status,
      },
    });
  }
  const assignees = await prisma.taskAssignee.findMany({
    where: {
      taskId,
    },
    select: {
      userId: true,
    },
  });

  if (status !== undefined && status !== task.status) {
    await Promise.all(
      assignees
        .filter((assignee) => assignee.userId !== updatedById)
        .map((assignee) =>
          createNotification({
            userId: assignee.userId,
            type: "TASK_STATUS_CHANGED",
            title: "Task status changed",
            message: `Task status changed from ${task.status} to ${status}`,
            data: {
              taskId,
              oldStatus: task.status,
              newStatus: status,
            },
          }),
        ),
    );
  }

  if (priority !== undefined && priority !== task.priority) {
    await createTaskActivity({
      taskId,
      userId: updatedById,
      type: "PRIORITY_CHANGED",
      metadata: {
        oldPriority: task.priority,
        newPriority: priority,
      },
    });
  }

  if (
    title !== undefined ||
    description !== undefined ||
    dueDate !== undefined
  ) {
    await createTaskActivity({
      taskId,
      userId: updatedById,
      type: "UPDATED",
    });
  }

  return updatedTask;
};

export const deleteTask = async ({ taskId, deletedById }: DeleteTaskInput) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      project: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!task) {
    throw AppError("Task not found", 404);
  }

  const projectMember = task.project.members.find(
    (member) => member.userId === deletedById,
  );

  if (!projectMember) {
    throw AppError("You are not a member of this project", 403);
  }

  if (projectMember.role !== "ADMIN") {
    throw AppError("Only project admins can delete tasks", 403);
  }

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  return {
    message: "Task deleted successfully",
  };
};

export const addTaskAssignee = async ({
  taskId,
  userId,
  assignedById,
}: AddTaskAssigneeInput) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      project: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!task) {
    throw AppError("Task not found", 404);
  }

  const requester = task.project.members.find(
    (member) => member.userId === assignedById,
  );

  if (!requester) {
    throw AppError("You are not a member of this project", 403);
  }

  const targetMember = task.project.members.find(
    (member) => member.userId === userId,
  );

  if (!targetMember) {
    throw AppError("User must be a member of this project", 403);
  }

  const existingAssignee = await prisma.taskAssignee.findUnique({
    where: {
      taskId_userId: {
        taskId,
        userId,
      },
    },
  });

  if (existingAssignee) {
    throw AppError("User is already assigned to this task", 400);
  }

  const assignee = await prisma.taskAssignee.create({
    data: {
      taskId,
      userId,
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
  });

  await createTaskActivity({
    taskId,
    userId: assignedById,
    type: "ASSIGNEE_ADDED",
    metadata: {
      assignedUserId: userId,
    },
  });

  await createNotification({
    userId,
    type: "TASK_ASSIGNED",
    title: "Task assigned",
    message: "You have been assigned to a task",
    data: {
      taskId,
    },
  });
  return assignee;
};

export const getTaskAssignees = async (taskId: string, userId: string) => {
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

  return prisma.taskAssignee.findMany({
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
  });
};

export const removeTaskAssignee = async ({
  taskId,
  userId,
  removedById,
}: RemoveTaskAssigneeInput) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      project: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!task) {
    throw AppError("Task not found", 404);
  }

  const requester = task.project.members.find(
    (member) => member.userId === removedById,
  );

  if (!requester) {
    throw AppError("You are not a member of this project", 403);
  }

  const assignee = await prisma.taskAssignee.findUnique({
    where: {
      taskId_userId: {
        taskId,
        userId,
      },
    },
  });

  if (!assignee) {
    throw AppError("User is not assigned to this task", 404);
  }

  await prisma.taskAssignee.delete({
    where: {
      taskId_userId: {
        taskId,
        userId,
      },
    },
  });

  await createTaskActivity({
    taskId,
    userId: removedById,
    type: "ASSIGNEE_REMOVED",
    metadata: {
      removedUserId: userId,
    },
  });

  return {
    message: "Task assignee removed successfully",
  };
};

export const createTaskComment = async ({
  taskId,
  content,
  userId,
}: CreateTaskCommentInput) => {
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

  const comment = await prisma.taskComment.create({
    data: {
      taskId,
      content,
      userId,
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
  });

  await createTaskActivity({
    taskId,
    userId,
    type: "COMMENT_ADDED",
    metadata: {
      commentId: comment.id,
    },
  });

  const assignees = await prisma.taskAssignee.findMany({
    where: {
      taskId,
    },
    select: {
      userId: true,
    },
  });

  await Promise.all(
    assignees
      .filter((assignee) => assignee.userId !== userId)
      .map((assignee) =>
        createNotification({
          userId: assignee.userId,
          type: "TASK_COMMENT_ADDED",
          title: "New task comment",
          message: "Someone commented on a task you're assigned to",
          data: {
            taskId,
            commentId: comment.id,
          },
        }),
      ),
  );

  return comment;
};

export const getTaskComments = async (taskId: string, userId: string) => {
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

  return prisma.taskComment.findMany({
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
      createdAt: "asc",
    },
  });
};

export const updateTaskComment = async ({
  taskId,
  commentId,
  content,
  userId,
}: UpdateTaskCommentInput) => {
  const comment = await prisma.taskComment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      task: true,
    },
  });

  if (!comment) {
    throw AppError("Comment not found", 404);
  }

  if (comment.taskId !== taskId) {
    throw AppError("Comment does not belong to this task", 400);
  }

  if (comment.userId !== userId) {
    throw AppError("You can only edit your own comments", 403);
  }

  const updatedComment = await prisma.taskComment.update({
    where: {
      id: commentId,
    },
    data: {
      content,
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
  });

  await createTaskActivity({
    taskId,
    userId,
    type: "COMMENT_UPDATED",
    metadata: {
      commentId,
    },
  });

  return updatedComment;
};

export const deleteTaskComment = async ({
  taskId,
  commentId,
  userId,
}: DeleteTaskCommentInput) => {
  const comment = await prisma.taskComment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      task: true,
    },
  });

  if (!comment) {
    throw AppError("Comment not found", 404);
  }

  if (comment.taskId !== taskId) {
    throw AppError("Comment does not belong to this task", 400);
  }

  const projectMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: comment.task.projectId,
        userId,
      },
    },
  });

  if (!projectMember) {
    throw AppError("You are not a member of this project", 403);
  }

  if (comment.userId !== userId && projectMember.role !== "ADMIN") {
    throw AppError(
      "Only the comment author or project admin can delete this comment",
      403,
    );
  }

  await prisma.taskComment.delete({
    where: {
      id: commentId,
    },
  });

  await createTaskActivity({
    taskId,
    userId,
    type: "COMMENT_DELETED",
    metadata: {
      commentId,
    },
  });

  return {
    message: "Comment deleted successfully",
  };
};
