import type { Conversation } from "@/models/chat/conversation.models";

interface ConversationItemProps {
  conversation: Conversation;
  active: boolean;
  onSelect: (id: string) => void;
}

export function ConversationItem({
  conversation,
  active,
  onSelect,
}: ConversationItemProps) {
  return (
    <button
      className={`chat-hist-item${active ? " on" : ""}`}
      type="button"
      onClick={() => onSelect(conversation.id)}
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M2.5 3.5h11v8.5H6l-3.5 2.5V3.5z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
      <span>{conversation.title}</span>
    </button>
  );
}
