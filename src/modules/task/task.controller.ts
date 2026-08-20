import type { NextFunction, Response } from "express";

import type { AuthRequest } from "../../middlewares/auth.middleware";

import * as taskService from "./task.service";

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const task = await taskService.createTask({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      projectId: req.body.projectId,
      createdById: req.user!.userId,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const getTasksByProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { projectId } = req.params;

    if (!projectId || Array.isArray(projectId)) {
      throw new Error("Invalid project ID");
    }

    const result = await taskService.getTasksByProject({
      projectId,
      userId: req.user!.userId,
      ...(req.query.page !== undefined && {
        page: req.query.page as unknown as number,
      }),
      ...(req.query.limit !== undefined && {
        limit: req.query.limit as unknown as number,
      }),
      ...(req.query.search !== undefined && {
        search: req.query.search as string,
      }),
      ...(req.query.status !== undefined && {
        status: req.query.status as
          | "TODO"
          | "IN_PROGRESS"
          | "DONE"
          | "CANCELLED",
      }),
      ...(req.query.priority !== undefined && {
        priority: req.query.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      }),
      ...(req.query.assigneeId !== undefined && {
        assigneeId: req.query.assigneeId as string,
      }),
      ...(req.query.sortBy !== undefined && {
        sortBy: req.query.sortBy as
          | "createdAt"
          | "updatedAt"
          | "title"
          | "dueDate",
      }),
      ...(req.query.sortOrder !== undefined && {
        sortOrder: req.query.sortOrder as "asc" | "desc",
      }),
    });

    res.status(200).json({
      success: true,
      data: result.tasks,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { taskId } = req.params;

    if (!taskId || Array.isArray(taskId)) {
      throw new Error("Invalid task ID");
    }

    const task = await taskService.getTaskById(taskId, req.user!.userId);

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { taskId } = req.params;

    if (!taskId || Array.isArray(taskId)) {
      throw new Error("Invalid task ID");
    }

    const task = await taskService.updateTask({
      taskId,
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      status: req.body.status,
      dueDate: req.body.dueDate,
      updatedById: req.user!.userId,
    });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { taskId } = req.params;

    if (!taskId || Array.isArray(taskId)) {
      throw new Error("Invalid task ID");
    }

    const result = await taskService.deleteTask({
      taskId,
      deletedById: req.user!.userId,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const addTaskAssignee = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { taskId } = req.params;

    if (!taskId || Array.isArray(taskId)) {
      throw new Error("Invalid task ID");
    }

    const assignee = await taskService.addTaskAssignee({
      taskId,
      userId: req.body.userId,
      assignedById: req.user!.userId,
    });

    res.status(201).json({
      success: true,
      data: assignee,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskAssignees = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { taskId } = req.params;

    if (!taskId || Array.isArray(taskId)) {
      throw new Error("Invalid task ID");
    }

    const assignees = await taskService.getTaskAssignees(
      taskId,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      data: assignees,
    });
  } catch (error) {
    next(error);
  }
};

export const removeTaskAssignee = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { taskId, userId } = req.params;

    if (!taskId || Array.isArray(taskId) || !userId || Array.isArray(userId)) {
      throw new Error("Invalid task or user ID");
    }

    const result = await taskService.removeTaskAssignee({
      taskId,
      userId,
      removedById: req.user!.userId,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createTaskComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { taskId } = req.params;

    if (!taskId || Array.isArray(taskId)) {
      throw new Error("Invalid task ID");
    }

    const comment = await taskService.createTaskComment({
      taskId,
      content: req.body.content,
      userId: req.user!.userId,
    });

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskComments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { taskId } = req.params;

    if (!taskId || Array.isArray(taskId)) {
      throw new Error("Invalid task ID");
    }

    const comments = await taskService.getTaskComments(
      taskId,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { taskId, commentId } = req.params;

    if (
      !taskId ||
      Array.isArray(taskId) ||
      !commentId ||
      Array.isArray(commentId)
    ) {
      throw new Error("Invalid task or comment ID");
    }

    const comment = await taskService.updateTaskComment({
      taskId,
      commentId,
      content: req.body.content,
      userId: req.user!.userId,
    });

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTaskComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { taskId, commentId } = req.params;

    if (
      !taskId ||
      Array.isArray(taskId) ||
      !commentId ||
      Array.isArray(commentId)
    ) {
      throw new Error("Invalid task or comment ID");
    }

    const result = await taskService.deleteTaskComment({
      taskId,
      commentId,
      userId: req.user!.userId,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
