import { useMemo, useState } from "react";
import { ChatLayout } from "@/layouts/ChatLayout";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { useChat } from "@/hooks/chat/useChat";
import { useChatComposer } from "@/hooks/chat/useChatComposer";
import { useSidebar } from "@/hooks/chat/useSidebar";
import type { Conversation } from "@/models/chat/conversation.models";

export function ChatPage() {
  const [shareInfo, setShareInfo] = useState<string | null>(null);
  const {
    messages,
    sessionId,
    isSending,
    error,
    sendMessage,
    retryMessage,
    startNewConversation,
    clearError,
  } = useChat();
  const { isSidebarOpen, openSidebar, closeSidebar, closeOnMobile } = useSidebar();

  const composer = useChatComposer({
    onSubmitMessage: async (message) => {
      await sendMessage(message);
    },
  });

  const conversations = useMemo<Conversation[]>(() => {
    if (!sessionId && messages.length === 0) return [];
    const title =
      messages.find((message) => message.role === "user")?.content.slice(0, 42) ||
      "Conversation en cours";
    return [
      {
        id: sessionId ?? "pending",
        title: title.length > 42 ? `${title}…` : title,
        messages,
        status: "active",
        createdAt: messages[0]?.createdAt ?? new Date().toISOString(),
        updatedAt: messages[messages.length - 1]?.createdAt ?? new Date().toISOString(),
      },
    ];
  }, [messages, sessionId]);

  const canShare = typeof window !== "undefined";

  const handleShare = async () => {
    if (!canShare) return;
    await navigator.clipboard.writeText(window.location.href);
    setShareInfo("Lien copié");
    setTimeout(() => setShareInfo(null), 1400);
  };

  const handleNewConversation = () => {
    startNewConversation();
    clearError();
    composer.focus();
    closeOnMobile();
  };

  const handleSuggestion = async (question: string) => {
    if (isSending) return;
    await sendMessage(question);
    composer.focus();
  };

  return (
    <ChatLayout
      isSidebarOpen={isSidebarOpen}
      onCloseSidebar={closeSidebar}
      sidebar={
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={sessionId ?? "pending"}
          isOpen={isSidebarOpen}
          onNewConversation={handleNewConversation}
          onSelectConversation={() => closeOnMobile()}
          onLogout={() => setShareInfo("Authentification non connectée")}
        />
      }
      header={
        <ChatHeader
          onOpenSidebar={openSidebar}
          onShare={() => void handleShare()}
          canShare={canShare}
        />
      }
      composer={
        <ChatComposer
          value={composer.value}
          isBusy={isSending}
          liveDataEnabled={composer.liveDataEnabled}
          analysisEnabled={composer.analysisEnabled}
          textareaRef={composer.textareaRef}
          onChange={composer.handleChange}
          onSubmit={() => void composer.submit()}
          onKeyDown={(event) => void composer.onKeyDown(event)}
          onToggleLiveData={() => composer.setLiveDataEnabled((prev) => !prev)}
          onToggleAnalysis={() => composer.setAnalysisEnabled((prev) => !prev)}
        />
      }
    >
      <MessageList
        messages={messages}
        isSending={isSending}
        suggestionsDisabled={isSending}
        onSelectSuggestion={(question) => void handleSuggestion(question)}
        onRetryMessage={(messageId) => void retryMessage(messageId)}
      />
      {error ? (
        <div className="chat-toast" role="alert">
          {error}
        </div>
      ) : null}
      {shareInfo ? <div className="chat-toast">{shareInfo}</div> : null}
    </ChatLayout>
  );
}
