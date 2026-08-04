import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TypingIndicator } from "@/components/chat/TypingIndicator";

describe("TypingIndicator", () => {
  it("is announced for assistive tech", () => {
    render(<TypingIndicator />);
    expect(screen.getByLabelText("Cartin AI prépare une réponse")).toBeInTheDocument();
  });
});
