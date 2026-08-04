import type { KeyboardEvent, RefObject } from "react";
import { CHAT_HINT } from "@/constants/chat.constants";
import { ChatToolbar } from "@/components/chat/ChatToolbar";
import { SendButton } from "@/components/chat/SendButton";

interface ChatComposerProps {
  value: string;
  isBusy: boolean;
  liveDataEnabled: boolean;
  analysisEnabled: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onToggleLiveData: () => void;
  onToggleAnalysis: () => void;
}

export function ChatComposer({
  value,
  isBusy,
  liveDataEnabled,
  analysisEnabled,
  textareaRef,
  onChange,
  onSubmit,
  onKeyDown,
  onToggleLiveData,
  onToggleAnalysis,
}: ChatComposerProps) {
  const isDisabled = !value.trim() || isBusy;

  return (
    <div className="chat-composer-wrap">
      <div className="chat-composer-inner">
        <div className="chat-composer">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            placeholder="Écrivez votre message à Cartin AI…"
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={onKeyDown}
          />
          <div className="chat-composer-bar">
            <ChatToolbar
              liveDataEnabled={liveDataEnabled}
              analysisEnabled={analysisEnabled}
              onToggleLiveData={onToggleLiveData}
              onToggleAnalysis={onToggleAnalysis}
            />
            <SendButton disabled={isDisabled} onClick={onSubmit} />
          </div>
        </div>
        <div className="chat-hint">{CHAT_HINT}</div>
      </div>
    </div>
  );
}
