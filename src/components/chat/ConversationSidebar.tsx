import type { Conversation } from "@/models/chat/conversation.models";
import { CartinLogo } from "@/components/common/CartinLogo";
import { NewConversationButton } from "@/components/chat/NewConversationButton";
import { ConversationHistory } from "@/components/chat/ConversationHistory";
import { UserProfile } from "@/components/chat/UserProfile";

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  isOpen?: boolean;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onLogout: () => void;
}

export function ConversationSidebar({
  conversations,
  activeConversationId,
  isOpen = false,
  onNewConversation,
  onSelectConversation,
  onLogout,
}: ConversationSidebarProps) {
  return (
    <aside className={`chat-sidebar${isOpen ? " open" : ""}`}>
      <div className="chat-side-brand">
        <CartinLogo width={128} />
        <div className="chat-side-tag">Assistant conversationnel</div>
      </div>
      <NewConversationButton onClick={onNewConversation} />
      <ConversationHistory
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={onSelectConversation}
      />
      <UserProfile onLogout={onLogout} />
    </aside>
  );
}
