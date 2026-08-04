import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MessageBubble } from "@/components/chat/MessageBubble";
import type { ChatMessage } from "@/models/chat/message.models";

function makeMessage(partial: Partial<ChatMessage>): ChatMessage {
  return {
    id: "m1",
    role: "assistant",
    content: "Hello",
    createdAt: new Date().toISOString(),
    status: "sent",
    ...partial,
  };
}

describe("MessageBubble", () => {
  it("renders user bubble with Vous", () => {
    render(<MessageBubble message={makeMessage({ role: "user", content: "Bonjour" })} />);
    expect(screen.getByText("Vous")).toBeInTheDocument();
    expect(screen.getByText("Bonjour")).toBeInTheDocument();
  });

  it("renders assistant bubble with actions", () => {
    render(<MessageBubble message={makeMessage({ role: "assistant", content: "Réponse" })} />);
    expect(screen.getByText("Cartin AI")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Copier/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Utile/i })).toBeInTheDocument();
  });

  it("shows retry on error user message", () => {
    const onRetry = vi.fn();
    render(
      <MessageBubble
        message={makeMessage({
          role: "user",
          content: "Question",
          status: "error",
          originalQuestion: "Question",
        })}
        onRetry={onRetry}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Réessayer/i }));
    expect(onRetry).toHaveBeenCalledWith("m1");
  });
});
