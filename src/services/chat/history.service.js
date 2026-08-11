import { CHAT_ENDPOINTS } from "@/configs/api.config";
import { apiRequest } from "@/services/api/apiClient";
import { ApiError } from "@/services/api/apiError";

export function isConversationListResponse(value) {
  if (!value || typeof value !== "object") return false;
  return Array.isArray(value.items);
}

export function isConversationDetailResponse(value) {
  if (!value || typeof value !== "object") return false;
  return (
    value.session_id != null &&
    Array.isArray(value.interactions)
  );
}

export async function listConversations(params = {}) {
  const data = await apiRequest({
    method: "GET",
    url: CHAT_ENDPOINTS.conversations,
    params,
  });

  if (!isConversationListResponse(data)) {
    throw new ApiError("La réponse de l'historique est invalide.", 0);
  }

  return data;
}

export async function getConversation(sessionId) {
  if (!sessionId) {
    throw new ApiError("Identifiant de conversation manquant.", 0);
  }

  const data = await apiRequest({
    method: "GET",
    url: CHAT_ENDPOINTS.conversation(String(sessionId)),
  });

  if (!isConversationDetailResponse(data)) {
    throw new ApiError("La réponse de la conversation est invalide.", 0);
  }

  return data;
}

export async function archiveConversation(sessionId) {
  if (!sessionId) {
    throw new ApiError("Identifiant de conversation manquant.", 0);
  }

  const data = await apiRequest({
    method: "PATCH",
    url: CHAT_ENDPOINTS.conversation(String(sessionId)),
    data: { status: "archived" },
  });

  if (!isConversationDetailResponse(data)) {
    throw new ApiError("La réponse de suppression est invalide.", 0);
  }

  return data;
}
