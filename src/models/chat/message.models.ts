export type MessageRole = "user" | "assistant";

export type MessageStatus = "sending" | "sent" | "error";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  status: MessageStatus;
  interactionId?: string;
  originalQuestion?: string;
}
