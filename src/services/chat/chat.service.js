import { CHAT_ENDPOINTS } from "@/configs/api.config";
import { apiRequest } from "@/services/api/apiClient";
import { ApiError } from "@/services/api/apiError";

export function isSendChatResponse(value) {
  if (!value || typeof value !== "object") return false;
  return (
    typeof value.answer === "string" &&
    typeof value.session_id === "string" &&
    typeof value.interaction_id === "string"
  );
}

export async function sendChatMessage(payload) {
  const data = {
    question: payload.question,
    external_id: payload.external_id,
    ...(payload.session_id ? { session_id: payload.session_id } : {}),
  };

  const response = await apiRequest({
    method: "POST",
    url: CHAT_ENDPOINTS.chat,
    data,
  });

  if (!isSendChatResponse(response)) {
    throw new ApiError("La réponse reçue de Cartin AI est invalide.", 0);
  }

  return response;
}
