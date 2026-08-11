import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  archiveConversation,
  getConversation,
  listConversations,
} from "@/services/chat/history.service.js";
import { ApiError } from "@/services/api/apiError.js";

vi.mock("@/services/api/apiClient.js", () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from "@/services/api/apiClient.js";

describe("history.service", () => {
  beforeEach(() => {
    vi.mocked(apiRequest).mockReset();
  });

  it("calls GET /conversations with expected query params", async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      page_size: 100,
    });

    const params = {
      external_id: "frontend-agent-temporary-user",
      status: "active",
      date_from: "2026-08-02T21:00:00.000Z",
      page: 1,
      page_size: 100,
    };

    const data = await listConversations(params);

    expect(apiRequest).toHaveBeenCalledWith({
      method: "GET",
      url: "/conversations",
      params,
    });
    expect(data.items).toEqual([]);
  });

  it("reads items from a valid list response", async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      items: [
        {
          session_id: "s1",
          title: null,
          created_at: "2026-08-03T08:00:00Z",
          last_activity_at: "2026-08-03T09:30:00Z",
          status: "active",
          interaction_count: 1,
        },
      ],
      total: 1,
      page: 1,
      page_size: 100,
    });

    const data = await listConversations({});
    expect(data.items).toHaveLength(1);
    expect(data.items[0].session_id).toBe("s1");
  });

  it("rejects an invalid list response", async () => {
    vi.mocked(apiRequest).mockResolvedValue({ total: 0 });
    await expect(listConversations({})).rejects.toBeInstanceOf(ApiError);
  });

  it("calls GET conversation detail with encoded session id", async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      session_id: "abc/def",
      title: null,
      created_at: "2026-08-03T08:00:00Z",
      last_activity_at: "2026-08-03T09:30:00Z",
      status: "active",
      interactions: [],
    });

    await getConversation("abc/def");

    expect(apiRequest).toHaveBeenCalledWith({
      method: "GET",
      url: "/conversations/abc%2Fdef",
    });
  });

  it("rejects missing session id", async () => {
    await expect(getConversation("")).rejects.toBeInstanceOf(ApiError);
  });

  it("propagates HTTP 404 from apiRequest", async () => {
    vi.mocked(apiRequest).mockRejectedValue(
      new ApiError("not found", 404),
    );
    await expect(getConversation("missing")).rejects.toMatchObject({
      status: 404,
    });
  });

  it("propagates network errors from apiRequest", async () => {
    const networkError = new Error("network");
    vi.mocked(apiRequest).mockRejectedValue(networkError);
    await expect(listConversations({})).rejects.toBe(networkError);
  });

  it("archives a conversation with PATCH status archived", async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      session_id: "sess-1",
      title: "Title",
      created_at: "2026-08-03T08:00:00Z",
      last_activity_at: "2026-08-03T09:30:00Z",
      status: "archived",
      interactions: [],
    });

    await archiveConversation("sess-1");

    expect(apiRequest).toHaveBeenCalledWith({
      method: "PATCH",
      url: "/conversations/sess-1",
      data: { status: "archived" },
    });
  });
});
