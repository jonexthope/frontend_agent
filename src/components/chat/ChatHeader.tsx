import { IconButton } from "@/components/common/IconButton";

interface ChatHeaderProps {
  onOpenSidebar: () => void;
  onShare: () => void;
  canShare?: boolean;
}

export function ChatHeader({
  onOpenSidebar,
  onShare,
  canShare = true,
}: ChatHeaderProps) {
  return (
    <header className="chat-top">
      <div className="chat-top-left">
        <IconButton className="chat-menu-btn" aria-label="Menu" onClick={onOpenSidebar}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M2.5 4h11M2.5 8h11M2.5 12h11"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </IconButton>
        <div className="chat-model-pill">
          <span className="dot" />
          Cartin AI · Business
        </div>
      </div>
      <div className="chat-top-actions">
        <IconButton
          title={canShare ? "Partager" : "Partage non disponible"}
          onClick={onShare}
          disabled={!canShare}
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M10 3.5h2.5V6M13 8.2V12a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 013 12V5A1.5 1.5 0 014.5 3.5H8"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M9.5 6.5L13 3.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </IconButton>
      </div>
    </header>
  );
}
