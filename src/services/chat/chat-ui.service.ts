import type { ChatMessage } from "@/models/chat/message.models";

function uid(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Helpers UI only — no mock replies. Prefer useChat for production flow. */
export function createUserMessage(content: string): ChatMessage {
  return {
    id: uid("u"),
    role: "user",
    content,
    createdAt: new Date().toISOString(),
    status: "sent",
    originalQuestion: content,
  };
}

export function toConversationTitle(question: string): string {
  const trimmed = question.trim();
  if (!trimmed) return "Nouvelle conversation";
  return trimmed.length > 42 ? `${trimmed.slice(0, 42)}…` : trimmed;
}
