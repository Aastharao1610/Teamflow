import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app";

describe("GET /api/v1/auth/me", () => {
  it("should reject unauthenticated request", async () => {
    const response = await request(app).get("/api/v1/auth/me");

    expect(response.status).toBe(401);
  });

  it("should reject an invalid access token", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
  });
});
