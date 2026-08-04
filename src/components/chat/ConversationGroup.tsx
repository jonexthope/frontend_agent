import type { Conversation } from "@/models/chat/conversation.models";
import { ConversationItem } from "@/components/chat/ConversationItem";

interface ConversationGroupProps {
  label: string;
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
}

export function ConversationGroup({
  label,
  conversations,
  activeConversationId,
  onSelectConversation,
}: ConversationGroupProps) {
  return (
    <>
      <div className="chat-hist-label">{label}</div>
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          active={conversation.id === activeConversationId}
          onSelect={onSelectConversation}
        />
      ))}
    </>
  );
}
