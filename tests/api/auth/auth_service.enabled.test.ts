import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AxiosRequestConfig } from "axios";

const apiRequestMock = vi.fn();

vi.mock("@/services/api/api_client", () => ({
  apiRequest: (config: AxiosRequestConfig) => apiRequestMock(config),
}));

vi.mock("@/configs/app.config", () => ({
  APP_CONFIG: {
    name: "Cartin AI",
    authApiEnabled: true,
    googleAuthEnabled: true,
  },
}));

describe("auth_service (API enabled)", () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
    vi.resetModules();
  });

  it("posts login payload to future endpoint", async () => {
    apiRequestMock.mockResolvedValue({
      user: { id: "1", email: "a@b.com", name: "A B" },
    });
    const { login } = await import("@/services/auth_service");
    await login({ email: "a@b.com", password: "secret", remember: false });
    expect(apiRequestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: "/auth/login",
        data: {
          email: "a@b.com",
          password: "secret",
          remember: false,
        },
      }),
    );
  });

  it("propagates HTTP 401", async () => {
    const { ApiError } = await import("@/services/api/api_error");
    apiRequestMock.mockRejectedValue(new ApiError("Unauthorized", 401));
    const { login } = await import("@/services/auth_service");
    await expect(
      login({ email: "a@b.com", password: "bad", remember: true }),
    ).rejects.toMatchObject({ status: 401 });
  });

  it("propagates HTTP 409 on access request", async () => {
    const { ApiError } = await import("@/services/api/api_error");
    apiRequestMock.mockRejectedValue(new ApiError("Already exists", 409));
    const { requestAccess } = await import("@/services/access_request_service");
    await expect(
      requestAccess({
        email: "a@b.com",
        role: "Analyste",
        message: "hello",
      }),
    ).rejects.toMatchObject({ status: 409 });
  });

  it("propagates network timeout", async () => {
    const { NetworkError } = await import("@/services/api/api_error");
    apiRequestMock.mockRejectedValue(new NetworkError("timeout"));
    const { login } = await import("@/services/auth_service");
    await expect(
      login({ email: "a@b.com", password: "secret", remember: true }),
    ).rejects.toBeInstanceOf(NetworkError);
  });
});
