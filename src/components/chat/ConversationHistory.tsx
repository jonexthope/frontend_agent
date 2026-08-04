import type { Conversation } from "@/models/chat/conversation.models";
import { ConversationGroup } from "@/components/chat/ConversationGroup";

interface ConversationHistoryProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
}

export function ConversationHistory({
  conversations,
  activeConversationId,
  onSelectConversation,
}: ConversationHistoryProps) {
  if (conversations.length === 0) {
    return (
      <div className="chat-hist">
        <div className="chat-hist-label">Conversations</div>
        <p className="chat-hist-empty">Aucune conversation.</p>
      </div>
    );
  }

  return (
    <div className="chat-hist">
      <ConversationGroup
        label="Conversations"
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={onSelectConversation}
      />
    </div>
  );
}
