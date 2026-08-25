import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../src/app";
import prisma from "../../src/lib/prisma";

import { createTestUser, authHeader } from "../helpers/auth";

describe("Task endpoints", () => {
  it("should allow a project member to create a task", async () => {
    const { user } = await createTestUser({
      email: `task-create-${Date.now()}@test.com`,
    });

    const organizationResponse = await request(app)
      .post("/api/v1/organization")
      .set("Authorization", authHeader(user.id))
      .send({
        name: `Task Org ${Date.now()}`,
      });

    expect(organizationResponse.status).toBe(201);

    const organizationId = organizationResponse.body.data.id;

    const workspaceResponse = await request(app)
      .post("/api/v1/workspace")
      .set("Authorization", authHeader(user.id))
      .send({
        name: `Task Workspace ${Date.now()}`,
        organizationId,
      });

    console.log("WORKSPACE STATUS:", workspaceResponse.status);
    console.log("WORKSPACE BODY:", workspaceResponse.body);

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data.id;

    const projectResponse = await request(app)
      .post("/api/v1/project")
      .set("Authorization", authHeader(user.id))
      .send({
        name: "Task Project",
        workspaceId,
      });

    expect(projectResponse.status).toBe(201);

    const projectId = projectResponse.body.data.id;

    const response = await request(app)
      .post("/api/v1/task")
      .set("Authorization", authHeader(user.id))
      .send({
        title: "Test Task",
        description: "Task description",
        priority: "HIGH",
        projectId,
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.title).toBe("Test Task");
    expect(response.body.data.description).toBe("Task description");
    expect(response.body.data.priority).toBe("HIGH");
    expect(response.body.data.projectId).toBe(projectId);
    expect(response.body.data.createdById).toBe(user.id);

    const task = await prisma.task.findUnique({
      where: {
        id: response.body.data.id,
      },
    });

    expect(task).not.toBeNull();
    expect(task?.createdById).toBe(user.id);
    expect(task?.projectId).toBe(projectId);
  });
});
