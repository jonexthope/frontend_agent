interface ChatToolbarProps {
  liveDataEnabled: boolean;
  analysisEnabled: boolean;
  onToggleLiveData: () => void;
  onToggleAnalysis: () => void;
}

export function ChatToolbar({
  liveDataEnabled,
  analysisEnabled,
  onToggleLiveData,
  onToggleAnalysis,
}: ChatToolbarProps) {
  return (
    <div className="chat-composer-tools">
      <button
        className={`chat-tool${liveDataEnabled ? " on" : ""}`}
        type="button"
        aria-pressed={liveDataEnabled}
        onClick={onToggleLiveData}
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M2 12.5L6 7.5l3 3 5-6.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Données live
      </button>
      <button
        className={`chat-tool${analysisEnabled ? " on" : ""}`}
        type="button"
        aria-pressed={analysisEnabled}
        onClick={onToggleAnalysis}
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M8 5.5v3l2 1.2"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        Analyse
      </button>
    </div>
  );
}
