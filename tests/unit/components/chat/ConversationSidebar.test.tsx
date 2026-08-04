import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import type { Conversation } from "@/models/chat/conversation.models";

const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    title: "Nouvelle conversation",
    messages: [],
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "c2",
    title: "Top 3 pays à risque",
    messages: [],
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

describe("ConversationSidebar", () => {
  it("opens menu class when isOpen", () => {
    const { container } = render(
      <ConversationSidebar
        conversations={CONVERSATIONS}
        activeConversationId={CONVERSATIONS[0].id}
        isOpen
        onNewConversation={() => undefined}
        onSelectConversation={() => undefined}
        onLogout={() => undefined}
      />,
    );
    expect(container.querySelector(".chat-sidebar.open")).toBeInTheDocument();
  });

  it("calls select conversation", () => {
    const onSelectConversation = vi.fn();
    render(
      <ConversationSidebar
        conversations={CONVERSATIONS}
        activeConversationId={CONVERSATIONS[0].id}
        onNewConversation={() => undefined}
        onSelectConversation={onSelectConversation}
        onLogout={() => undefined}
      />,
    );
    fireEvent.click(screen.getByText(CONVERSATIONS[1].title));
    expect(onSelectConversation).toHaveBeenCalledWith(CONVERSATIONS[1].id);
  });
});
