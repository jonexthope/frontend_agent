import { useCallback } from "react";
import type { Conversation } from "@/models/chat/conversation.models";

export function useConversationSelection(
  conversations: Conversation[],
  activeConversationId: string,
  selectConversation: (id: string) => void,
) {
  const activeConversation =
    conversations.find((conversation) => conversation.id === activeConversationId) ??
    conversations[0];

  const onSelectConversation = useCallback(
    (id: string) => {
      selectConversation(id);
    },
    [selectConversation],
  );

  return { activeConversation, onSelectConversation };
}
