import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { notificationQueue } from "../../lib/queue";
import type {
  AddProjectMemberInput,
  CreateProjectInput,
  DeleteProjectInput,
  RemoveProjectMemberInput,
  UpdateProjectInput,
  UpdateProjectMemberRoleInput,
} from "./project.types";

export const createProject = async ({
  name,
  description,
  workspaceId,
  createdById,
}: CreateProjectInput) => {
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

  const workspaceMember = workspace.members.find(
    (member) => member.userId === createdById,
  );

  if (!workspaceMember) {
    throw AppError("You are not a member of this workspace", 403);
  }

  if (workspaceMember.role !== "ADMIN") {
    throw AppError("Only workspace admins can create projects", 403);
  }

  const project = await prisma.project.create({
    data: {
      name,
      ...(description !== undefined ? { description } : {}),
      workspaceId,
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

  return project;
};

export const getProjectsByWorkspace = async (
  workspaceId: string,
  userId: string,
) => {
  const workspaceMember = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  });

  if (!workspaceMember) {
    throw AppError("You are not a member of this workspace", 403);
  }

  const projects = await prisma.project.findMany({
    where: {
      workspaceId,
      members: {
        some: {
          userId,
        },
      },
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects;
};

export const getProjectById = async (projectId: string, userId: string) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      workspace: {
        select: {
          id: true,
          name: true,
          organizationId: true,
        },
      },
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
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!project) {
    throw AppError("Project not found", 404);
  }

  const isMember = project.members.some((member) => member.userId === userId);

  if (!isMember) {
    throw AppError("You are not a member of this project", 403);
  }

  return project;
};

export const updateProject = async ({
  projectId,
  name,
  description,
  updatedById,
}: UpdateProjectInput) => {
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

  const member = project.members.find(
    (member) => member.userId === updatedById,
  );

  if (!member) {
    throw AppError("You are not a member of this project", 403);
  }

  if (member.role !== "ADMIN") {
    throw AppError("Only project admins can update the project", 403);
  }

  const updatedProject = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(description !== undefined ? { description } : {}),
    },
  });

  return updatedProject;
};

export const deleteProject = async ({
  projectId,
  deletedById,
}: DeleteProjectInput) => {
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

  const member = project.members.find(
    (member) => member.userId === deletedById,
  );

  if (!member) {
    throw AppError("You are not a member of this project", 403);
  }

  if (member.role !== "ADMIN") {
    throw AppError("Only project admins can delete the project", 403);
  }

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  return {
    message: "Project deleted successfully",
  };
};

export const addProjectMember = async ({
  projectId,
  userId,
  addedById,
}: AddProjectMemberInput) => {
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

  const admin = project.members.find((member) => member.userId === addedById);

  if (!admin) {
    throw AppError("You are not a member of this project", 403);
  }

  if (admin.role !== "ADMIN") {
    throw AppError("Only project admins can add members", 403);
  }

  const workspaceMember = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: project.workspaceId,
        userId,
      },
    },
  });

  if (!workspaceMember) {
    throw AppError("User must be a member of the workspace", 403);
  }

  const existingMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  if (existingMember) {
    throw AppError("User is already a member of this project", 400);
  }

  const projectMember = await prisma.projectMember.create({
    data: {
      projectId,
      userId,
      role: "MEMBER",
    },
  });

  await notificationQueue.add("create-notification", {
    userId,
    type: "PROJECT_MEMBER_ADDED",
    title: "Added to project",
    message: "You have been added to project",
    data: {
      projectId,
    },
  });
  return projectMember;
};

export const getProjectMembers = async (projectId: string, userId: string) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
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

  if (!project) {
    throw AppError("Project not found", 404);
  }

  const isMember = project.members.some((member) => member.userId === userId);

  if (!isMember) {
    throw AppError("You are not a member of this project", 403);
  }

  return project.members;
};

export const removeProjectMember = async ({
  projectId,
  userId,
  removedById,
}: RemoveProjectMemberInput) => {
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

  const admin = project.members.find((member) => member.userId === removedById);

  if (!admin) {
    throw AppError("You are not a member of this project", 403);
  }

  if (admin.role !== "ADMIN") {
    throw AppError("Only project admins can remove members", 403);
  }

  const member = project.members.find((member) => member.userId === userId);

  if (!member) {
    throw AppError("Project member not found", 404);
  }

  if (member.userId === removedById) {
    throw AppError("You cannot remove yourself from the project", 400);
  }

  if (member.role === "ADMIN") {
    const adminCount = project.members.filter(
      (member) => member.role === "ADMIN",
    ).length;

    if (adminCount === 1) {
      throw AppError("Cannot remove the last project admin", 400);
    }
  }

  await prisma.projectMember.delete({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  return {
    message: "Project member removed successfully",
  };
};

export const updateProjectMemberRole = async ({
  projectId,
  userId,
  role,
  updatedById,
}: UpdateProjectMemberRoleInput) => {
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

  const updater = project.members.find(
    (member) => member.userId === updatedById,
  );

  if (!updater) {
    throw AppError("You are not a member of this project", 403);
  }

  if (updater.role !== "ADMIN") {
    throw AppError("Only project admins can update member roles", 403);
  }

  const member = project.members.find((member) => member.userId === userId);

  if (!member) {
    throw AppError("Project member not found", 404);
  }

  if (member.role === role) {
    throw AppError(`Member is already a ${role}`, 400);
  }

  if (member.role === "ADMIN" && role === "MEMBER") {
    const adminCount = project.members.filter(
      (member) => member.role === "ADMIN",
    ).length;

    if (adminCount === 1) {
      throw AppError("Cannot remove the last project admin", 400);
    }
  }

  const updatedMember = await prisma.projectMember.update({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
    data: {
      role,
    },
  });

  return updatedMember;
};
