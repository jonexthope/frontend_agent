import { APP_CONFIG } from "@/configs/app.config";
import { AUTH_ENDPOINTS } from "@/configs/api.config";
import { AUTH_MESSAGES } from "@/configs/auth.config";
import type {
  AccessRequestPayload,
  AccessRequestResponse,
} from "@/models/access_request";
import { apiRequest } from "@/services/api/api_client";
import { FeatureUnavailableError } from "@/services/api/api_error";

export async function requestAccess(
  payload: AccessRequestPayload,
): Promise<AccessRequestResponse> {
  if (!APP_CONFIG.authApiEnabled) {
    throw new FeatureUnavailableError(AUTH_MESSAGES.accessUnavailable);
  }

  return apiRequest<AccessRequestResponse>({
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
