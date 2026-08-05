import { ref } from "vue";
import { defineStore } from "pinia";

function isMobileViewport() {
  return typeof window !== "undefined" && window.innerWidth <= 860;
}

export const useUiStore = defineStore("ui", () => {
  const isSidebarOpen = ref(false);

  function openSidebar() {
    isSidebarOpen.value = true;
  }

  function closeSidebar() {
    isSidebarOpen.value = false;
  }

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
  }

  function closeOnMobile() {
    if (isMobileViewport()) isSidebarOpen.value = false;
  }

  return {
    isSidebarOpen,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    closeOnMobile,
  };
});
