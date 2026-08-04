interface SendButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export function SendButton({ disabled, onClick }: SendButtonProps) {
  return (
    <button className="chat-send" type="button" onClick={onClick} disabled={disabled} aria-label="Envoyer">
      <svg viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M3 8h9M8.5 4L12.5 8 8.5 12"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
