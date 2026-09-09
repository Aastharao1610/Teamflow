import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app";
import prisma from "../../src/lib/prisma";
import { createTestUser, authHeader } from "../helpers/auth";

describe("Organization endpoints", () => {
  it("should reject creating an organization without authentication", async () => {
    const response = await request(app).post("/api/v1/organization").send({
      name: "Test Organization",
    });

    expect(response.status).toBe(401);
  });

  it("should reject creating an organization with an invalid name", async () => {
    // This test intentionally has no authentication.
    // Authentication happens before validation on this route,
    // so 401 is the expected response.
    const response = await request(app).post("/api/v1/organization").send({
      name: "A",
    });

    expect(response.status).toBe(401);
  });

  it("should reject getting organizations without authentication", async () => {
    const response = await request(app).get("/api/v1/organization");

    expect(response.status).toBe(401);
  });

  it("should reject getting an organization by slug without authentication", async () => {
    const response = await request(app).get(
      "/api/v1/organization/slug/test-organization",
    );

    expect(response.status).toBe(401);
  });

  it("should reject getting an organization by ID without authentication", async () => {
    const response = await request(app).get("/api/v1/organization/test-id");

    expect(response.status).toBe(401);
  });

  it("should reject deleting an organization without authentication", async () => {
    const response = await request(app).delete("/api/v1/organization/test-id");

    expect(response.status).toBe(401);
  });

  it("should reject inviting a member without authentication", async () => {
    const response = await request(app)
      .post("/api/v1/organization/test-id/invite")
      .send({
        email: "test@example.com",
      });

    expect(response.status).toBe(401);
  });

  it("should reject accepting an invitation without authentication", async () => {
    const response = await request(app)
      .post("/api/v1/organization/accept-invitation")
      .send({
        invitationToken: "test-token",
      });

    expect(response.status).toBe(401);
  });

  it("should reject leaving an organization without authentication", async () => {
    const response = await request(app).post(
      "/api/v1/organization/test-id/leave",
    );

    expect(response.status).toBe(401);
  });

  it("should reject transferring ownership without authentication", async () => {
    const response = await request(app)
      .post("/api/v1/organization/test-id/transfer-ownership")
      .send({
        newOwnerId: "test-user-id",
      });

    expect(response.status).toBe(401);
  });
  it("should allow an authenticated user to create an organization", async () => {
    console.log("1 - creating user");

    const { user } = await createTestUser({
      email: `owner-${Date.now()}@test.com`,
    });

    console.log("2 - user created:", user.id);

    const token = authHeader(user.id);

    console.log("3 - token created");

    const response = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", token)
      .send({
        name: `Test Organization ${Date.now()}`,
      });

    console.log("4 - response received:", response.status);
    console.log("5 - response body:", response.body);

    expect(response.status).toBe(201);
  });
  it("should allow the organization owner to update the organization", async () => {
    const { user } = await createTestUser({
      email: `update-owner-${Date.now()}@test.com`,
    });

    const createResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(user.id))
      .send({
        name: `Original Organization ${Date.now()}`,
      });

    expect(createResponse.status).toBe(201);

    const slug = createResponse.body.data.slug;

    const updateResponse = await request(app)
      .put(`/api/v1/organization/${slug}`)
      .set("Authorization", authHeader(user.id))
      .send({
        name: `Updated Organization ${Date.now()}`,
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.success).toBe(true);
    expect(updateResponse.body.data.name).toContain("Updated Organization");
  });
  it("should reject organization update by a non-owner", async () => {
    const { user: owner } = await createTestUser({
      email: `owner-update-${Date.now()}@test.com`,
    });

    const { user: otherUser } = await createTestUser({
      email: `other-update-${Date.now()}@test.com`,
    });

    const createResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Owner Organization ${Date.now()}`,
      });

    expect(createResponse.status).toBe(201);

    const slug = createResponse.body.data.slug;

    const updateResponse = await request(app)
      .put(`/api/v1/organization/${slug}`)
      .set("Authorization", authHeader(otherUser.id))
      .send({
        name: `Unauthorized Update ${Date.now()}`,
      });

    expect(updateResponse.status).toBe(403);
  });
  it("should allow the organization owner to delete the organization", async () => {
    const { user } = await createTestUser({
      email: `delete-owner-${Date.now()}@test.com`,
    });

    const createResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(user.id))
      .send({
        name: `Delete Organization ${Date.now()}`,
      });

    expect(createResponse.status).toBe(201);

    const organizationId = createResponse.body.data.id;

    const deleteResponse = await request(app)
      .delete(`/api/v1/organization/${organizationId}`)
      .set("Authorization", authHeader(user.id));

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.success).toBe(true);

    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    expect(organization).toBeNull();
  });
  it("should reject organization deletion by a non-owner", async () => {
    const { user: owner } = await createTestUser({
      email: `owner-delete-${Date.now()}@test.com`,
    });

    const { user: otherUser } = await createTestUser({
      email: `other-delete-${Date.now()}@test.com`,
    });

    const createResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Protected Organization ${Date.now()}`,
      });

    expect(createResponse.status).toBe(201);

    const organizationId = createResponse.body.data.id;

    const deleteResponse = await request(app)
      .delete(`/api/v1/organization/${organizationId}`)
      .set("Authorization", authHeader(otherUser.id));

    expect(deleteResponse.status).toBe(403);

    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    expect(organization).not.toBeNull();
  });
  it("should allow an organization member to view the organization", async () => {
    const { user: owner } = await createTestUser({
      email: `member-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `member-${Date.now()}@test.com`,
    });

    const createResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Member Access Organization ${Date.now()}`,
      });

    expect(createResponse.status).toBe(201);

    const organizationId = createResponse.body.data.id;

    await prisma.organizationMember.create({
      data: {
        organizationId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .get(`/api/v1/organization/${organizationId}`)
      .set("Authorization", authHeader(member.id));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(organizationId);
  });
  it("should reject a non-member from viewing the organization", async () => {
    const { user: owner } = await createTestUser({
      email: `access-owner-${Date.now()}@test.com`,
    });

    const { user: nonMember } = await createTestUser({
      email: `non-member-${Date.now()}@test.com`,
    });

    const createResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Private Organization ${Date.now()}`,
      });

    expect(createResponse.status).toBe(201);

    const organizationId = createResponse.body.data.id;

    const response = await request(app)
      .get(`/api/v1/organization/${organizationId}`)
      .set("Authorization", authHeader(nonMember.id));

    expect(response.status).toBe(403);
  });
  it("should reject an organization member from updating the organization", async () => {
    const { user: owner } = await createTestUser({
      email: `member-update-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `member-update-${Date.now()}@test.com`,
    });

    const createResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Member Update Organization ${Date.now()}`,
      });

    expect(createResponse.status).toBe(201);

    const slug = createResponse.body.data.slug;
    const organizationId = createResponse.body.data.id;

    await prisma.organizationMember.create({
      data: {
        organizationId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .put(`/api/v1/organization/${slug}`)
      .set("Authorization", authHeader(member.id))
      .send({
        name: `Unauthorized Member Update ${Date.now()}`,
      });

    expect(response.status).toBe(403);
  });
  it("should allow an organization member to view the organization", async () => {
    // console.log("1 - creating owner");

    const { user: owner } = await createTestUser({
      email: `member-owner-${Date.now()}@test.com`,
    });

    // console.log("2 - owner created:", owner.id);

    const { user: member } = await createTestUser({
      email: `member-${Date.now()}@test.com`,
    });

    // console.log("3 - member created:", member.id);

    const createResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Member Access Organization ${Date.now()}`,
      });

    // console.log("4 - organization created:", createResponse.status);

    const organizationId = createResponse.body.data.id;

    // console.log("5 - organization id:", organizationId);

    await prisma.organizationMember.create({
      data: {
        organizationId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    // console.log("6 - member added");

    const response = await request(app)
      .get(`/api/v1/organization/${organizationId}`)
      .set("Authorization", authHeader(member.id));

    // console.log("7 - response received:", response.status);
    // console.log("8 - response body:", response.body);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(organizationId);
  });
  it("should allow the organization owner to invite a member", async () => {
    const { user: owner } = await createTestUser({
      email: `invite-owner-${Date.now()}@test.com`,
    });

    const invitedEmail = `invited-${Date.now()}@test.com`;

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Invite Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    const response = await request(app)
      .post(`/api/v1/organization/${organizationId}/invite`)
      .set("Authorization", authHeader(owner.id))
      .send({
        email: invitedEmail,
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();

    const invitation = await prisma.organizationInvitation.findUnique({
      where: {
        id: response.body.data.id,
      },
    });

    expect(invitation).not.toBeNull();
    expect(invitation?.email).toBe(invitedEmail);
    expect(invitation?.organizationId).toBe(organizationId);
    expect(invitation?.invitedById).toBe(owner.id);
    expect(invitation?.status).toBe("PENDING");
    expect(invitation?.token).toBeDefined();
  });
  it("should reject a non-owner from inviting a member", async () => {
    const { user: owner } = await createTestUser({
      email: `invite-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `invite-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Invite Auth Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    // Add member directly for this authorization test.
    await prisma.organizationMember.create({
      data: {
        organizationId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .post(`/api/v1/organization/${organizationId}/invite`)
      .set("Authorization", authHeader(member.id))
      .send({
        email: `another-user-${Date.now()}@test.com`,
      });

    expect(response.status).toBe(403);
  });
  it("should reject inviting an existing organization member", async () => {
    const { user: owner } = await createTestUser({
      email: `duplicate-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `duplicate-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Duplicate Member Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    await prisma.organizationMember.create({
      data: {
        organizationId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .post(`/api/v1/organization/${organizationId}/invite`)
      .set("Authorization", authHeader(owner.id))
      .send({
        email: member.email,
      });

    expect(response.status).toBe(400);
  });
  it("should allow an invited user to accept an organization invitation", async () => {
    const { user: owner } = await createTestUser({
      email: `accept-owner-${Date.now()}@test.com`,
    });

    const { user: invitedUser } = await createTestUser({
      email: `accept-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Accept Invitation Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    const inviteResponse = await request(app)
      .post(`/api/v1/organization/${organizationId}/invite`)
      .set("Authorization", authHeader(owner.id))
      .send({
        email: invitedUser.email,
      });

    expect(inviteResponse.status).toBe(201);

    const invitation = await prisma.organizationInvitation.findFirst({
      where: {
        organizationId,
        email: invitedUser.email,
        status: "PENDING",
      },
    });

    expect(invitation).not.toBeNull();

    const response = await request(app)
      .post("/api/v1/organization/accept-invitation")
      .set("Authorization", authHeader(invitedUser.id))
      .send({
        invitationToken: invitation!.token,
      });

    expect(response.status).toBe(200);

    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: invitedUser.id,
        },
      },
    });

    expect(membership).not.toBeNull();
    expect(membership?.role).toBe("MEMBER");

    const updatedInvitation = await prisma.organizationInvitation.findUnique({
      where: {
        id: invitation!.id,
      },
    });

    expect(updatedInvitation?.status).toBe("ACCEPTED");
  });
  it("should reject a different user from accepting an invitation", async () => {
    const { user: owner } = await createTestUser({
      email: `wrong-owner-${Date.now()}@test.com`,
    });

    const { user: invitedUser } = await createTestUser({
      email: `real-invitee-${Date.now()}@test.com`,
    });

    const { user: wrongUser } = await createTestUser({
      email: `wrong-invitee-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Wrong User Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    const inviteResponse = await request(app)
      .post(`/api/v1/organization/${organizationId}/invite`)
      .set("Authorization", authHeader(owner.id))
      .send({
        email: invitedUser.email,
      });

    expect(inviteResponse.status).toBe(201);

    const invitation = await prisma.organizationInvitation.findFirst({
      where: {
        organizationId,
        email: invitedUser.email,
        status: "PENDING",
      },
    });

    expect(invitation).not.toBeNull();

    const response = await request(app)
      .post("/api/v1/organization/accept-invitation")
      .set("Authorization", authHeader(wrongUser.id))
      .send({
        invitationToken: invitation!.token,
      });

    expect(response.status).toBe(403);

    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: wrongUser.id,
        },
      },
    });

    expect(membership).toBeNull();
  });
  it("should reject accepting an invalid invitation token", async () => {
    const { user } = await createTestUser({
      email: `invalid-token-${Date.now()}@test.com`,
    });

    const response = await request(app)
      .post("/api/v1/organization/accept-invitation")
      .set("Authorization", authHeader(user.id))
      .send({
        invitationToken: "invalid-invitation-token",
      });

    expect(response.status).toBe(400);
  });
  it("should reject an expired organization invitation", async () => {
    const { user: owner } = await createTestUser({
      email: `expired-owner-${Date.now()}@test.com`,
    });

    const { user: invitedUser } = await createTestUser({
      email: `expired-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Expired Invitation Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    const inviteResponse = await request(app)
      .post(`/api/v1/organization/${organizationId}/invite`)
      .set("Authorization", authHeader(owner.id))
      .send({
        email: invitedUser.email,
      });

    expect(inviteResponse.status).toBe(201);

    const invitation = await prisma.organizationInvitation.findFirst({
      where: {
        organizationId,
        email: invitedUser.email,
        status: "PENDING",
      },
    });

    expect(invitation).not.toBeNull();

    await prisma.organizationInvitation.update({
      where: {
        id: invitation!.id,
      },
      data: {
        expiresAt: new Date(Date.now() - 1000),
      },
    });

    const response = await request(app)
      .post("/api/v1/organization/accept-invitation")
      .set("Authorization", authHeader(invitedUser.id))
      .send({
        invitationToken: invitation!.token,
      });

    expect(response.status).toBe(400);

    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: invitedUser.id,
        },
      },
    });

    expect(membership).toBeNull();
  });
  it("should reject accepting an already processed invitation", async () => {
    const { user: owner } = await createTestUser({
      email: `processed-owner-${Date.now()}@test.com`,
    });

    const { user: invitedUser } = await createTestUser({
      email: `processed-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Processed Invitation Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    const inviteResponse = await request(app)
      .post(`/api/v1/organization/${organizationId}/invite`)
      .set("Authorization", authHeader(owner.id))
      .send({
        email: invitedUser.email,
      });

    expect(inviteResponse.status).toBe(201);

    const invitation = await prisma.organizationInvitation.findFirst({
      where: {
        organizationId,
        email: invitedUser.email,
        status: "PENDING",
      },
    });

    expect(invitation).not.toBeNull();

    await prisma.organizationInvitation.update({
      where: {
        id: invitation!.id,
      },
      data: {
        status: "ACCEPTED",
      },
    });

    const response = await request(app)
      .post("/api/v1/organization/accept-invitation")
      .set("Authorization", authHeader(invitedUser.id))
      .send({
        invitationToken: invitation!.token,
      });

    expect(response.status).toBe(400);
  });
  it("should allow an invited user to reject an organization invitation", async () => {
    const { user: owner } = await createTestUser({
      email: `reject-owner-${Date.now()}@test.com`,
    });

    const { user: invitedUser } = await createTestUser({
      email: `reject-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Reject Invitation Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    const inviteResponse = await request(app)
      .post(`/api/v1/organization/${organizationId}/invite`)
      .set("Authorization", authHeader(owner.id))
      .send({
        email: invitedUser.email,
      });

    expect(inviteResponse.status).toBe(201);

    const invitation = await prisma.organizationInvitation.findFirst({
      where: {
        organizationId,
        email: invitedUser.email,
        status: "PENDING",
      },
    });

    expect(invitation).not.toBeNull();

    const response = await request(app)
      .post("/api/v1/organization/reject-invitation")
      .set("Authorization", authHeader(invitedUser.id))
      .send({
        organizationId,
        inviteToken: invitation!.token,
      });

    expect(response.status).toBe(200);

    const updatedInvitation = await prisma.organizationInvitation.findUnique({
      where: {
        id: invitation!.id,
      },
    });

    expect(updatedInvitation?.status).toBe("REJECTED");

    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: invitedUser.id,
        },
      },
    });

    expect(membership).toBeNull();
  });
  it("should reject a different user from rejecting an invitation", async () => {
    const { user: owner } = await createTestUser({
      email: `reject-wrong-owner-${Date.now()}@test.com`,
    });

    const { user: invitedUser } = await createTestUser({
      email: `reject-real-member-${Date.now()}@test.com`,
    });

    const { user: wrongUser } = await createTestUser({
      email: `reject-wrong-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Wrong Reject Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    const inviteResponse = await request(app)
      .post(`/api/v1/organization/${organizationId}/invite`)
      .set("Authorization", authHeader(owner.id))
      .send({
        email: invitedUser.email,
      });

    expect(inviteResponse.status).toBe(201);

    const invitation = await prisma.organizationInvitation.findFirst({
      where: {
        organizationId,
        email: invitedUser.email,
        status: "PENDING",
      },
    });

    expect(invitation).not.toBeNull();

    const response = await request(app)
      .post("/api/v1/organization/reject-invitation")
      .set("Authorization", authHeader(wrongUser.id))
      .send({
        organizationId,
        inviteToken: invitation!.token,
      });

    expect(response.status).toBe(403);

    const unchangedInvitation = await prisma.organizationInvitation.findUnique({
      where: {
        id: invitation!.id,
      },
    });

    expect(unchangedInvitation?.status).toBe("PENDING");
  });
  it("should allow the organization owner to remove a member", async () => {
    const { user: owner } = await createTestUser({
      email: `remove-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `remove-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Remove Member Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    await prisma.organizationMember.create({
      data: {
        organizationId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .delete(`/api/v1/organization/${organizationId}/members/${member.id}`)
      .set("Authorization", authHeader(owner.id));

    expect(response.status).toBe(200);

    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: member.id,
        },
      },
    });

    expect(membership).toBeNull();
  });
  it("should reject a non-owner from removing a member", async () => {
    const { user: owner } = await createTestUser({
      email: `remove-auth-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `remove-auth-member-${Date.now()}@test.com`,
    });

    const { user: anotherMember } = await createTestUser({
      email: `remove-auth-another-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Remove Authorization Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    await prisma.organizationMember.createMany({
      data: [
        {
          organizationId,
          userId: member.id,
          role: "MEMBER",
        },
        {
          organizationId,
          userId: anotherMember.id,
          role: "MEMBER",
        },
      ],
    });

    const response = await request(app)
      .delete(
        `/api/v1/organization/${organizationId}/members/${anotherMember.id}`,
      )
      .set("Authorization", authHeader(member.id));

    expect(response.status).toBe(403);

    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: anotherMember.id,
        },
      },
    });

    expect(membership).not.toBeNull();
  });
  it("should reject removing a nonexistent organization member", async () => {
    const { user: owner } = await createTestUser({
      email: `missing-member-owner-${Date.now()}@test.com`,
    });

    const { user: nonexistentMember } = await createTestUser({
      email: `missing-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Missing Member Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    const response = await request(app)
      .delete(
        `/api/v1/organization/${organizationId}/members/${nonexistentMember.id}`,
      )
      .set("Authorization", authHeader(owner.id));

    expect(response.status).toBe(404);
  });
  it("should allow an organization member to leave the organization", async () => {
    const { user: owner } = await createTestUser({
      email: `leave-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `leave-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Leave Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    await prisma.organizationMember.create({
      data: {
        organizationId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .post(`/api/v1/organization/${organizationId}/leave`)
      .set("Authorization", authHeader(member.id));

    expect(response.status).toBe(200);

    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: member.id,
        },
      },
    });

    expect(membership).toBeNull();
  });
  it("should reject the organization owner from leaving", async () => {
    const { user: owner } = await createTestUser({
      email: `leave-owner-self-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Owner Leave Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    const response = await request(app)
      .post(`/api/v1/organization/${organizationId}/leave`)
      .set("Authorization", authHeader(owner.id));

    expect(response.status).toBe(400);

    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    expect(organization?.ownerId).toBe(owner.id);
  });
  it("should reject a non-member from leaving the organization", async () => {
    const { user: owner } = await createTestUser({
      email: `leave-nonmember-owner-${Date.now()}@test.com`,
    });

    const { user: nonMember } = await createTestUser({
      email: `leave-nonmember-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Non Member Leave Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    const response = await request(app)
      .post(`/api/v1/organization/${organizationId}/leave`)
      .set("Authorization", authHeader(nonMember.id));

    expect(response.status).toBe(403);
  });
  it("should allow the organization owner to transfer ownership to a member", async () => {
    const { user: owner } = await createTestUser({
      email: `transfer-owner-${Date.now()}@test.com`,
    });

    const { user: newOwner } = await createTestUser({
      email: `transfer-new-owner-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Transfer Ownership Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    await prisma.organizationMember.create({
      data: {
        organizationId,
        userId: newOwner.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .post(`/api/v1/organization/${organizationId}/transfer-ownership`)
      .set("Authorization", authHeader(owner.id))
      .send({
        newOwnerId: newOwner.id,
      });

    expect(response.status).toBe(200);

    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    expect(organization?.ownerId).toBe(newOwner.id);

    const oldOwnerMembership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: owner.id,
        },
      },
    });

    expect(oldOwnerMembership?.role).toBe("MEMBER");
  });
  it("should reject a non-owner from transferring ownership", async () => {
    const { user: owner } = await createTestUser({
      email: `transfer-auth-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `transfer-auth-member-${Date.now()}@test.com`,
    });

    const { user: anotherMember } = await createTestUser({
      email: `transfer-auth-another-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Transfer Auth Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    await prisma.organizationMember.createMany({
      data: [
        {
          organizationId,
          userId: member.id,
          role: "MEMBER",
        },
        {
          organizationId,
          userId: anotherMember.id,
          role: "MEMBER",
        },
      ],
    });

    const response = await request(app)
      .post(`/api/v1/organization/${organizationId}/transfer-ownership`)
      .set("Authorization", authHeader(member.id))
      .send({
        newOwnerId: anotherMember.id,
      });

    expect(response.status).toBe(403);

    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    expect(organization?.ownerId).toBe(owner.id);
  });
  it("should reject transferring ownership to a non-member", async () => {
    const { user: owner } = await createTestUser({
      email: `transfer-nonmember-owner-${Date.now()}@test.com`,
    });

    const { user: nonMember } = await createTestUser({
      email: `transfer-nonmember-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Transfer Non Member Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    const response = await request(app)
      .post(`/api/v1/organization/${organizationId}/transfer-ownership`)
      .set("Authorization", authHeader(owner.id))
      .send({
        newOwnerId: nonMember.id,
      });

    expect(response.status).toBe(400);

    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    expect(organization?.ownerId).toBe(owner.id);
  });
  it("should reject transferring ownership to the current owner", async () => {
    const { user: owner } = await createTestUser({
      email: `transfer-self-owner-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Transfer Self Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    const response = await request(app)
      .post(`/api/v1/organization/${organizationId}/transfer-ownership`)
      .set("Authorization", authHeader(owner.id))
      .send({
        newOwnerId: owner.id,
      });

    expect(response.status).toBe(400);

    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    expect(organization?.ownerId).toBe(owner.id);
  });
});
