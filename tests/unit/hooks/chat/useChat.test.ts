import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useChat } from "@/hooks/chat/useChat";
import * as chatService from "@/services/chat/chat.service";
import { ApiError, NetworkError } from "@/services/api/api_error";

vi.mock("@/services/chat/chat.service", () => ({
  sendChatMessage: vi.fn(),
}));

describe("useChat", () => {
  beforeEach(() => {
    vi.mocked(chatService.sendChatMessage).mockReset();
  });

  it("adds user message immediately and then assistant reply", async () => {
    vi.mocked(chatService.sendChatMessage).mockResolvedValue({
      answer: "Réponse API",
      session_id: "session-1",
      interaction_id: "interaction-1",
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("  Bonjour  ");
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
    });

    expect(result.current.messages[0]).toMatchObject({
      role: "user",
      content: "Bonjour",
      status: "sent",
    });
    expect(result.current.messages[1]).toMatchObject({
      role: "assistant",
      content: "Réponse API",
      interactionId: "interaction-1",
      status: "sent",
    });
    expect(result.current.sessionId).toBe("session-1");
    expect(chatService.sendChatMessage).toHaveBeenCalledWith({
      question: "Bonjour",
      external_id: "frontend-agent-temporary-user",
    });
  });

  it("reuses session_id on next message", async () => {
    vi.mocked(chatService.sendChatMessage).mockResolvedValue({
      answer: "ok",
      session_id: "session-1",
      interaction_id: "i1",
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("Q1");
    });
    await act(async () => {
      await result.current.sendMessage("Q2");
    });

    expect(chatService.sendChatMessage).toHaveBeenLastCalledWith({
      question: "Q2",
      session_id: "session-1",
      external_id: "frontend-agent-temporary-user",
    });
  });

  it("marks user message as error on failure", async () => {
    vi.mocked(chatService.sendChatMessage).mockRejectedValue(
      new NetworkError("Impossible de contacter le serveur."),
    );

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("Q");
    });

    expect(result.current.messages[0]?.status).toBe("error");
    expect(result.current.error).toMatch(/Impossible de communiquer/i);
  });

  it("resets conversation with startNewConversation", async () => {
    vi.mocked(chatService.sendChatMessage).mockResolvedValue({
      answer: "ok",
      session_id: "session-1",
      interaction_id: "i1",
    });

    const { result } = renderHook(() => useChat());
    await act(async () => {
      await result.current.sendMessage("Q");
    });

    act(() => {
      result.current.startNewConversation();
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.sessionId).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("prevents double send while busy", async () => {
    let resolveRequest: ((value: {
      answer: string;
      session_id: string;
      interaction_id: string;
    }) => void) | undefined;
    vi.mocked(chatService.sendChatMessage).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );

    const { result } = renderHook(() => useChat());

    act(() => {
      void result.current.sendMessage("Q1");
    });
    act(() => {
      void result.current.sendMessage("Q2");
    });

    expect(chatService.sendChatMessage).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveRequest?.({
        answer: "ok",
        session_id: "s1",
        interaction_id: "i1",
      });
    });
  });

  it("maps 404 to conversation unavailable message", async () => {
    vi.mocked(chatService.sendChatMessage).mockRejectedValue(
      new ApiError("not found", 404),
    );

    const { result } = renderHook(() => useChat());
    await act(async () => {
      await result.current.sendMessage("Q");
    });

    expect(result.current.error).toMatch(/n’est plus disponible/i);
  });
});
