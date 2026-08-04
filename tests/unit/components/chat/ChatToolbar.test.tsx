import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChatToolbar } from "@/components/chat/ChatToolbar";

describe("ChatToolbar", () => {
  it("toggles actions through callbacks", () => {
    const onToggleLiveData = vi.fn();
    const onToggleAnalysis = vi.fn();

    render(
      <ChatToolbar
        liveDataEnabled={false}
        analysisEnabled={false}
        onToggleLiveData={onToggleLiveData}
        onToggleAnalysis={onToggleAnalysis}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Données live/i }));
    fireEvent.click(screen.getByRole("button", { name: /Analyse/i }));

    expect(onToggleLiveData).toHaveBeenCalledTimes(1);
    expect(onToggleAnalysis).toHaveBeenCalledTimes(1);
  });
});
