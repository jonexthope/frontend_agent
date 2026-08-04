import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/models/chat/message.models";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";

interface MessageListProps {
  messages: ChatMessage[];
  isBusy: boolean;
  onSelectSuggestion: (question: string) => void;
}

export function MessageList({
  messages,
  isBusy,
  onSelectSuggestion,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    if (typeof element.scrollTo === "function") {
      element.scrollTo({ top: element.scrollHeight });
      return;
    }
    element.scrollTop = element.scrollHeight;
  }, [messages]);

  return (
    <div className="chat-thread" ref={scrollRef} aria-busy={isBusy}>
      <div className="chat-thread-inner">
        {messages.length === 0 ? (
          <WelcomeScreen onSelectSuggestion={onSelectSuggestion} />
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
      </div>
    </div>
  );
}
