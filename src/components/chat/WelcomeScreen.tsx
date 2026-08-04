import {
  CHAT_INTRO_DESCRIPTION,
  CHAT_INTRO_TITLE,
} from "@/constants/chat.constants";
import { SuggestionList } from "@/components/chat/SuggestionList";

interface WelcomeScreenProps {
  onSelectSuggestion: (question: string) => void;
  disabled?: boolean;
}

export function WelcomeScreen({
  onSelectSuggestion,
  disabled = false,
}: WelcomeScreenProps) {
  return (
    <div className="chat-welcome">
      <div className="chat-mark">AI</div>
      <h1>{CHAT_INTRO_TITLE}</h1>
      <p>{CHAT_INTRO_DESCRIPTION}</p>
      <SuggestionList onSelect={onSelectSuggestion} disabled={disabled} />
    </div>
  );
}
