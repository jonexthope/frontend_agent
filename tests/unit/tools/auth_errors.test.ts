import { describe, expect, it } from "vitest";
import { toAuthErrorMessage } from "@/tools/auth/auth_errors";
import {
  ApiError,
  FeatureUnavailableError,
  NetworkError,
} from "@/services/api/api_error";
import { AUTH_MESSAGES } from "@/configs/auth.config";
import { initials } from "@/tools/string/initials";

describe("toAuthErrorMessage", () => {
  it("maps FeatureUnavailableError", () => {
    expect(
      toAuthErrorMessage(new FeatureUnavailableError(AUTH_MESSAGES.loginUnavailable)),
    ).toBe(AUTH_MESSAGES.loginUnavailable);
  });

  it("maps NetworkError", () => {
    expect(toAuthErrorMessage(new NetworkError("offline"))).toBe("offline");
  });

  it("maps ApiError", () => {
    expect(toAuthErrorMessage(new ApiError("Unauthorized", 401))).toBe(
      "Unauthorized",
    );
  });

  it("falls back for unknown errors", () => {
    expect(toAuthErrorMessage({})).toBe(AUTH_MESSAGES.unexpectedError);
  });
});

describe("initials", () => {
  it("builds two-letter initials", () => {
    expect(initials("Sophie Rault")).toBe("SR");
  });

  it("falls back to AI", () => {
    expect(initials("")).toBe("AI");
  });
});
