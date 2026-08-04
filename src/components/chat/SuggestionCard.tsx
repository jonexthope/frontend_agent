interface SuggestionCardProps {
  title: string;
  description: string;
  onSelect: (question: string) => void;
}

export function SuggestionCard({ title, description, onSelect }: SuggestionCardProps) {
  return (
    <button className="chat-sug" type="button" onClick={() => onSelect(title)}>
      <strong>{title}</strong>
      <span>{description}</span>
    </button>
  );
}
