import { APP_CONFIG } from "@/configs/app.config";
import { AUTH_ENDPOINTS } from "@/configs/api.config";
import { AUTH_MESSAGES } from "@/configs/auth.constants";
import { apiRequest } from "@/services/api/apiClient";
import { FeatureUnavailableError } from "@/services/api/apiError";

function assertAuthEnabled(message) {
  if (!APP_CONFIG.authApiEnabled) {
    throw new FeatureUnavailableError(message);
  }
}

export async function login(payload) {
  assertAuthEnabled(AUTH_MESSAGES.loginUnavailable);

  return apiRequest({
    method: "POST",
    url: AUTH_ENDPOINTS.login,
    data: {
      email: payload.email,
      password: payload.password,
    },
  });
}

export async function loginWithGoogle() {
  if (!APP_CONFIG.googleAuthEnabled || !APP_CONFIG.authApiEnabled) {
    throw new FeatureUnavailableError(AUTH_MESSAGES.googleUnavailable);
  }
  return apiRequest({
    method: "POST",
    url: AUTH_ENDPOINTS.googleLogin,
  });
}

export async function requestPasswordReset(email) {
  assertAuthEnabled(AUTH_MESSAGES.resetUnavailable);
  await apiRequest({
    method: "POST",
    url: AUTH_ENDPOINTS.forgotPassword,
    data: { email },
  });
}

export async function getCurrentUser() {
  assertAuthEnabled(AUTH_MESSAGES.loginUnavailable);

  return apiRequest({
    method: "GET",
    url: AUTH_ENDPOINTS.currentUser,
  });
}

export async function refreshSession(refreshToken) {
  assertAuthEnabled(AUTH_MESSAGES.loginUnavailable);

  return apiRequest({
    method: "POST",
    url: AUTH_ENDPOINTS.refresh,
    data: {
      refresh_token: refreshToken,
    },
    skipAuthRefresh: true,
  });
}

export async function logoutSession(refreshToken) {
  assertAuthEnabled(AUTH_MESSAGES.loginUnavailable);

  return apiRequest({
    method: "POST",
    url: AUTH_ENDPOINTS.logout,
    data: {
      refresh_token: refreshToken,
    },
    skipAuthRefresh: true,
  });
}