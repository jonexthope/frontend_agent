import { describe, expect, it } from "vitest";
import { getChatErrorMessage } from "@/utils/chatErrors.js";
import { ApiError, NetworkError } from "@/services/api/apiError.js";

describe("getChatErrorMessage", () => {
  it("maps network errors", () => {
    expect(getChatErrorMessage(new NetworkError("down"))).toMatch(
      /Impossible de communiquer/,
    );
  });

  it("maps HTTP statuses", () => {
    expect(getChatErrorMessage(new ApiError("x", 404))).toMatch(/n’est plus disponible/);
    expect(getChatErrorMessage(new ApiError("x", 422))).toMatch(/pas valide/);
    expect(getChatErrorMessage(new ApiError("x", 500))).toMatch(/indisponible/);
  });
});
