import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import crypto from "crypto";
import { notificationQueue } from "../../lib/queue";
import { queueOrganizationInvitationEmail } from "../notification/email.queue";

import { sendMail } from "../../lib/mail";
import type {
  AcceptInvitationInput,
  CreateOrganizationInput,
  InviteMemberInput,
  LeaveOrganizationInput,
  RejectInvitationInput,
  RemoveMemberInput,
  TransferOwnershipInput,
} from "./organization.types";
const generateSlug = (name: string) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const createOrganization = async (input: CreateOrganizationInput) => {
  const { name, userId } = input;

  const slug = generateSlug(name);

  const existingOrganization = await prisma.organization.findUnique({
    where: { slug },
  });

  if (existingOrganization) {
    throw AppError("Organization with this name already exists", 400);
  }

  const organization = await prisma.organization.create({
    data: {
      name,
      slug,
      ownerId: userId,

      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },

    include: {
      members: true,
    },
  });

  return organization;
};

export const getMyOrganizations = async (userId: string) => {
  const organizations = await prisma.organization.findMany({
    where: {
      OR: [{ ownerId: userId }, { members: { some: { userId } } }],
    },
    include: {
      members: true,
    },
  });

  return organizations;
};

export const getOrganizationBySlug = async (slug: string, userId: string) => {
  const organization = await prisma.organization.findUnique({
    where: {
      slug,
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
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
    },
  });
  if (!organization) {
    throw AppError(
      "Organization not found or you don't have access to it",
      404,
    );
  }

  return organization;
};

export const updateOrganization = async (
  slug: string,
  userId: string,
  data: { name?: string },
) => {
  const organization = await prisma.organization.findUnique({
    where: { slug },
  });

  if (!organization) {
    throw AppError("Organization not found", 404);
  }

  if (organization.ownerId !== userId) {
    throw AppError("Only the organization owner can update it", 403);
  }

  const updatedOrganization = await prisma.organization.update({
    where: { slug },
    data,
  });

  return updatedOrganization;
};

export const getOrganizationById = async (id: string, userId: string) => {
  const organization = await prisma.organization.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
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
    },
  });

  if (!organization) {
    throw AppError("Organization not found", 404);
  }

  const isMember = organization.members.some(
    (member) => member.userId === userId,
  );
  if (organization.ownerId !== userId && !isMember) {
    throw AppError("You don't have access to this organization", 403);
  }

  return organization;
};

export const deleteOrganization = async (id: string, userId: string) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id,
    },
  });

  if (!organization) {
    throw AppError("Organization not found", 404);
  }

  if (organization.ownerId !== userId) {
    throw AppError("Only the organization owner can delete it", 403);
  }

  await prisma.organization.delete({
    where: {
      id,
    },
  });

  return {
    message: "Organization deleted successfully",
  };
};

export const inviteMember = async ({
  organizationId,
  email,
  invitedById,
}: InviteMemberInput) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
  });

  if (!organization) {
    throw AppError("Organization not found", 404);
  }

  if (organization.ownerId !== invitedById) {
    throw AppError("Only owner can invite members", 403);
  }

  const existingMember = await prisma.organizationMember.findFirst({
    where: {
      organizationId,
      user: {
        email,
      },
    },
  });

  if (existingMember) {
    throw AppError("User is already a member", 400);
  }

  const token = crypto.randomBytes(32).toString("hex");

  const invitation = await prisma.organizationInvitation.create({
    data: {
      email,
      token,
      organizationId,
      invitedById,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  const inviteUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  await queueOrganizationInvitationEmail({
    to: email,
    organizationName: organization.name,
    token,
  });

  if (inviteUser) {
    await notificationQueue.add("create-notification", {
      userId: inviteUser.id,
      type: "ORGANIZATION_INVITATION",
      title: "Organization invited",
      message: `you have been invited to join ${organization.name}`,
      data: {
        organizationId,
        invitationId: invitation.id,
      },
    });
  }
  return invitation;
};

export const acceptInvitation = async ({
  invitationToken,
  userId,
}: AcceptInvitationInput) => {
  const invitation = await prisma.organizationInvitation.findUnique({
    where: {
      token: invitationToken,
    },
  });

  if (!invitation) {
    throw AppError("Invalid invitation token", 400);
  }

  if (invitation.status !== "PENDING") {
    throw AppError("Invitation has already been processed", 400);
  }

  if (invitation.expiresAt < new Date()) {
    throw AppError("Invitation has expired", 400);
  }
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      email: true,
    },
  });

  if (!user) {
    throw AppError("User not found", 404);
  }

  if (user.email !== invitation.email) {
    throw AppError(
      "This invitation was sent to a different email address",
      403,
    );
  }

  const existingMember = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: invitation.organizationId,
        userId,
      },
    },
  });

  if (existingMember) {
    throw AppError("You are already a member of this organization", 400);
  }

  await prisma.$transaction([
    prisma.organizationMember.create({
      data: {
        organizationId: invitation.organizationId,
        userId,
        role: "MEMBER",
      },
    }),

    prisma.organizationInvitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        status: "ACCEPTED",
      },
    }),
  ]);

  return {
    message: "Invitation accepted successfully",
  };
};

export const rejectInvitation = async ({
  organizationId,
  userId,
  inviteToken,
}: RejectInvitationInput) => {
  const invitation = await prisma.organizationInvitation.findUnique({
    where: {
      token: inviteToken,
    },
  });

  if (!invitation) {
    throw AppError("Invalid invitation token", 400);
  }

  if (invitation.organizationId !== organizationId) {
    throw AppError("Invitation does not belong to this organization", 403);
  }

  if (invitation.status !== "PENDING") {
    throw AppError("Invitation has already been processed", 400);
  }

  if (invitation.expiresAt < new Date()) {
    throw AppError("Invitation has expired", 400);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      email: true,
    },
  });

  if (!user) {
    throw AppError("User not found", 404);
  }

  if (user.email !== invitation.email) {
    throw AppError(
      "This invitation was sent to a different email address",
      403,
    );
  }

  await prisma.organizationInvitation.update({
    where: {
      id: invitation.id,
    },
    data: {
      status: "REJECTED",
    },
  });

  return {
    message: "Invitation rejected successfully",
  };
};
export const removeMember = async ({
  organizationId,
  memberId,
  removedById,
}: RemoveMemberInput) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
  });

  if (!organization) {
    throw AppError("Organization not found", 404);
  }

  if (organization.ownerId !== removedById) {
    throw AppError("Only the organization owner can remove members", 403);
  }

  if (memberId === organization.ownerId) {
    throw AppError("Owner cannot be removed from the organization", 400);
  }

  const member = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId: memberId,
      },
    },
  });

  if (!member) {
    throw AppError("Organization member not found", 404);
  }

  await prisma.organizationMember.delete({
    where: {
      organizationId_userId: {
        organizationId,
        userId: memberId,
      },
    },
  });

  return {
    message: "Organization member removed successfully",
  };
};

export const leaveOrganization = async ({
  organizationId,
  userId,
}: LeaveOrganizationInput) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
  });

  if (!organization) {
    throw AppError("Organization not found", 404);
  }

  if (organization.ownerId === userId) {
    throw AppError(
      "Owner cannot leave the organization. Transfer ownership first.",
      400,
    );
  }

  const member = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  });

  if (!member) {
    throw AppError("You are not a member of this organization", 403);
  }

  await prisma.organizationMember.delete({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  });

  return {
    message: "You left the organization successfully",
  };
};
export const transferOwnership = async ({
  organizationId,
  newOwnerId,
  currentOwnerId,
}: TransferOwnershipInput) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
  });

  if (!organization) {
    throw AppError("Organization not found", 404);
  }

  if (organization.ownerId !== currentOwnerId) {
    throw AppError("Only the organization owner can transfer ownership", 403);
  }

  if (newOwnerId === currentOwnerId) {
    throw AppError("You are already the owner", 400);
  }

  const newOwner = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId: newOwnerId,
      },
    },
  });

  if (!newOwner) {
    throw AppError(
      "New owner must already be a member of the organization",
      400,
    );
  }

  await prisma.$transaction([
    prisma.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        ownerId: newOwnerId,
      },
    }),

    prisma.organizationMember.update({
      where: {
        organizationId_userId: {
          organizationId,
          userId: currentOwnerId,
        },
      },
      data: {
        role: "MEMBER",
      },
    }),

    prisma.organizationMember.update({
      where: {
        organizationId_userId: {
          organizationId,
          userId: newOwnerId,
        },
      },
      data: {
        role: "OWNER",
      },
    }),
  ]);

  return {
    message: "Organization ownership transferred successfully",
  };
};
