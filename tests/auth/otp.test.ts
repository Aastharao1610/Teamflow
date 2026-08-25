import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app";

describe("OTP validation", () => {
  it("should reject send OTP when email is missing", async () => {
    const response = await request(app)
      .post("/api/v1/auth/send-email-otp")
      .send({});

    expect(response.status).toBe(400);
  });

  it("should reject send OTP with invalid email", async () => {
    const response = await request(app)
      .post("/api/v1/auth/send-email-otp")
      .send({
        email: "invalid-email",
      });

    expect(response.status).toBe(400);
  });

  it("should reject verify OTP when required fields are missing", async () => {
    const response = await request(app)
      .post("/api/v1/auth/verify-email-otp")
      .send({});

    expect(response.status).toBe(400);
  });

  it("should reject resend OTP when email is missing", async () => {
    const response = await request(app)
      .post("/api/v1/auth/resend-email-otp")
      .send({});

    expect(response.status).toBe(400);
  });
});
