import { APP_CONFIG } from "@/configs/app.config";
import { AUTH_ENDPOINTS } from "@/configs/api.config";
import { AUTH_MESSAGES } from "@/configs/auth.constants";
import { apiRequest } from "@/services/api/apiClient";
import { FeatureUnavailableError } from "@/services/api/apiError";

export async function requestAccess(payload) {
  if (!APP_CONFIG.authApiEnabled) {
    throw new FeatureUnavailableError(AUTH_MESSAGES.accessUnavailable);
  }
  return apiRequest({
    method: "POST",
    url: AUTH_ENDPOINTS.accessRequest,
    data: {
      email: payload.email.trim(),
      role: payload.role,
      message: payload.message.trim(),
      product: "Cartin AI",
    },
  });
}
