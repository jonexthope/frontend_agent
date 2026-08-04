import type { ChatMessage } from "@/models/chat/message.models";

export type ConversationStatus = "active" | "archived";

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  status: ConversationStatus;
  createdAt: string;
  updatedAt: string;
}
