import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthTabs } from "@/components/auth/AuthTabs";

describe("AuthTabs", () => {
  it("renders both tabs and reports selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<AuthTabs mode="login" onChange={onChange} />);

    expect(screen.getByRole("tab", { name: "Se connecter" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.getByRole("tab", { name: "Demander un accès" }),
    ).toHaveAttribute("aria-selected", "false");

    await user.click(screen.getByRole("tab", { name: "Demander un accès" }));
    expect(onChange).toHaveBeenCalledWith("access");
  });
});
