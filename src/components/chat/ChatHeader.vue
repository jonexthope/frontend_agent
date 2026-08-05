<script setup>
import IconButton from "@/components/common/IconButton.vue";

defineProps({
  canShare: { type: Boolean, default: true },
});

defineEmits(["open-sidebar", "share"]);
</script>

<template>
  <header class="chat-top">
    <div class="chat-top-left">
      <IconButton
        class-name="chat-menu-btn"
        aria-label="Menu"
        @click="$emit('open-sidebar')"
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M2.5 4h11M2.5 8h11M2.5 12h11"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
        </svg>
      </IconButton>
      <div class="chat-model-pill">
        <span class="dot" />
        Cartin AI · Business
      </div>
    </div>
    <div class="chat-top-actions">
      <IconButton
        :title="canShare ? 'Partager' : 'Partage non disponible'"
        :disabled="!canShare"
        @click="$emit('share')"
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M10 3.5h2.5V6M13 8.2V12a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 013 12V5A1.5 1.5 0 014.5 3.5H8"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
          />
          <path
            d="M9.5 6.5L13 3.5"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
          />
        </svg>
      </IconButton>
    </div>
  </header>
</template>
