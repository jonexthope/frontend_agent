import { AUTH_MESSAGES } from "@/configs/auth.constants";
import {
  ApiError,
  FeatureUnavailableError,
  NetworkError,
} from "@/services/api/apiError";

export function toAuthErrorMessage(error) {
  if (error instanceof FeatureUnavailableError) return error.message;
  if (error instanceof NetworkError) return error.message;
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return AUTH_MESSAGES.unexpectedError;
}
