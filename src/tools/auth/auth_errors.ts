import { AUTH_MESSAGES } from "@/configs/auth.config";
import {
  ApiError,
  FeatureUnavailableError,
  NetworkError,
} from "@/services/api/api_error";

export function toAuthErrorMessage(error: unknown): string {
  if (error instanceof FeatureUnavailableError) {
    return error.message;
  }
  if (error instanceof NetworkError) {
    return error.message;
  }
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return AUTH_MESSAGES.unexpectedError;
}
