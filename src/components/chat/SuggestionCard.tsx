interface SuggestionCardProps {
  title: string;
  description: string;
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export function SuggestionCard({
  title,
  description,
  onSelect,
  disabled = false,
}: SuggestionCardProps) {
  return (
    <button
      className="chat-sug"
      type="button"
      disabled={disabled}
      onClick={() => onSelect(title)}
    >
      <strong>{title}</strong>
      <span>{description}</span>
    </button>
  );
}
