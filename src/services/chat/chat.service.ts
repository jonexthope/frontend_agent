import { CHAT_ENDPOINTS } from "@/configs/api.config";
import {
  isSendChatResponse,
  type SendChatRequest,
  type SendChatResponse,
} from "@/models/chat/chat-api.models";
import { apiRequest } from "@/services/api/api_client";
import { ApiError } from "@/services/api/api_error";

export async function sendChatMessage(
  payload: SendChatRequest,
): Promise<SendChatResponse> {
  const data: SendChatRequest = {
    question: payload.question,
    external_id: payload.external_id,
    ...(payload.session_id ? { session_id: payload.session_id } : {}),
  };

  const response = await apiRequest<unknown>({
    method: "POST",
    url: CHAT_ENDPOINTS.chat,
    data,
  });

  if (!isSendChatResponse(response)) {
    throw new ApiError("La réponse reçue de Cartin AI est invalide.", 0);
  }

  return response;
}
