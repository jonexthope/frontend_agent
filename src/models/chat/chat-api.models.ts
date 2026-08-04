export interface SendChatRequest {
  question: string;
  session_id?: string;
  external_id?: string;
}

export interface SendChatResponse {
  answer: string;
  session_id: string;
  interaction_id: string;
}

export function isSendChatResponse(value: unknown): value is SendChatResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const response = value as Record<string, unknown>;

  return (
    typeof response.answer === "string" &&
    typeof response.session_id === "string" &&
    typeof response.interaction_id === "string"
  );
}
