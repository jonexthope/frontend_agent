import type { ChatMessage } from "@/models/chat/message.models";
import { CHAT_USER_MOCK } from "@/mocks/user.mock";
import { MessageActions } from "@/components/chat/MessageActions";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import {
  formatMessageContent,
  type InlinePart,
} from "@/utils/chat/message-format";

interface MessageBubbleProps {
  message: ChatMessage;
}

function renderInlineText(parts: InlinePart[]) {
  return parts.map((part, index) => {
    if (part.type === "bold") return <strong key={`${part.value}_${index}`}>{part.value}</strong>;
    if (part.type === "code") return <code key={`${part.value}_${index}`}>{part.value}</code>;
    return <span key={`${part.value}_${index}`}>{part.value}</span>;
  });
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const who = isUser ? "Vous" : "Cartin AI";
  const blocks = formatMessageContent(message.content);

  return (
    <article className={`chat-msg ${isUser ? "user" : "bot"}`}>
      {isUser ? <div className="chat-av-user">{CHAT_USER_MOCK.initials}</div> : <div className="chat-av-bot">AI</div>}
      <div className="chat-bubble">
        <div className="chat-who">{who}</div>
        <div className="chat-body">
          {message.status === "sending" ? (
            <TypingIndicator />
          ) : (
            blocks.map((block, index) => {
              if (block.type === "kpi") {
                const trendClass = block.trendDirection === "down" ? "down" : "";
                return (
                  <span key={`${block.label}_${index}`} className="chat-kpi-chip">
                    {block.label} {block.value}
                    {block.trend ? <em className={trendClass}>{block.trend}</em> : null}
                  </span>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={`list_${index}`}>
                    {block.items.map((item, itemIndex) => (
                      <li key={`item_${itemIndex}`}>{renderInlineText(item)}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={`p_${index}`}>{renderInlineText(block.parts)}</p>;
            })
          )}
        </div>
        {!isUser && message.status !== "sending" ? <MessageActions content={message.content} /> : null}
      </div>
    </article>
  );
}
