import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app";

describe("POST /api/v1/auth/register", () => {
  it("should reject registration when required fields are missing", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({});

    expect(response.status).toBe(400);
  });

  it("should reject an invalid email", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: "Test User",
      email: "invalid-email",
      password: "Password@123",
    });

    expect(response.status).toBe(400);
  });

  it("should reject an invalid password", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "123",
    });

    expect(response.status).toBe(400);
  });
});
