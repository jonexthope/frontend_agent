import { useCallback, useMemo, useState } from "react";

function isMobileViewport(): boolean {
  return typeof window !== "undefined" && window.innerWidth <= 860;
}

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = useCallback(() => setIsOpen(true), []);
  const closeSidebar = useCallback(() => setIsOpen(false), []);
  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);

  const closeOnMobile = useCallback(() => {
    if (isMobileViewport()) setIsOpen(false);
  }, []);

  const isOverlay = useMemo(isMobileViewport, []);

  return {
    isSidebarOpen: isOpen,
    isSidebarOverlay: isOverlay,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    closeOnMobile,
  };
}
