import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app";
import prisma from "../../src/lib/prisma";
import { authHeader, createTestUser } from "../helpers/auth";

describe("Project endpoints", () => {
  /*
   * CREATE PROJECT
   */
  it("should allow a workspace admin to create a project", async () => {
    const { user: owner } = await createTestUser({
      email: `project-owner-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Project Workspace",
        description: "Project workspace for testing",
        organizationId,
      });

    console.log("WORKSPACE STATUS:", workspaceResponse.status);
    console.log("WORKSPACE BODY:", workspaceResponse.body);

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;

    const response = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Test Project",
        description: "Project description",
        workspaceId,
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.name).toBe("Test Project");
    expect(response.body.data.workspaceId).toBe(workspaceId);

    const project = await prisma.project.findUnique({
      where: {
        id: response.body.data.id,
      },
    });

    expect(project).not.toBeNull();
    expect(project?.createdById).toBe(owner.id);
  });
  it("should reject creating a project without authentication", async () => {
    const response = await request(app).post("/api/v1/project").send({
      name: "Test Project",
      workspaceId: "test-workspace-id",
    });

    expect(response.status).toBe(401);
  });

  it("should reject creating a project with invalid data", async () => {
    const { user } = await createTestUser({
      email: `project-validation-${Date.now()}@test.com`,
    });

    const response = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(user.id))
      .send({
        name: "A",
        workspaceId: "",
      });

    expect(response.status).toBe(400);
  });

  it("should reject a workspace member without admin role from creating a project", async () => {
    const { user: owner } = await createTestUser({
      email: `project-admin-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `project-admin-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Member Org ${Date.now()}`,
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
        name: `Project Member Workspace ${Date.now()}`,
        description: "Project workspace for testing",
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
      .post("/api/v1/project")
      .set("Authorization", authHeader(member.id))
      .send({
        name: "Unauthorized Project",
        workspaceId,
      });

    expect(response.status).toBe(403);
  });

  /*
   * GET PROJECTS BY WORKSPACE
   */

  it("should reject getting workspace projects without authentication", async () => {
    const response = await request(app).get(
      "/api/v1/project/workspace/test-workspace-id",
    );

    expect(response.status).toBe(401);
  });

  it("should allow a workspace member to get projects", async () => {
    const { user } = await createTestUser({
      email: `project-list-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(user.id))
      .send({
        name: `Project List Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(user.id))
      .send({
        name: `Project List Workspace ${Date.now()}`,
        description: "Project workspace for tsting",
        organizationId: organizationResponse.body.data.id,
      });

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;

    const projectResponse = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(user.id))
      .send({
        name: "Listed Project",
        workspaceId,
      });

    expect(projectResponse.status).toBe(201);

    const response = await request(app)
      .get(`/api/v1/project/workspace/${workspaceId}`)
      .set("Authorization", authHeader(user.id));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should reject a non-member from getting workspace projects", async () => {
    const { user: owner } = await createTestUser({
      email: `project-list-owner-${Date.now()}@test.com`,
    });

    const { user: outsider } = await createTestUser({
      email: `project-list-outsider-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project List Access Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project List Access Workspace ${Date.now()}`,
        description: "Project workspace for testing",
        organizationId: organizationResponse.body.data.id,
      });

    expect(workspaceResponse.status).toBe(201);

    const response = await request(app)
      .get(`/api/v1/project/workspace/${workspaceResponse.body.data.id}`)
      .set("Authorization", authHeader(outsider.id));

    expect(response.status).toBe(403);
  });

  /*
   * GET PROJECT BY ID
   */

  it("should reject getting a project without authentication", async () => {
    const response = await request(app).get("/api/v1/project/test-project-id");

    expect(response.status).toBe(401);
  });

  it("should allow a project member to get a project", async () => {
    const { user } = await createTestUser({
      email: `project-get-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(user.id))
      .send({
        name: `Project Get Org ${Date.now()}`,
      });

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(user.id))
      .send({
        name: `Project Get Workspace ${Date.now()}`,
        description: "Project workspace for testing",
        organizationId: organizationResponse.body.data.id,
      });

    const projectResponse = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(user.id))
      .send({
        name: "Get Project",
        workspaceId: workspaceResponse.body.data.id,
      });

    expect(projectResponse.status).toBe(201);

    const projectId = projectResponse.body.data.id;

    const response = await request(app)
      .get(`/api/v1/project/${projectId}`)
      .set("Authorization", authHeader(user.id));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(projectId);
  });

  it("should reject a non-member from getting a project", async () => {
    const { user: owner } = await createTestUser({
      email: `project-get-owner-${Date.now()}@test.com`,
    });

    const { user: outsider } = await createTestUser({
      email: `project-get-outsider-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Get Access Org ${Date.now()}`,
      });

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Get Access Workspace ${Date.now()}`,
        description: "Project workspace for testing",
        organizationId: organizationResponse.body.data.id,
      });

    const projectResponse = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Private Project",
        workspaceId: workspaceResponse.body.data.id,
      });

    expect(projectResponse.status).toBe(201);

    const response = await request(app)
      .get(`/api/v1/project/${projectResponse.body.data.id}`)
      .set("Authorization", authHeader(outsider.id));

    expect(response.status).toBe(403);
  });

  /*
   * UPDATE PROJECT
   */

  it("should allow a project admin to update a project", async () => {
    const { user } = await createTestUser({
      email: `project-update-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(user.id))
      .send({
        name: `Project Update Org ${Date.now()}`,
      });

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(user.id))
      .send({
        name: `Project Update Workspace ${Date.now()}`,
        description: "Project workspace for testing",
        organizationId: organizationResponse.body.data.id,
      });

    console.log("DELETE TEST WORKSPACE STATUS:", workspaceResponse.status);
    console.log("DELETE TEST WORKSPACE BODY:", workspaceResponse.body);

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;
    const projectResponse = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(user.id))
      .send({
        name: "Original Project",
        workspaceId,
      });

    const response = await request(app)
      .patch(`/api/v1/project/${projectResponse.body.data.id}`)
      .set("Authorization", authHeader(user.id))
      .send({
        name: "Updated Project",
        description: "Updated description",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("Updated Project");
    expect(response.body.data.description).toBe("Updated description");
  });

  it("should reject a project member from updating a project", async () => {
    const { user: owner } = await createTestUser({
      email: `project-update-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `project-update-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Update Access Org ${Date.now()}`,
      });

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Update Access Workspace ${Date.now()}`,
        description: "Project workspace for testing",
        organizationId: organizationResponse.body.data.id,
      });

    console.log("WORKSPACE STATUS:", workspaceResponse.status);
    console.log("WORKSPACE BODY:", workspaceResponse.body);

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;

    const projectResponse = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Protected Project",
        workspaceId,
      });

    const projectId = projectResponse.body.data.id;

    await prisma.projectMember.create({
      data: {
        projectId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .patch(`/api/v1/project/${projectId}`)
      .set("Authorization", authHeader(member.id))
      .send({
        name: "Unauthorized Update",
      });

    expect(response.status).toBe(403);
  });

  /*
   * DELETE PROJECT
   */

  it("should allow a project admin to delete a project", async () => {
    const { user } = await createTestUser({
      email: `project-delete-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(user.id))
      .send({
        name: `Project Delete Org ${Date.now()}`,
      });

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(user.id))
      .send({
        name: `Project Delete Workspace ${Date.now()}`,
        description: "Project workspace for testing",
        organizationId: organizationResponse.body.data.id,
      });

    const projectResponse = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(user.id))
      .send({
        name: "Delete Project",
        workspaceId: workspaceResponse.body.data.id,
      });

    const projectId = projectResponse.body.data.id;

    const response = await request(app)
      .delete(`/api/v1/project/${projectId}`)
      .set("Authorization", authHeader(user.id));

    expect(response.status).toBe(200);

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    expect(project).toBeNull();
  });

  it("should reject a project member from deleting a project", async () => {
    const { user: owner } = await createTestUser({
      email: `project-delete-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `project-delete-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Delete Access Org ${Date.now()}`,
      });

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Delete Access Workspace ${Date.now()}`,
        description: "Project workspace for testing",
        organizationId: organizationResponse.body.data.id,
      });

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;
    const projectResponse = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Protected Delete Project",
        description: "Project workspace for testing",
        workspaceId,
      });

    const projectId = projectResponse.body.data.id;

    await prisma.projectMember.create({
      data: {
        projectId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .delete(`/api/v1/project/${projectId}`)
      .set("Authorization", authHeader(member.id));

    expect(response.status).toBe(403);
  });

  /*
   * ADD PROJECT MEMBER
   */

  it("should allow a project admin to add a member", async () => {
    const { user: owner } = await createTestUser({
      email: `project-add-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `project-add-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Add Org ${Date.now()}`,
      });

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
        name: `Project Add Workspace ${Date.now()}`,
        description: "Project workspace for testing",
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

    const projectResponse = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Add Member Project",
        workspaceId,
      });

    expect(projectResponse.status).toBe(201);

    const projectId = projectResponse.body.data.id;

    const response = await request(app)
      .post(`/api/v1/project/${projectId}/members`)
      .set("Authorization", authHeader(owner.id))
      .send({
        userId: member.id,
      });

    expect(response.status).toBe(201);

    const projectMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: member.id,
        },
      },
    });

    expect(projectMember).not.toBeNull();
    expect(projectMember?.role).toBe("MEMBER");
  });

  it("should reject adding an existing project member", async () => {
    const { user: owner } = await createTestUser({
      email: `project-existing-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `project-existing-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Existing Org ${Date.now()}`,
      });

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
        name: `Project Existing Workspace ${Date.now()}`,
        description: "Project workspace for testing",
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

    const projectResponse = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Existing Member Project",
        workspaceId: workspaceResponse.body.data.id,
      });

    const projectId = projectResponse.body.data.id;

    await prisma.projectMember.create({
      data: {
        projectId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .post(`/api/v1/project/${projectId}/members`)
      .set("Authorization", authHeader(owner.id))
      .send({
        userId: member.id,
      });

    expect(response.status).toBe(400);
  });

  it("should reject a project member from adding another member", async () => {
    const { user: owner } = await createTestUser({
      email: `project-add-access-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `project-add-access-member-${Date.now()}@test.com`,
    });

    const { user: target } = await createTestUser({
      email: `project-add-access-target-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Add Access Org ${Date.now()}`,
      });

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
          userId: target.id,
          role: "MEMBER",
        },
      ],
    });

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Add Access Workspace ${Date.now()}`,
        description: "Project workspace for testing",
        organizationId,
      });

    const projectResponse = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Protected Add Project",
        workspaceId: workspaceResponse.body.data.id,
      });

    const projectId = projectResponse.body.data.id;

    await prisma.projectMember.create({
      data: {
        projectId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .post(`/api/v1/project/${projectId}/members`)
      .set("Authorization", authHeader(member.id))
      .send({
        userId: target.id,
      });

    expect(response.status).toBe(403);
  });

  /*
   * GET PROJECT MEMBERS
   */

  it("should allow a project member to get project members", async () => {
    const { user } = await createTestUser({
      email: `project-members-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(user.id))
      .send({
        name: `Project Members Org ${Date.now()}`,
      });

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(user.id))
      .send({
        name: `Project Members Workspace ${Date.now()}`,
        description: "Project workspace for testing",
        organizationId: organizationResponse.body.data.id,
      });

    const projectResponse = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(user.id))
      .send({
        name: "Members Project",
        workspaceId: workspaceResponse.body.data.id,
      });

    const projectId = projectResponse.body.data.id;

    const response = await request(app)
      .get(`/api/v1/project/${projectId}/members`)
      .set("Authorization", authHeader(user.id));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should reject a non-member from getting project members", async () => {
    const { user: owner } = await createTestUser({
      email: `project-members-owner-${Date.now()}@test.com`,
    });

    const { user: outsider } = await createTestUser({
      email: `project-members-outsider-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Members Access Org ${Date.now()}`,
      });

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Members Access Workspace ${Date.now()}`,
        description: "Project workspace for testing",
        organizationId: organizationResponse.body.data.id,
      });

    const projectResponse = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Members Access Project",
        workspaceId: workspaceResponse.body.data.id,
      });

    const response = await request(app)
      .get(`/api/v1/project/${projectResponse.body.data.id}/members`)
      .set("Authorization", authHeader(outsider.id));

    expect(response.status).toBe(403);
  });

  /*
   * REMOVE PROJECT MEMBER
   */

  it("should allow a project admin to remove a member", async () => {
    const { user: owner } = await createTestUser({
      email: `project-remove-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `project-remove-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Remove Org ${Date.now()}`,
      });

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
        name: `Project Remove Workspace ${Date.now()}`,
        description: "Project workspace for testing",
        organizationId,
      });

    const projectResponse = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Remove Member Project",
        workspaceId: workspaceResponse.body.data.id,
      });

    const projectId = projectResponse.body.data.id;

    await prisma.projectMember.create({
      data: {
        projectId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .delete(`/api/v1/project/${projectId}/members/${member.id}`)
      .set("Authorization", authHeader(owner.id));

    expect(response.status).toBe(200);

    const projectMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: member.id,
        },
      },
    });

    expect(projectMember).toBeNull();
  });

  it("should reject a project member from removing another member", async () => {
    const { user: owner } = await createTestUser({
      email: `project-remove-access-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `project-remove-access-member-${Date.now()}@test.com`,
    });

    const { user: target } = await createTestUser({
      email: `project-remove-access-target-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Remove Access Org ${Date.now()}`,
      });

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
          userId: target.id,
          role: "MEMBER",
        },
      ],
    });

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Remove Access Workspace ${Date.now()}`,
        description: "Project workspace for testing",
        organizationId,
      });

    const projectResponse = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Protected Remove Project",
        workspaceId: workspaceResponse.body.data.id,
      });

    const projectId = projectResponse.body.data.id;

    await prisma.projectMember.createMany({
      data: [
        {
          projectId,
          userId: member.id,
          role: "MEMBER",
        },
        {
          projectId,
          userId: target.id,
          role: "MEMBER",
        },
      ],
    });

    const response = await request(app)
      .delete(`/api/v1/project/${projectId}/members/${target.id}`)
      .set("Authorization", authHeader(member.id));

    expect(response.status).toBe(403);
  });

  it("should reject a project member from removing themselves", async () => {
    const { user: owner } = await createTestUser({
      email: `project-self-remove-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `project-self-remove-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Self Remove Org ${Date.now()}`,
      });

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
        name: `Project Self Remove Workspace ${Date.now()}`,
        description: "Project workspace for testing",
        organizationId,
      });

    const projectResponse = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Self Remove Project",
        workspaceId: workspaceResponse.body.data.id,
      });

    const projectId = projectResponse.body.data.id;

    await prisma.projectMember.create({
      data: {
        projectId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .delete(`/api/v1/project/${projectId}/members/${member.id}`)
      .set("Authorization", authHeader(member.id));

    expect(response.status).toBe(400);
  });

  /*
   * UPDATE PROJECT MEMBER ROLE
   */

  it("should allow a project admin to promote a member to admin", async () => {
    const { user: owner } = await createTestUser({
      email: `project-role-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `project-role-member-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Role Org ${Date.now()}`,
      });

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
        name: `Project Role Workspace ${Date.now()}`,
        description: "Project workspace for testing",
        organizationId,
      });

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;

    const projectResponse = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Role Project",
        workspaceId,
      });

    expect(projectResponse.status).toBe(201);

    // const projectId = projectResponse.body.data.id;

    const projectId = projectResponse.body.data.id;

    await prisma.projectMember.create({
      data: {
        projectId,
        userId: member.id,
        role: "MEMBER",
      },
    });

    const response = await request(app)
      .patch(`/api/v1/project/${projectId}/members/${member.id}/role`)
      .set("Authorization", authHeader(owner.id))
      .send({
        role: "ADMIN",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.role).toBe("ADMIN");
  });

  it("should reject a project member from changing member roles", async () => {
    const { user: owner } = await createTestUser({
      email: `project-role-access-owner-${Date.now()}@test.com`,
    });

    const { user: member } = await createTestUser({
      email: `project-role-access-member-${Date.now()}@test.com`,
    });

    const { user: target } = await createTestUser({
      email: `project-role-access-target-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Role Access Org ${Date.now()}`,
      });

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
          userId: target.id,
          role: "MEMBER",
        },
      ],
    });

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: `Project Role Access Workspace ${Date.now()}`,
        description: "Project workspace for testing",
        organizationId,
      });

    const projectResponse = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(owner.id))
      .send({
        name: "Protected Role Project",
        workspaceId: workspaceResponse.body.data.id,
      });

    const projectId = projectResponse.body.data.id;

    await prisma.projectMember.createMany({
      data: [
        {
          projectId,
          userId: member.id,
          role: "MEMBER",
        },
        {
          projectId,
          userId: target.id,
          role: "MEMBER",
        },
      ],
    });

    const response = await request(app)
      .patch(`/api/v1/project/${projectId}/members/${target.id}/role`)
      .set("Authorization", authHeader(member.id))
      .send({
        role: "ADMIN",
      });

    expect(response.status).toBe(403);
  });

  it("should reject invalid project member role", async () => {
    const { user } = await createTestUser({
      email: `project-role-validation-${Date.now()}@test.com`,
    });

    const response = await request(app)
      .patch("/api/v1/project/test-project-id/members/test-user-id/role")
      .set("Authorization", authHeader(user.id))
      .send({
        role: "INVALID",
      });

    expect(response.status).toBe(400);
  });
});
