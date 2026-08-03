import { APP_CONFIG } from "@/configs/app.config";
import { AUTH_ENDPOINTS } from "@/configs/api.config";
import { AUTH_MESSAGES } from "@/configs/auth.config";
import type { LoginPayload, LoginResponse } from "@/models/auth";
import { apiRequest } from "@/services/api/api_client";
import { FeatureUnavailableError } from "@/services/api/api_error";

function assertAuthEnabled(message: string): void {
  if (!APP_CONFIG.authApiEnabled) {
    throw new FeatureUnavailableError(message);
  }
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  assertAuthEnabled(AUTH_MESSAGES.loginUnavailable);

  return apiRequest<LoginResponse>({
    method: "POST",
    url: AUTH_ENDPOINTS.login,
    data: {
      email: payload.email,
      password: payload.password,
      remember: payload.remember,
    },
  });
}

export async function loginWithGoogle(): Promise<LoginResponse> {
  if (!APP_CONFIG.googleAuthEnabled || !APP_CONFIG.authApiEnabled) {
    throw new FeatureUnavailableError(AUTH_MESSAGES.googleUnavailable);
  }

  return apiRequest<LoginResponse>({
    method: "POST",
    url: AUTH_ENDPOINTS.googleLogin,
  });
}

export async function requestPasswordReset(email: string): Promise<void> {
  assertAuthEnabled(AUTH_MESSAGES.resetUnavailable);

  await apiRequest<void>({
    method: "POST",
    url: AUTH_ENDPOINTS.forgotPassword,
    data: { email },
  });
}
