import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SendButton } from "@/components/chat/SendButton";

describe("SendButton", () => {
  it("is disabled when disabled prop is true", () => {
    render(<SendButton disabled onClick={() => undefined} />);
    expect(screen.getByRole("button", { name: "Envoyer" })).toBeDisabled();
  });

  it("calls handler on click", () => {
    const onClick = vi.fn();
    render(<SendButton disabled={false} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
