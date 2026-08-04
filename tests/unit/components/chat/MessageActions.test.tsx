import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MessageActions } from "@/components/chat/MessageActions";

describe("MessageActions", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("copies assistant content", async () => {
    render(<MessageActions content="Réponse IA" />);

    fireEvent.click(screen.getByRole("button", { name: /Copier/i }));

    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Réponse IA"),
    );
  });
});
