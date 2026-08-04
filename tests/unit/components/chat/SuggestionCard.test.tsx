import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SuggestionCard } from "@/components/chat/SuggestionCard";

describe("SuggestionCard", () => {
  it("calls onSelect with title", () => {
    const onSelect = vi.fn();
    render(
      <SuggestionCard
        title="CA HT ce mois vs M-1"
        description="Comparer la performance"
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /CA HT ce mois/i }));

    expect(onSelect).toHaveBeenCalledWith("CA HT ce mois vs M-1");
  });
});
