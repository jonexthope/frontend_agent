interface NewConversationButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function NewConversationButton({
  onClick,
  disabled = false,
}: NewConversationButtonProps) {
  return (
    <button className="chat-btn-new" type="button" onClick={onClick} disabled={disabled}>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      Nouvelle conversation
    </button>
  );
}
