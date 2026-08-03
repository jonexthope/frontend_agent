import { describe, expect, it } from "vitest";
import { loginSchema } from "@/schemas/login";

describe("loginSchema", () => {
  it("accepts a valid payload", () => {
    const result = loginSchema.safeParse({
      email: "user@cartin.com",
      password: "secret",
      remember: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty email", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "secret",
      remember: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret",
      remember: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@cartin.com",
      password: "",
      remember: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a whitespace-only password", () => {
    const result = loginSchema.safeParse({
      email: "user@cartin.com",
      password: "   ",
      remember: true,
    });
    expect(result.success).toBe(false);
  });
});
