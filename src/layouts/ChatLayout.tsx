import type { ReactNode } from "react";

interface ChatLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  composer: ReactNode;
  children: ReactNode;
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
}

export function ChatLayout({
  sidebar,
  header,
  composer,
  children,
  isSidebarOpen,
  onCloseSidebar,
}: ChatLayoutProps) {
  return (
    <div className="chat-shell">
      {sidebar}
      <button
        className={`chat-backdrop${isSidebarOpen ? " on" : ""}`}
        type="button"
        aria-label="Fermer le menu latéral"
        onClick={onCloseSidebar}
      />
      <main className="chat-main">
        {header}
        {children}
        {composer}
      </main>
    </div>
  );
}
