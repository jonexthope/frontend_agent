import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccessRequestForm } from "@/components/auth/AccessRequestForm";

describe("AccessRequestForm", () => {
  it("validates required fields", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AccessRequestForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Envoyer la demande" }));

    expect(
      await screen.findByText(/email professionnel est obligatoire/i),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits a valid access request", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(true);
    render(<AccessRequestForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText("Email professionnel"),
      "ops@entreprise.com",
    );
    await user.selectOptions(screen.getByLabelText("Rôle souhaité"), "Analyste");
    await user.type(
      screen.getByLabelText("Message aux administrateurs"),
      "Accès reporting",
    );
    await user.click(screen.getByRole("button", { name: "Envoyer la demande" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "ops@entreprise.com",
        role: "Analyste",
        message: "Accès reporting",
      }),
    );
  });
});
