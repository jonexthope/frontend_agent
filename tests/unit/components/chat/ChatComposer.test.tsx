import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChatComposer } from "@/components/chat/ChatComposer";

describe("ChatComposer", () => {
  it("keeps submit inactive when textarea is empty", () => {
    render(
      <ChatComposer
        value=""
        isBusy={false}
        liveDataEnabled={false}
        analysisEnabled={false}
        textareaRef={{ current: null }}
        onChange={() => undefined}
        onSubmit={() => undefined}
        onKeyDown={() => undefined}
        onToggleLiveData={() => undefined}
        onToggleAnalysis={() => undefined}
      />,
    );

    expect(screen.getByRole("button", { name: "Envoyer" })).toBeDisabled();
  });

  it("does not submit on Shift+Enter from keydown handler", () => {
    const onKeyDown = vi.fn();
    render(
      <ChatComposer
        value="Question"
        isBusy={false}
        liveDataEnabled={false}
        analysisEnabled={false}
        textareaRef={{ current: null }}
        onChange={() => undefined}
        onSubmit={() => undefined}
        onKeyDown={onKeyDown}
        onToggleLiveData={() => undefined}
        onToggleAnalysis={() => undefined}
      />,
    );

    fireEvent.keyDown(screen.getByPlaceholderText("Écrivez votre message à Cartin AI…"), {
      key: "Enter",
      shiftKey: true,
    });

    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });
});
