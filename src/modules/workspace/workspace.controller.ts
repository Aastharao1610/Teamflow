import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware";
import * as workspaceService from "./workspace.service";

export const createWorkspace = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const workspace = await workspaceService.createWorkspace({
      name: req.body.name,
      description: req.body.description,
      organizationId: req.body.organizationId,
      createdById: req.user!.userId,
    });

    res.status(201).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkspacesByOrganization = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { organizationId } = req.params;

    if (!organizationId || Array.isArray(organizationId)) {
      throw new Error("Invalid organization ID");
    }

    const workspaces = await workspaceService.getWorkspacesByOrganization(
      organizationId,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      data: workspaces,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId || Array.isArray(workspaceId)) {
      throw new Error("Invalid workspace ID");
    }

    const workspace = await workspaceService.getWorkspaceById(
      workspaceId,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};
export const updateWorkspace = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId || Array.isArray(workspaceId)) {
      throw new Error("Invalid workspace ID");
    }

    const updatedWorkspace = await workspaceService.updateWorkspace(
      workspaceId,
      req.user!.userId,
      req.body,
    );

    res.status(200).json({
      success: true,
      data: updatedWorkspace,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspace = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId || Array.isArray(workspaceId)) {
      throw new Error("Invalid workspace ID");
    }

    await workspaceService.deleteWorkspace(workspaceId, req.user!.userId);

    res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const addWorkspaceMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId || Array.isArray(workspaceId)) {
      throw new Error("Invalid workspace ID");
    }

    const workspaceMember = await workspaceService.addWorkspaceMember({
      workspaceId,
      userId: req.body.userId,
      addedById: req.user!.userId,
    });

    res.status(201).json({
      success: true,
      data: workspaceMember,
    });
  } catch (error) {
    next(error);
  }
};

export const getworkspaceMembers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId || Array.isArray(workspaceId)) {
      throw new Error("Invalid workspace ID");
    }

    const members = await workspaceService.getWorkspaceMembers(
      workspaceId,
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

export const removeWorkspaceMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId, userId } = req.params;

    if (
      !workspaceId ||
      Array.isArray(workspaceId) ||
      !userId ||
      Array.isArray(userId)
    ) {
      throw new Error("Invalid workspace or user ID");
    }

    const result = await workspaceService.removeWorkspaceMember({
      workspaceId,
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

export const updateWorkspaceMemberRole = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId, userId } = req.params;

    if (
      !workspaceId ||
      Array.isArray(workspaceId) ||
      !userId ||
      Array.isArray(userId)
    ) {
      throw new Error("Invalid workspace or user ID");
    }

    const result = await workspaceService.updateWorkspaceMemberRole({
      workspaceId,
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
