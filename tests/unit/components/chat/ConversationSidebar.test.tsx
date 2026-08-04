import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { CONVERSATIONS_MOCK } from "@/mocks/conversations.mock";

describe("ConversationSidebar", () => {
  it("opens menu class when isOpen", () => {
    const { container } = render(
      <ConversationSidebar
        conversations={CONVERSATIONS_MOCK}
        activeConversationId={CONVERSATIONS_MOCK[0].id}
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
        conversations={CONVERSATIONS_MOCK}
        activeConversationId={CONVERSATIONS_MOCK[0].id}
        onNewConversation={() => undefined}
        onSelectConversation={onSelectConversation}
        onLogout={() => undefined}
      />,
    );
    fireEvent.click(screen.getByText(CONVERSATIONS_MOCK[1].title));
    expect(onSelectConversation).toHaveBeenCalledWith(CONVERSATIONS_MOCK[1].id);
  });
});
