import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type {
  CreateWorkspaceInput,
  AddWorkspaceMemberInput,
  RemoveWorkspaceMemberInput,
  UpdateWorkspaceMemberRoleInput,
} from "./workspaace.types";

export const createWorkspace = async ({
  name,
  description,
  organizationId,
  createdById,
}: CreateWorkspaceInput) => {
  const organizationMember = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId: createdById,
      },
    },
  });

  if (!organizationMember) {
    throw AppError("You are not a member of this organization", 403);
  }

  if (
    organizationMember.role !== "OWNER" &&
    organizationMember.role !== "ADMIN"
  ) {
    throw AppError(
      "Only organization owners and admins can create workspaces",
      403,
    );
  }

  const workspace = await prisma.workspace.create({
    data: {
      name,
      ...(description !== undefined ? { description } : {}),
      organizationId,
      createdById,

      members: {
        create: {
          userId: createdById,
          role: "ADMIN",
        },
      },
    },
    include: {
      members: true,
    },
  });

  return workspace;
};

export const getWorkspacesByOrganization = async (
  organizationId: string,
  userId: string,
) => {
  const organizationMember = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  });

  if (!organizationMember) {
    throw AppError("You are not a member of this organization", 403);
  }

  const workspaces = await prisma.workspace.findMany({
    where: {
      organizationId,
    },
    include: {
      members: true,
    },
  });

  return workspaces;
};

export const getWorkspaceById = async (workspaceId: string, userId: string) => {
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
    include: {
      members: true,
    },
  });

  if (!workspace) {
    throw AppError("Workspace not found", 404);
  }

  const isMember = workspace.members.some((member) => member.userId === userId);

  if (!isMember) {
    throw AppError("You are not a member of this workspace", 403);
  }

  return workspace;
};

export const updateWorkspace = async (
  workspaceId: string,
  userId: string,
  data: { name?: string; description?: string },
) => {
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
    include: {
      members: true,
    },
  });

  if (!workspace) {
    throw AppError("Workspace not found", 404);
  }

  const member = workspace.members.find((member) => member.userId === userId);

  if (!member) {
    throw AppError("You are not a member of this workspace", 403);
  }

  if (member.role !== "ADMIN") {
    throw AppError("Only workspace admins can update the workspace", 403);
  }

  const updatedWorkspace = await prisma.workspace.update({
    where: {
      id: workspaceId,
    },
    data,
    include: {
      members: true,
    },
  });

  return updatedWorkspace;
};

export const deleteWorkspace = async (workspaceId: string, userId: string) => {
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
    include: {
      members: true,
    },
  });

  if (!workspace) {
    throw AppError("Workspace not found", 404);
  }

  const member = workspace.members.find((member) => member.userId === userId);

  if (!member) {
    throw AppError("You are not a member of this workspace", 403);
  }

  if (member.role !== "ADMIN") {
    throw AppError("Only workspace admins can delete the workspace", 403);
  }

  await prisma.workspace.delete({
    where: {
      id: workspaceId,
    },
  });

  return { message: "Workspace deleted successfully" };
};

export const addWorkspaceMember = async ({
  workspaceId,
  userId,
  addedById,
}: AddWorkspaceMemberInput) => {
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
    include: {
      members: true,
    },
  });

  if (!workspace) {
    throw AppError("Workspace not found", 404);
  }

  const admin = workspace.members.find((member) => member.userId === addedById);

  if (!admin) {
    throw AppError("You are not a member of this workspace", 403);
  }

  if (admin.role !== "ADMIN") {
    throw AppError("Only workspace admins can add members", 403);
  }

  const organizationMember = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: workspace.organizationId,
        userId,
      },
    },
  });

  if (!organizationMember) {
    throw AppError("User must be a member of the organization", 403);
  }

  const existingMember = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  });

  if (existingMember) {
    throw AppError("User is already a member of this workspace", 400);
  }

  const workspaceMember = await prisma.workspaceMember.create({
    data: {
      workspaceId,
      userId,
      role: "MEMBER",
    },
  });

  return workspaceMember;
};

export const getWorkspaceMembers = async (
  workspaceId: string,
  userId: string,
) => {
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
    include: {
      members: {
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

  if (!workspace) {
    throw AppError("Workspace not found", 404);
  }

  const isMember = workspace.members.some((member) => member.userId === userId);

  if (!isMember) {
    throw AppError("You are not a member of this workspace", 403);
  }

  return workspace.members;
};

export const removeWorkspaceMember = async ({
  workspaceId,
  userId,
  removedById,
}: RemoveWorkspaceMemberInput) => {
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
    include: {
      members: true,
    },
  });

  if (!workspace) {
    throw AppError("Workspace not found", 404);
  }

  const admin = workspace.members.find(
    (member) => member.userId === removedById,
  );

  if (!admin) {
    throw AppError("You are not a member of this workspace", 403);
  }

  if (admin.role !== "ADMIN") {
    throw AppError("Only workspace admins can remove members", 403);
  }

  const member = workspace.members.find((member) => member.userId === userId);

  if (!member) {
    throw AppError("Workspace member not found", 404);
  }

  if (member.userId === removedById) {
    throw AppError("You cannot remove yourself from the workspace", 400);
  }

  await prisma.workspaceMember.delete({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  });

  return {
    message: "Workspace member removed successfully",
  };
};

export const updateWorkspaceMemberRole = async ({
  workspaceId,
  userId,
  role,
  updatedById,
}: UpdateWorkspaceMemberRoleInput) => {
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
    include: {
      members: true,
    },
  });

  if (!workspace) {
    throw AppError("Workspace not found", 404);
  }

  const updater = workspace.members.find(
    (member) => member.userId === updatedById,
  );

  if (!updater) {
    throw AppError("You are not a member of this workspace", 403);
  }

  if (updater.role !== "ADMIN") {
    throw AppError("Only workspace admins can update member roles", 403);
  }

  const member = workspace.members.find((member) => member.userId === userId);

  if (!member) {
    throw AppError("Workspace member not found", 404);
  }

  if (member.role === role) {
    throw AppError(`Member is already a ${role}`, 400);
  }

  if (member.role === "ADMIN" && role === "MEMBER") {
    const adminCount = workspace.members.filter(
      (member) => member.role === "ADMIN",
    ).length;

    if (adminCount === 1) {
      throw AppError("Cannot remove the last workspace admin", 400);
    }
  }

  const updatedMember = await prisma.workspaceMember.update({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
    data: {
      role,
    },
  });

  return updatedMember;
};
