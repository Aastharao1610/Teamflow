import prisma from "../../lib/prisma";
import type { CreateOrganizationInput } from "./organization.types";
import { AppError } from "../../utils/AppError";
import crypto from "crypto";
import type { InviteMemberInput } from "./organization.types";
import { sendMail } from "../../lib/mail";

const generateSlug = (name: string)=>{
    return name
         .trim()
         .toLowerCase()
         .replace(/[^a-z0-9]+/g, "-")
         .replace(/^-+|-+$/g, "");
}

export const createOrganization =async(input: CreateOrganizationInput)=>{
    const {name, userId} = input;

    const slug = generateSlug(name);

    const existingOrganization = await prisma.organization.findUnique({
        where: { slug },
    });

    if(existingOrganization){
        throw AppError("Organization with this name already exists", 400);
    }

    const organization =
    await prisma.organization.create({
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
}   

export const getMyOrganizations = async (userId: string) => {
  const organizations = await prisma.organization.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    },
    include: {
      members: true,
    },
  });

  console.log("Organizations for userId", userId, ":", organizations);
  return organizations;
};


export const getOrganizationBySlug =async(slug: string ,userId  :string) =>{
   const organization = await prisma.organization.findUnique({
    where :{
        slug,
        members : {
            some:{
                userId
            },
        },
    },
    include :{
        owner : {
            select :{
                id:true,
                name : true,
                email :true
            }
        },
        members : {
            include :{
                user : {
             select :{
                id:true,
                name : true,
                email :true
            }
          }
        }
      },
    }
    
   });
   if(!organization){
    throw AppError("Organization not found or you don't have access to it", 404);
   }

   return organization;
}


export const updateOrganization = async (slug: string, userId: string, data: { name?: string }) => {
  const organization = await prisma.organization.findUnique({
    where: { slug },
  });

  if (!organization) {
    throw AppError("Organization not found", 404);
  }

  if (organization.ownerId !== userId) {
    throw AppError("You are not authorized to update this organization", 403);
  }

  const updatedOrganization = await prisma.organization.update({
    where: { slug },
    data,
  });

  return updatedOrganization;
}


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

  const isMember = organization.members.some(member => member.userId === userId);
  if (organization.ownerId !== userId && !isMember) {
    throw AppError("You don't have access to this organization", 403);
  }

  return organization;
};



export const deleteOrganization = async (id: string, userId: string) => {
    const organization = await prisma.organization.findUnique({
        where : { id }
    })

    if(!organization){
        throw AppError("Orgnanization not found", 404);
    }
    if(organization.ownerId !== userId){
        throw AppError("You are not authorized to delete this organization", 403);
    }
    await prisma.organization.delete({
        where : { id }
    })
    return { message : "Organization deleted successfully" }
}

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
    throw AppError(
      "Only owner can invite members",
      403
    );
  }

  const existingMember =
    await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        user: {
          email,
        },
      },
    });

  if (existingMember) {
    throw AppError(
      "User is already a member",
      400
    );
  }

  const token = crypto.randomBytes(32).toString("hex");

  const invitation =
    await prisma.organizationInvitation.create({
      data: {
        email,
        token,
        organizationId,
        invitedById,
        expiresAt: new Date(
          Date.now() + 1000 * 60 * 60 * 24
        ),
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
