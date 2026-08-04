import { useCallback, useMemo, useState } from "react";
import type { Conversation } from "@/models/chat/conversation.models";
import { CONVERSATIONS_MOCK } from "@/mocks/conversations.mock";
import {
  createPendingAssistantMessage,
  createUserMessage,
  resolveAssistantMessage,
  toConversationTitle,
} from "@/services/chat/chat-ui.service";

function cloneConversation(conversation: Conversation): Conversation {
  return { ...conversation, messages: [...conversation.messages] };
}

function makeEmptyConversation(): Conversation {
  const now = new Date().toISOString();
  return {
    id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: "Nouvelle conversation",
    messages: [],
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
}

export function useLocalChat() {
  const [conversations, setConversations] = useState<Conversation[]>(
    CONVERSATIONS_MOCK.map(cloneConversation),
  );
  const [activeConversationId, setActiveConversationId] = useState(
    CONVERSATIONS_MOCK[0]?.id ?? "",
  );
  const [isTyping, setIsTyping] = useState(false);

  const activeConversation = useMemo(
    () =>
      conversations.find((conversation) => conversation.id === activeConversationId) ??
      conversations[0],
    [activeConversationId, conversations],
  );

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);

  const createConversation = useCallback(() => {
    const next = makeEmptyConversation();
    setConversations((prev) => [next, ...prev]);
    setActiveConversationId(next.id);
    return next.id;
  }, []);

  const submitUserMessage = useCallback(
    async (content: string) => {
      if (!activeConversationId || isTyping) return;
      const userMessage = createUserMessage(content);
      const pendingMessage = createPendingAssistantMessage();
      setIsTyping(true);
      setConversations((prev) =>
        prev.map((conversation) => {
          if (conversation.id !== activeConversationId) return conversation;
          const title =
            conversation.messages.length === 0
              ? toConversationTitle(content)
              : conversation.title;
          return {
            ...conversation,
            title,
            updatedAt: new Date().toISOString(),
            messages: [...conversation.messages, userMessage, pendingMessage],
          };
        }),
      );

      const reply = await resolveAssistantMessage(content);

      setConversations((prev) =>
        prev.map((conversation) => {
          if (conversation.id !== activeConversationId) return conversation;
          return {
            ...conversation,
            updatedAt: new Date().toISOString(),
            messages: conversation.messages.map((message) =>
              message.id === pendingMessage.id
                ? { ...message, status: "sent", content: reply }
                : message,
            ),
          };
        }),
      );
      setIsTyping(false);
    },
    [activeConversationId, isTyping],
  );

  return {
    conversations,
    activeConversation,
    activeConversationId,
    isTyping,
    createConversation,
    selectConversation,
    submitUserMessage,
  };
}
