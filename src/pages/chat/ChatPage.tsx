import { useMemo, useState } from "react";
import { ChatLayout } from "@/layouts/ChatLayout";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { useLocalChat } from "@/hooks/chat/useLocalChat";
import { useChatComposer } from "@/hooks/chat/useChatComposer";
import { useSidebar } from "@/hooks/chat/useSidebar";
import { useConversationSelection } from "@/hooks/chat/useConversationSelection";

export function ChatPage() {
  const [shareInfo, setShareInfo] = useState<string | null>(null);
  const {
    conversations,
    activeConversationId,
    isTyping,
    createConversation,
    selectConversation,
    submitUserMessage,
  } = useLocalChat();
  const {
    isSidebarOpen,
    openSidebar,
    closeSidebar,
    closeOnMobile,
  } = useSidebar();
  const { activeConversation, onSelectConversation } = useConversationSelection(
    conversations,
    activeConversationId,
    selectConversation,
  );

  const composer = useChatComposer({
    onSubmitMessage: async (message) => {
      await submitUserMessage(message);
    },
  });

  const canShare = typeof window !== "undefined";

  const handleShare = async () => {
    if (!canShare) return;
    await navigator.clipboard.writeText(window.location.href);
    setShareInfo("Lien copié");
    setTimeout(() => setShareInfo(null), 1400);
  };

  const handleSelectConversation = (id: string) => {
    onSelectConversation(id);
    closeOnMobile();
  };

  const handleNewConversation = () => {
    createConversation();
    composer.focus();
    closeOnMobile();
  };

  const handleSuggestion = async (question: string) => {
    composer.setValue(question);
    await submitUserMessage(question);
    composer.setValue("");
    composer.focus();
  };

  const messageCount = useMemo(
    () => activeConversation?.messages.length ?? 0,
    [activeConversation?.messages.length],
  );

  return (
    <ChatLayout
      isSidebarOpen={isSidebarOpen}
      onCloseSidebar={closeSidebar}
      sidebar={
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          isOpen={isSidebarOpen}
          onNewConversation={handleNewConversation}
          onSelectConversation={handleSelectConversation}
          onLogout={() => setShareInfo("Authentification non connectée")}
        />
      }
      header={<ChatHeader onOpenSidebar={openSidebar} onShare={() => void handleShare()} canShare={canShare} />}
      composer={
        <ChatComposer
          value={composer.value}
          isBusy={isTyping}
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
        messages={activeConversation?.messages ?? []}
        isBusy={isTyping}
        onSelectSuggestion={(question) => void handleSuggestion(question)}
      />
      {shareInfo ? <div className="chat-toast">{shareInfo}</div> : null}
      <span className="sr-only">{messageCount} messages</span>
    </ChatLayout>
  );
}
