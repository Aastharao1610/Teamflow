import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app";

describe("Auth sessions", () => {
  it("should reject refresh token when token is missing", async () => {
    const response = await request(app)
      .post("/api/v1/auth/refresh-token")
      .send({});

    expect(response.status).toBe(400);
  });

  it("should reject an invalid refresh token", async () => {
    const response = await request(app)
      .post("/api/v1/auth/refresh-token")
      .send({
        refreshToken: "invalid-refresh-token",
      });

    expect(response.status).toBe(401);
  });

  it("should reject logout without authentication", async () => {
    const response = await request(app).post("/api/v1/auth/logout");

    expect(response.status).toBe(401);
  });

  it("should reject logout-all without authentication", async () => {
    const response = await request(app).post("/api/v1/auth/logout-all");

    expect(response.status).toBe(401);
  });
});
