import { beforeEach, describe, expect, it, vi } from "vitest";
import { AUTH_MESSAGES } from "@/configs/auth.config";

vi.mock("@/configs/app.config", () => ({
  APP_CONFIG: {
    name: "Cartin AI",
    authApiEnabled: false,
    googleAuthEnabled: false,
  },
}));

describe("auth_service (API disabled)", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("login throws FeatureUnavailableError", async () => {
    const { login } = await import("@/services/auth_service");
    await expect(
      login({ email: "a@b.com", password: "x", remember: true }),
    ).rejects.toMatchObject({
      name: "FeatureUnavailableError",
      message: AUTH_MESSAGES.loginUnavailable,
    });
  });

  it("loginWithGoogle throws FeatureUnavailableError", async () => {
    const { loginWithGoogle } = await import("@/services/auth_service");
    await expect(loginWithGoogle()).rejects.toThrow(
      AUTH_MESSAGES.googleUnavailable,
    );
  });

  it("requestPasswordReset throws FeatureUnavailableError", async () => {
    const { requestPasswordReset } = await import("@/services/auth_service");
    await expect(requestPasswordReset("a@b.com")).rejects.toThrow(
      AUTH_MESSAGES.resetUnavailable,
    );
  });
});

describe("access_request_service (API disabled)", () => {
  it("requestAccess throws FeatureUnavailableError", async () => {
    const { requestAccess } = await import("@/services/access_request_service");
    await expect(
      requestAccess({
        email: "a@b.com",
        role: "Analyste",
        message: "hello",
      }),
    ).rejects.toThrow(AUTH_MESSAGES.accessUnavailable);
  });
});

describe("api error mapping helpers", () => {
  it("exposes status codes for future HTTP cases", async () => {
    const { ApiError, NetworkError } = await import("@/services/api/api_error");
    expect(new ApiError("bad", 400).status).toBe(400);
    expect(new ApiError("unauth", 401).status).toBe(401);
    expect(new ApiError("forbidden", 403).status).toBe(403);
    expect(new ApiError("conflict", 409).status).toBe(409);
    expect(new ApiError("invalid", 422).status).toBe(422);
    expect(new ApiError("server", 500).status).toBe(500);
    expect(new NetworkError("timeout").name).toBe("NetworkError");
  });
});
