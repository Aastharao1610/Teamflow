import prisma from "../../lib/prisma";
import type {
  AcceptInvitationInput,
  CreateOrganizationInput,
  LeaveOrganizationInput,
  RejectInvitationInput,
  RemoveMemberInput,
  TransferOwnershipInput,
} from "./organization.types";
import { AppError } from "../../utils/AppError";
import crypto from "crypto";
import type { InviteMemberInput } from "./organization.types";
import { sendMail } from "../../lib/mail";

import { ORGANIZATION_ROLE, INVITATION_STATUS } from "./organization.constants";

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
          role: ORGANIZATION_ROLE.OWNER,
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

  console.log("Organizations for userId", userId, ":", organizations);
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

  data: { name?: string },
) => {
  const organization = await prisma.organization.findUnique({
    where: { slug },
  });

  if (!organization) {
    throw AppError("Organization not found", 404);
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

  return organization;
};

export const deleteOrganization = async (id: string, userId: string) => {
  const organization = await prisma.organization.findUnique({
    where: { id },
  });

  if (!organization) {
    throw AppError("Orgnanization not found", 404);
  }

  await prisma.organization.delete({
    where: { id },
  });
  return { message: "Organization deleted successfully" };
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

  await sendMail({
    to: email,
    subject: "Organization Invitation",
    html: `
      <h2>You've been invited!</h2>

      <p>Click below to join the organization.</p>

      <a href="http://localhost:3001/invitations/${token}">
        Accept Invitation
      </a>
    `,
  });

  return invitation;
};

export const acceptInvitation = async ({
  token,
  userId,
}: AcceptInvitationInput) => {
  const invitation = await prisma.organizationInvitation.findUnique({
    where: {
      token,
    },
  });

  if (!invitation) {
    throw AppError("Invalid invitation token", 400);
  }
  if (invitation.status !== INVITATION_STATUS.PENDING) {
    throw AppError("Invitation already accepted or rejected", 400);
  }
  if (invitation.expiresAt < new Date()) {
    throw AppError("Invitation token expired", 400);
  }

  const existingMember = await prisma.organizationMember.findFirst({
    where: {
      organizationId: invitation.organizationId,
      userId,
    },
  });
  if (existingMember) {
    throw AppError("User is already a member of the organization", 400);
  }

  await prisma.organizationMember.create({
    data: {
      organizationId: invitation.organizationId,
      userId,
      role: ORGANIZATION_ROLE.MEMBER,
    },
  });
  await prisma.organizationInvitation.update({
    where: {
      id: invitation.id,
    },
    data: {
      status: INVITATION_STATUS.ACCEPTED,
    },
  });
  return { message: "Invitation accepted successfully" };
};

export const rejectInvitation = async ({ token }: RejectInvitationInput) => {
  const invitation = await prisma.organizationInvitation.findUnique({
    where: {
      token,
    },
  });

  if (!invitation) {
    throw AppError("Invitation not found", 404);
  }

  if (invitation.status !== INVITATION_STATUS.PENDING) {
    throw AppError("Invitation has already been processed", 400);
  }

  if (invitation.expiresAt < new Date()) {
    throw AppError("Invitation has expired", 400);
  }

  await prisma.organizationInvitation.update({
    where: {
      id: invitation.id,
    },
    data: {
      status: INVITATION_STATUS.REJECTED,
    },
  });

  return;
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

  const member = await prisma.organizationMember.findFirst({
    where: {
      organizationId,
      userId,
    },
  });

  if (!member) {
    throw AppError("You are not a member", 404);
  }

  await prisma.organizationMember.delete({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  });

  return;
};

export const removeMember = async ({
  organizationId,
  memberId,
}: RemoveMemberInput) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
  });

  if (!organization) {
    throw AppError("Organization not found", 404);
  }

  const member = await prisma.organizationMember.findFirst({
    where: {
      organizationId,
      userId: memberId,
    },
  });

  if (!member) {
    throw AppError("Member not found", 404);
  }

  if (member.userId === organization.ownerId) {
    throw AppError("Owner cannot remove themselves", 400);
  }

  await prisma.organizationMember.delete({
    where: {
      organizationId_userId: {
        organizationId,
        userId: memberId,
      },
    },
  });

  return;
};

export const transferOwnership = async ({
  organizationId,
  currentOwnerId,
  newOwnerId,
}: TransferOwnershipInput) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
  });

  if (!organization) {
    throw AppError("Organization not found", 404);
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
    throw AppError("New owner must be a member", 404);
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
        role: ORGANIZATION_ROLE.ADMIN,
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
        role: ORGANIZATION_ROLE.OWNER,
      },
    }),
  ]);

  return;
};
