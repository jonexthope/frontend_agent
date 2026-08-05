<script setup>
defineProps({
  isSidebarOpen: { type: Boolean, required: true },
});

defineEmits(["close-sidebar"]);
</script>

<template>
  <div class="chat-shell">
    <slot name="sidebar" />
    <button
      :class="['chat-backdrop', isSidebarOpen ? 'on' : '']"
      type="button"
      aria-label="Fermer le menu latéral"
      @click="$emit('close-sidebar')"
    />
    <main class="chat-main">
      <slot name="header" />
      <slot />
      <slot name="composer" />
    </main>
  </div>
</template>
