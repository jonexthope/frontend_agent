import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendChatMessage } from "@/services/chat/chat.service.js";
import { ApiError } from "@/services/api/apiError.js";

vi.mock("@/services/api/apiClient.js", () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from "@/services/api/apiClient.js";

describe("chat.service", () => {
  beforeEach(() => {
    vi.mocked(apiRequest).mockReset();
  });

  it("sends a new conversation without session_id", async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      answer: "ok",
      session_id: "s1",
      interaction_id: "i1",
    });

    await sendChatMessage({
      question: "CA ?",
      external_id: "frontend-agent-temporary-user",
    });

    expect(apiRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: "/chat",
        data: {
          question: "CA ?",
          external_id: "frontend-agent-temporary-user",
        },
      }),
    );
  });

  it("rejects invalid responses", async () => {
    vi.mocked(apiRequest).mockResolvedValue({ answer: "missing ids" });
    await expect(
      sendChatMessage({ question: "?", external_id: "x" }),
    ).rejects.toBeInstanceOf(ApiError);
  });
});
