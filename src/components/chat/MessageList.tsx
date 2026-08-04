import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/models/chat/message.models";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
import { TypingIndicator } from "@/components/chat/TypingIndicator";

interface MessageListProps {
  messages: ChatMessage[];
  isSending: boolean;
  suggestionsDisabled?: boolean;
  onSelectSuggestion: (question: string) => void;
  onRetryMessage?: (messageId: string) => void;
}

export function MessageList({
  messages,
  isSending,
  suggestionsDisabled = false,
  onSelectSuggestion,
  onRetryMessage,
}: MessageListProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  return (
    <div className="chat-thread" aria-busy={isSending}>
      <div className="chat-thread-inner">
        {messages.length === 0 ? (
          <WelcomeScreen
            onSelectSuggestion={onSelectSuggestion}
            disabled={suggestionsDisabled || isSending}
          />
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onRetry={onRetryMessage}
              />
            ))}
            {isSending ? (
              <article className="chat-msg bot">
                <div className="chat-av-bot">AI</div>
                <div className="chat-bubble">
                  <div className="chat-who">Cartin AI</div>
                  <div className="chat-body">
                    <TypingIndicator />
                  </div>
                </div>
              </article>
            ) : null}
          </>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
