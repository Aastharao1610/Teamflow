import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app";

describe("Password endpoints", () => {
  it("should reject forgot password when email is missing", async () => {
    const response = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({});

    expect(response.status).toBe(400);
  });

  it("should reject forgot password with invalid email", async () => {
    const response = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({
        email: "invalid-email",
      });

    expect(response.status).toBe(400);
  });

  it("should reject reset password when required fields are missing", async () => {
    const response = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({});

    expect(response.status).toBe(400);
  });

  it("should reject reset password with invalid token", async () => {
    const response = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({
        token: "invalid-token",
        password: "Password@123",
      });

    // This may be 400 or another application-level error
    // depending on your reset-password implementation.
    expect([400, 401, 404]).toContain(response.status);
  });

  it("should reject change password without authentication", async () => {
    const response = await request(app)
      .post("/api/v1/auth/change-password")
      .send({
        currentPassword: "OldPassword@123",
        newPassword: "NewPassword@123",
      });

    expect(response.status).toBe(401);
  });
});
