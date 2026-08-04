import { CHAT_SUGGESTIONS } from "@/constants/chat.constants";
import { SuggestionCard } from "@/components/chat/SuggestionCard";

interface SuggestionListProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export function SuggestionList({ onSelect, disabled = false }: SuggestionListProps) {
  return (
    <div className="chat-suggestions">
      {CHAT_SUGGESTIONS.map((suggestion) => (
        <SuggestionCard
          key={suggestion.title}
          title={suggestion.title}
          description={suggestion.description}
          onSelect={onSelect}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
