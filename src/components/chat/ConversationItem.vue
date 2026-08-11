<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  conversation: { type: Object, required: true },
  active: { type: Boolean, default: false },
  deleting: { type: Boolean, default: false },
});

const emit = defineEmits(["select", "request-delete"]);

const rootRef = ref(null);
const menuOpen = ref(false);

function closeMenu() {
  menuOpen.value = false;
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function handleOutsidePointer(event) {
  if (!menuOpen.value) return;
  if (!rootRef.value?.contains(event.target)) {
    closeMenu();
  }
}

function handleRequestDelete() {
  closeMenu();
  emit("request-delete", props.conversation.id);
}

onMounted(() => {
  document.addEventListener("pointerdown", handleOutsidePointer);
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", handleOutsidePointer);
});
</script>

<template>
  <div ref="rootRef" class="chat-hist-row">
    <button
      :class="['chat-hist-item', active ? 'on' : '']"
      type="button"
      :aria-current="active ? 'true' : undefined"
      :title="conversation.title"
      @click="$emit('select', conversation.id)"
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M2.5 3.5h11v8.5H6l-3.5 2.5V3.5z"
          stroke="currentColor"
          stroke-width="1.3"
          stroke-linejoin="round"
        />
      </svg>
      <span>{{ conversation.title }}</span>
    </button>

    <div class="chat-hist-actions">
      <button
        class="chat-hist-actions-btn"
        type="button"
        aria-label="Actions de la conversation"
        @click.stop="toggleMenu"
      >
        ⋯
      </button>
      <div v-if="menuOpen" class="chat-hist-menu" role="menu">
        <button
          class="chat-hist-menu-delete"
          type="button"
          :disabled="deleting"
          aria-label="Supprimer la conversation"
          @click.stop="handleRequestDelete"
        >
          {{ deleting ? "Suppression..." : "Supprimer" }}
        </button>
      </div>
    </div>
  </div>
</template>
