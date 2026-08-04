import type { ChatMessage } from "@/models/chat/message.models";
import { getMockReply } from "@/mocks/chat.mock";

function uid(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createUserMessage(content: string): ChatMessage {
  return {
    id: uid("u"),
    role: "user",
    content,
    createdAt: new Date().toISOString(),
    status: "sent",
  };
}

export function createPendingAssistantMessage(): ChatMessage {
  return {
    id: uid("a"),
    role: "assistant",
    content: "",
    createdAt: new Date().toISOString(),
    status: "sending",
  };
}

export async function resolveAssistantMessage(question: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return getMockReply(question);
}

export function toConversationTitle(question: string): string {
  const trimmed = question.trim();
  if (!trimmed) return "Nouvelle conversation";
  return trimmed.length > 42 ? `${trimmed.slice(0, 42)}…` : trimmed;
}
