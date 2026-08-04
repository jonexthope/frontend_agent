import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendChatMessage } from "@/services/chat/chat.service";
import { ApiError } from "@/services/api/api_error";

vi.mock("@/services/api/api_client", () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from "@/services/api/api_client";

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

  it("sends session_id for an existing conversation", async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      answer: "ok",
      session_id: "s1",
      interaction_id: "i1",
    });

    await sendChatMessage({
      question: "Suite ?",
      session_id: "s1",
      external_id: "frontend-agent-temporary-user",
    });

    expect(apiRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ session_id: "s1" }),
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
