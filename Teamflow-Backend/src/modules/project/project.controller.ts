import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware";
import * as projectService from "./project.service";

export const createProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const project = await projectService.createProject({
      name: req.body.name,
      description: req.body.description,
      workspaceId: req.body.workspaceId,
      createdById: req.user!.userId,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectsByWorkspace = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId || Array.isArray(workspaceId)) {
      throw new Error("Invalid workspace ID");
    }

    const projects = await projectService.getProjectsByWorkspace(
      workspaceId,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { projectId } = req.params;

    if (!projectId || Array.isArray(projectId)) {
      throw new Error("Invalid project ID");
    }

    const project = await projectService.getProjectById(
      projectId,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { projectId } = req.params;

    if (!projectId || Array.isArray(projectId)) {
      throw new Error("Invalid project ID");
    }

    const project = await projectService.updateProject({
      projectId,
      name: req.body.name,
      description: req.body.description,
      updatedById: req.user!.userId,
    });

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { projectId } = req.params;

    if (!projectId || Array.isArray(projectId)) {
      throw new Error("Invalid project ID");
    }

    const result = await projectService.deleteProject({
      projectId,
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

export const addProjectMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { projectId } = req.params;

    if (!projectId || Array.isArray(projectId)) {
      throw new Error("Invalid project ID");
    }

    const projectMember = await projectService.addProjectMember({
      projectId,
      userId: req.body.userId,
      addedById: req.user!.userId,
    });

    res.status(201).json({
      success: true,
      data: projectMember,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectMembers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { projectId } = req.params;

    if (!projectId || Array.isArray(projectId)) {
      throw new Error("Invalid project ID");
    }

    const members = await projectService.getProjectMembers(
      projectId,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

export const removeProjectMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { projectId, userId } = req.params;

    if (
      !projectId ||
      Array.isArray(projectId) ||
      !userId ||
      Array.isArray(userId)
    ) {
      throw new Error("Invalid project or user ID");
    }

    const result = await projectService.removeProjectMember({
      projectId,
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

export const updateProjectMemberRole = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { projectId, userId } = req.params;

    if (
      !projectId ||
      Array.isArray(projectId) ||
      !userId ||
      Array.isArray(userId)
    ) {
      throw new Error("Invalid project or user ID");
    }

    const result = await projectService.updateProjectMemberRole({
      projectId,
      userId,
      role: req.body.role,
      updatedById: req.user!.userId,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
