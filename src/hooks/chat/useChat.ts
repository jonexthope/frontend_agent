import { useCallback, useRef, useState } from "react";
import type { ChatMessage } from "@/models/chat/message.models";
import { sendChatMessage } from "@/services/chat/chat.service";
import { getChatExternalId } from "@/services/identity/chat-identity.service";
import { getChatErrorMessage } from "@/utils/chat/chat-errors";

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const isSendingRef = useRef(false);

  const clearError = useCallback(() => setError(null), []);

  const startNewConversation = useCallback(() => {
    sessionIdRef.current = null;
    setSessionId(null);
    setMessages([]);
    setError(null);
    isSendingRef.current = false;
    setIsSending(false);
  }, []);

  const sendMessage = useCallback(async (rawQuestion: string) => {
    const question = rawQuestion.trim();
    if (!question || isSendingRef.current) return;

    const userMessageId = createId();
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: question,
      createdAt: new Date().toISOString(),
      status: "sending",
      originalQuestion: question,
    };

    setMessages((current) => [...current, userMessage]);
    isSendingRef.current = true;
    setIsSending(true);
    setError(null);

    try {
      const currentSessionId = sessionIdRef.current;
      const response = await sendChatMessage({
        question,
        external_id: getChatExternalId(),
        ...(currentSessionId ? { session_id: currentSessionId } : {}),
      });

      sessionIdRef.current = response.session_id;
      setSessionId(response.session_id);

      setMessages((current) => [
        ...current.map((message) =>
          message.id === userMessageId
            ? { ...message, status: "sent" as const }
            : message,
        ),
        {
          id: createId(),
          role: "assistant",
          content: response.answer,
          createdAt: new Date().toISOString(),
          status: "sent",
          interactionId: response.interaction_id,
        },
      ]);
    } catch (err) {
      setMessages((current) =>
        current.map((message) =>
          message.id === userMessageId
            ? { ...message, status: "error" as const }
            : message,
        ),
      );
      setError(getChatErrorMessage(err));
    } finally {
      isSendingRef.current = false;
      setIsSending(false);
    }
  }, []);

  const retryMessage = useCallback(
    async (messageId: string) => {
      const target = messages.find(
        (message) => message.id === messageId && message.status === "error",
      );
      if (!target?.originalQuestion) return;

      setMessages((current) =>
        current.filter((message) => message.id !== messageId),
      );
      await sendMessage(target.originalQuestion);
    },
    [messages, sendMessage],
  );

  return {
    messages,
    sessionId,
    isSending,
    error,
    sendMessage,
    retryMessage,
    startNewConversation,
    clearError,
  };
}
