import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app";

describe("POST /api/v1/auth/login", () => {
  it("should reject login when fields are missing", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({});

    expect(response.status).toBe(400);
  });

  it("should reject an invalid email", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "invalid-email",
      password: "Password@123",
    });

    expect(response.status).toBe(400);
  });

  it("should reject an invalid password", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "test@example.com",
      password: "123",
    });

    expect(response.status).toBe(400);
  });
});
