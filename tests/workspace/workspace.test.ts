import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app";
import prisma from "../../src/lib/prisma";
import { createTestUser, authHeader } from "../helpers/auth";

describe("Workspace endpoints", () => {
  it("should reject creating a workspace without authentication", async () => {
    const response = await request(app).post("/api/v1/workspace").send({
      name: "Test Workspace",
      description: "This is a test workspace",
      organizationId: "test-organization-id",
    });

    expect(response.status).toBe(401);
  });

  it("should reject getting organization workspaces without authentication", async () => {
    const response = await request(app).get(
      "/api/v1/workspace/organization/test-organization-id",
    );

    expect(response.status).toBe(401);
  });

  it("should reject getting a workspace without authentication", async () => {
    const response = await request(app).get(
      "/api/v1/workspace/test-workspace-id",
    );

    expect(response.status).toBe(401);
  });

  it("should reject updating a workspace without authentication", async () => {
    const response = await request(app)
      .put("/api/v1/workspace/test-workspace-id")
      .send({
        name: "Updated Workspace",
      });

    expect(response.status).toBe(401);
  });

  it("should reject deleting a workspace without authentication", async () => {
    const response = await request(app).delete(
      "/api/v1/workspace/test-workspace-id",
    );

    expect(response.status).toBe(401);
  });

  it("should reject adding a workspace member without authentication", async () => {
    const response = await request(app)
      .post("/api/v1/workspace/test-workspace-id/members")
      .send({
        userId: "test-user-id",
      });

    expect(response.status).toBe(401);
  });

  it("should reject getting workspace members without authentication", async () => {
    const response = await request(app).get(
      "/api/v1/workspace/test-workspace-id/members",
    );

    expect(response.status).toBe(401);
  });

  it("should reject removing a workspace member without authentication", async () => {
    const response = await request(app).delete(
      "/api/v1/workspace/test-workspace-id/members/test-user-id",
    );

    expect(response.status).toBe(401);
  });

  it("should reject updating a workspace member role without authentication", async () => {
    const response = await request(app)
      .patch("/api/v1/workspace/test-workspace-id/members/test-user-id")
      .send({
        role: "ADMIN",
      });

    expect(response.status).toBe(401);
  });
  it("should allow an organization owner to create a workspace", async () => {
    const { user: owner } = await createTestUser({
      email: `workspace-owner-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace Organization ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    const response = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Test Workspace ${Date.now()}`,
        description: "This is a test workspace",
        organizationId,
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();

    expect(response.body.data.name).toContain("Test Workspace");
    expect(response.body.data.organizationId).toBe(organizationId);
    expect(response.body.data.createdById).toBe(owner.id);

    const workspace = await prisma.workspace.findUnique({
      where: {
        id: response.body.data.id,
      },
      include: {
        members: true,
      },
    });

    expect(workspace).not.toBeNull();
    expect(workspace?.createdById).toBe(owner.id);

    expect(
      workspace?.members.some(
        (member) => member.userId === owner.id && member.role === "ADMIN",
      ),
    ).toBe(true);
  });
  it("should reject a non-member from creating a workspace", async () => {
    const { user: owner } = await createTestUser({
      email: `create-nonmember-owner-${Date.now()}@test.com`,
    });

    const { user: nonMember } = await createTestUser({
      email: `create-nonmember-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace Non Member Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    const response = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(nonMember.id))
      .send({
        name: "Unauthorized Workspace",
        description: "This workspace should not be created",
        organizationId,
      });

    expect(response.status).toBe(403);
  });

  it("should reject an organization member without admin role from creating a workspace", async () => {
    const { user: owner } = await createTestUser({
      email: `create-member-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `create-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace Member Role Org ${Date.now()}`,
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
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(member.id))
      .send({
        name: "Member Workspace",
        description: "Member should not create workspace",
        organizationId,
      });

    expect(response.status).toBe(403);
  });

  it("should allow an organization admin to create a workspace", async () => {
    const { user: owner } = await createTestUser({
      email: `create-admin-owner-${Date.now()}@test.com`,
    });

    const { user: admin } = await createTestUser({
      email: `create-admin-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace Admin Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    await prisma.organizationMember.create({
      data: {
        organizationId,
        userId: admin.id,
        role: "ADMIN",
      },
    });

    const response = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(admin.id))
      .send({
        name: "Admin Workspace",
        description: "Workspace created by organization admin",
        organizationId,
      });

    expect(response.status).toBe(201);
    expect(response.body.data.organizationId).toBe(organizationId);
    expect(response.body.data.createdById).toBe(admin.id);

    const workspaceMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: response.body.data.id,
          userId: admin.id,
        },
      },
    });

    expect(workspaceMember?.role).toBe("ADMIN");
  });

  it("should reject creating a workspace with invalid input", async () => {
    const { user } = await createTestUser({
      email: `workspace-validation-${Date.now()}@test.com`,
    });

    const response = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(user.id))
      .send({
        name: "A",
        description: "short",
        organizationId: "",
      });

    expect(response.status).toBe(400);
  });

  it("should allow a workspace member to view the workspace", async () => {
    const { user: owner } = await createTestUser({
      email: `workspace-view-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `workspace-view-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace View Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Viewable Workspace",
        description: "Workspace for member viewing",
        organizationId,
      });

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;

    await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .get(`/api/v1/workspace/${workspaceId}`)
      .set("Authorization", authHeader(member.id));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(workspaceId);
  });

  it("should reject a non-member from viewing a workspace", async () => {
    const { user: owner } = await createTestUser({
      email: `workspace-private-owner-${Date.now()}@test.com`,
    });

    const { user: nonMember } = await createTestUser({
      email: `workspace-private-user-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace Private Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Private Workspace",
        description: "Private workspace test",
        organizationId: organizationResponse.body.data.id,
      });

    expect(workspaceResponse.status).toBe(201);

    const response = await request(app)
      .get(`/api/v1/workspace/${workspaceResponse.body.data.id}`)
      .set("Authorization", authHeader(nonMember.id));

    expect(response.status).toBe(403);
  });

  it("should reject getting a nonexistent workspace", async () => {
    const { user } = await createTestUser({
      email: `workspace-notfound-${Date.now()}@test.com`,
    });

    const response = await request(app)
      .get("/api/v1/workspace/nonexistent-workspace")
      .set("Authorization", authHeader(user.id));

    expect(response.status).toBe(404);
  });

  it("should allow a workspace admin to update the workspace", async () => {
    const { user: owner } = await createTestUser({
      email: `workspace-update-owner-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace Update Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Old Workspace Name",
        description: "Old workspace description",
        organizationId: organizationResponse.body.data.id,
      });

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;

    const response = await request(app)
      .put(`/api/v1/workspace/${workspaceId}`)
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Updated Workspace Name",
        description: "Updated workspace description",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("Updated Workspace Name");
    expect(response.body.data.description).toBe(
      "Updated workspace description",
    );
  });

  it("should reject a workspace member from updating the workspace", async () => {
    const { user: owner } = await createTestUser({
      email: `workspace-update-member-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `workspace-update-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace Update Member Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Member Update Workspace",
        description: "Member update test workspace",
        organizationId: organizationResponse.body.data.id,
      });

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;

    await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .put(`/api/v1/workspace/${workspaceId}`)
      .set("Authorization", authHeader(member.id))
      .send({
        name: "Unauthorized Update",
      });

    expect(response.status).toBe(403);
  });

  it("should allow a workspace admin to delete the workspace", async () => {
    const { user: owner } = await createTestUser({
      email: `workspace-delete-owner-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace Delete Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Delete Workspace",
        description: "Workspace deletion test",
        organizationId: organizationResponse.body.data.id,
      });

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;

    const response = await request(app)
      .delete(`/api/v1/workspace/${workspaceId}`)
      .set("Authorization", authHeader(owner.id));

    expect(response.status).toBe(200);

    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
    });

    expect(workspace).toBeNull();
  });

  it("should reject a workspace member from deleting the workspace", async () => {
    const { user: owner } = await createTestUser({
      email: `workspace-delete-member-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `workspace-delete-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace Delete Member Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Member Delete Workspace",
        description: "Member delete test workspace",
        organizationId: organizationResponse.body.data.id,
      });

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;

    await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .delete(`/api/v1/workspace/${workspaceId}`)
      .set("Authorization", authHeader(member.id));

    expect(response.status).toBe(403);
  });

  it("should allow a workspace admin to add a member", async () => {
    const { user: owner } = await createTestUser({
      email: `workspace-add-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `workspace-add-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace Add Org ${Date.now()}`,
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

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Add Member Workspace",
        description: "Workspace add member test",
        organizationId,
      });

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;

    const response = await request(app)
      .post(`/api/v1/workspace/${workspaceId}/members`)
      .set("Authorization", authHeader(owner.id))
      .send({
        userId: member.id,
      });

    expect(response.status).toBe(201);

    const workspaceMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: member.id,
        },
      },
    });

    expect(workspaceMember).not.toBeNull();
    expect(workspaceMember?.role).toBe("MEMBER");
  });

  it("should reject a workspace member from adding another member", async () => {
    const { user: owner } = await createTestUser({
      email: `workspace-add-nonadmin-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `workspace-add-nonadmin-member-${Date.now()}@test.com`,
    });

    const { user: newMember } = await createTestUser({
      email: `workspace-add-nonadmin-new-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace Add Non Admin Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Add Member Permission Workspace",
        description: "Workspace member permission test",
        organizationId: organizationResponse.body.data.id,
      });

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;

    await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .post(`/api/v1/workspace/${workspaceId}/members`)
      .set("Authorization", authHeader(member.id))
      .send({
        userId: newMember.id,
      });

    expect(response.status).toBe(403);
  });

  it("should reject adding an existing workspace member", async () => {
    const { user: owner } = await createTestUser({
      email: `workspace-existing-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `workspace-existing-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace Existing Org ${Date.now()}`,
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

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Existing Member Workspace",
        description: "Existing member test workspace",
        organizationId: organizationResponse.body.data.id,
      });

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;

    await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .post(`/api/v1/workspace/${workspaceId}/members`)
      .set("Authorization", authHeader(owner.id))
      .send({
        userId: member.id,
      });

    expect(response.status).toBe(400);
  });

  it("should allow a workspace member to view workspace members", async () => {
    const { user: owner } = await createTestUser({
      email: `workspace-members-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `workspace-members-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace Members Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Members Workspace",
        description: "Workspace members viewing test",
        organizationId: organizationResponse.body.data.id,
      });

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;

    await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .get(`/api/v1/workspace/${workspaceId}/members`)
      .set("Authorization", authHeader(member.id));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBe(2);
  });

  it("should reject a non-member from viewing workspace members", async () => {
    const { user: owner } = await createTestUser({
      email: `workspace-members-private-owner-${Date.now()}@test.com`,
    });

    const { user: nonMember } = await createTestUser({
      email: `workspace-members-private-user-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace Members Private Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Private Members Workspace",
        description: "Private workspace members test",
        organizationId: organizationResponse.body.data.id,
      });

    expect(workspaceResponse.status).toBe(201);

    const response = await request(app)
      .get(`/api/v1/workspace/${workspaceResponse.body.data.id}/members`)
      .set("Authorization", authHeader(nonMember.id));

    expect(response.status).toBe(403);
  });

  it("should allow a workspace admin to remove a member", async () => {
    const { user: owner } = await createTestUser({
      email: `workspace-remove-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `workspace-remove-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace Remove Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Remove Member Workspace",
        description: "Workspace remove member test",
        organizationId: organizationResponse.body.data.id,
      });

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;

    await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .delete(`/api/v1/workspace/${workspaceId}/members/${member.id}`)
      .set("Authorization", authHeader(owner.id));

    expect(response.status).toBe(200);

    const workspaceMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: member.id,
        },
      },
    });

    expect(workspaceMember).toBeNull();
  });

  it("should reject a workspace member from removing another member", async () => {
    const { user: owner } = await createTestUser({
      email: `workspace-remove-nonadmin-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `workspace-remove-nonadmin-member-${Date.now()}@test.com`,
    });

    const { user: target } = await createTestUser({
      email: `workspace-remove-target-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace Remove Permission Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Remove Permission Workspace",
        description: "Workspace remove permission test",
        organizationId: organizationResponse.body.data.id,
      });

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;

    await prisma.workspaceMember.createMany({
      data: [
        {
          workspaceId,
          userId: member.id,
          role: "MEMBER",
        },
        {
          workspaceId,
          userId: target.id,
          role: "MEMBER",
        },
      ],
    });

    const response = await request(app)
      .delete(`/api/v1/workspace/${workspaceId}/members/${target.id}`)
      .set("Authorization", authHeader(member.id));

    expect(response.status).toBe(403);
  });

  it("should allow a workspace admin to update a member role", async () => {
    const { user: owner } = await createTestUser({
      email: `workspace-role-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `workspace-role-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace Role Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Role Workspace",
        description: "Workspace role update test",
        organizationId: organizationResponse.body.data.id,
      });

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;

    await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .patch(`/api/v1/workspace/${workspaceId}/members/${member.id}`)
      .set("Authorization", authHeader(owner.id))
      .send({
        role: "ADMIN",
      });

    expect(response.status).toBe(200);

    const workspaceMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: member.id,
        },
      },
    });

    expect(workspaceMember?.role).toBe("ADMIN");
  });

  it("should reject a workspace member from updating another member role", async () => {
    const { user: owner } = await createTestUser({
      email: `workspace-role-permission-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `workspace-role-permission-member-${Date.now()}@test.com`,
    });

    const { user: target } = await createTestUser({
      email: `workspace-role-permission-target-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace Role Permission Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Role Permission Workspace",
        description: "Workspace role permission test",
        organizationId: organizationResponse.body.data.id,
      });

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;

    await prisma.workspaceMember.createMany({
      data: [
        {
          workspaceId,
          userId: member.id,
          role: "MEMBER",
        },
        {
          workspaceId,
          userId: target.id,
          role: "MEMBER",
        },
      ],
    });

    const response = await request(app)
      .patch(`/api/v1/workspace/${workspaceId}/members/${target.id}`)
      .set("Authorization", authHeader(member.id))
      .send({
        role: "ADMIN",
      });

    expect(response.status).toBe(403);
  });

  it("should reject assigning an invalid workspace member role", async () => {
    const { user } = await createTestUser({
      email: `workspace-role-validation-${Date.now()}@test.com`,
    });

    const response = await request(app)
      .patch("/api/v1/workspace/test-workspace-id/members/test-user-id")
      .set("Authorization", authHeader(user.id))
      .send({
        role: "OWNER",
      });

    expect(response.status).toBe(400);
  });

  it("should allow an admin to list organization workspaces", async () => {
    const { user: owner } = await createTestUser({
      email: `workspace-list-owner-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace List Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    for (let i = 1; i <= 2; i++) {
      const response = await request(app)
        .post("/api/v1/workspace")
        .set("Authorization", authHeader(owner.id))
        .send({
          name: `List Workspace ${i} ${Date.now()}`,
          description: `Workspace number ${i} for listing`,
          organizationId,
        });

      expect(response.status).toBe(201);
    }

    const response = await request(app)
      .get(`/api/v1/workspace/organization/${organizationId}`)
      .set("Authorization", authHeader(owner.id));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBe(2);
  });

  it("should reject an organization member from listing workspaces they are not workspace members of", async () => {
    const { user: owner } = await createTestUser({
      email: `workspace-list-private-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `workspace-list-private-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Workspace List Private Org ${Date.now()}`,
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

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Private List Workspace",
        description: "Workspace listing membership test",
        organizationId,
      });

    expect(workspaceResponse.status).toBe(201);

    const response = await request(app)
      .get(`/api/v1/workspace/organization/${organizationId}`)
      .set("Authorization", authHeader(member.id));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBe(0);
  });
});
