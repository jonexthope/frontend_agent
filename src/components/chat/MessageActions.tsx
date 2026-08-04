import { useState } from "react";

interface MessageActionsProps {
  content: string;
}

export function MessageActions({ content }: MessageActionsProps) {
  const [helpful, setHelpful] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="chat-msg-actions">
      <button type="button" title="Copier le message" onClick={() => void handleCopy()}>
        {copied ? "Copié" : "Copier"}
      </button>
      <button
        type="button"
        title="Réponse utile"
        aria-pressed={helpful}
        onClick={() => setHelpful((prev) => !prev)}
      >
        {helpful ? "Utile ✓" : "Utile"}
      </button>
    </div>
  );
}
