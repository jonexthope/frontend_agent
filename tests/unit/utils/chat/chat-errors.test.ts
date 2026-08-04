import { describe, expect, it } from "vitest";
import { getChatErrorMessage } from "@/utils/chat/chat-errors";
import { ApiError, NetworkError } from "@/services/api/api_error";

describe("getChatErrorMessage", () => {
  it("maps network errors", () => {
    expect(getChatErrorMessage(new NetworkError("down"))).toMatch(
      /Impossible de communiquer/,
    );
  });

  it("maps timeout network errors", () => {
    expect(
      getChatErrorMessage(new NetworkError("La requête a expiré. Réessayez.")),
    ).toMatch(/trop de temps/);
  });

  it("maps HTTP statuses", () => {
    expect(getChatErrorMessage(new ApiError("x", 404))).toMatch(/n’est plus disponible/);
    expect(getChatErrorMessage(new ApiError("x", 422))).toMatch(/pas valide/);
    expect(getChatErrorMessage(new ApiError("x", 500))).toMatch(/indisponible/);
    expect(getChatErrorMessage(new ApiError("x", 503))).toMatch(/indisponible/);
  });
});
