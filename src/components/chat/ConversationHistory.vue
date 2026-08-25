<script setup>
import { computed, ref, watch } from "vue";
import ConversationGroup from "@/components/chat/ConversationGroup.vue";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";

const props = defineProps({
  groups: {
    type: Object,
    required: true,
  },
  activeConversationId: {
    type: String,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isLoadingConversation: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
  deletingConversationId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["select-conversation", "retry", "delete-conversation"]);

const hasAnyConversation = () =>
  (props.groups?.today?.length ?? 0) > 0 ||
  (props.groups?.yesterday?.length ?? 0) > 0 ||
  (props.groups?.thisWeek?.length ?? 0) > 0 ||
  (props.groups?.thisMonth?.length ?? 0) > 0;

const pendingDeleteId = ref(null);
const isDeletingPending = computed(
  () =>
    !!pendingDeleteId.value &&
    props.deletingConversationId === pendingDeleteId.value,
);

function openDeleteConfirmation(sessionId) {
  pendingDeleteId.value = sessionId;
}

function closeDeleteConfirmation() {
  if (isDeletingPending.value) return;
  pendingDeleteId.value = null;
}

function confirmDelete() {
  if (!pendingDeleteId.value) return;
  emit("delete-conversation", pendingDeleteId.value);
}

watch(
  () => props.deletingConversationId,
  (value) => {
    if (!value) pendingDeleteId.value = null;
  },
);
</script>

<template>
  <div
    class="chat-hist"
    :aria-busy="isLoading || isLoadingConversation ? 'true' : 'false'"
  >
    <template v-if="isLoading">
      <div class="chat-hist-label">Conversations</div>
      <p class="chat-hist-empty">Chargement...</p>
    </template>

    <template v-else-if="error && !hasAnyConversation()">
      <div class="chat-hist-label">Conversations</div>
      <p class="chat-hist-empty">{{ error }}</p>
      <button class="chat-hist-retry" type="button" @click="$emit('retry')">
        Réessayer
      </button>
    </template>

    <template v-else-if="!hasAnyConversation()">
      <div class="chat-hist-label">Conversations</div>
      <p class="chat-hist-empty">Aucune conversation ce mois-ci.</p>
    </template>

    <template v-else>
      <p v-if="error" class="chat-hist-inline-error">{{ error }}</p>
      <ConversationGroup
        v-if="groups.today.length"
        label="Aujourd'hui"
        :conversations="groups.today"
        :active-conversation-id="activeConversationId ?? ''"
        :deleting-conversation-id="deletingConversationId"
        @select-conversation="$emit('select-conversation', $event)"
        @request-delete="openDeleteConfirmation"
      />
      <ConversationGroup
        v-if="groups.yesterday.length"
        label="Hier"
        :conversations="groups.yesterday"
        :active-conversation-id="activeConversationId ?? ''"
        :deleting-conversation-id="deletingConversationId"
        @select-conversation="$emit('select-conversation', $event)"
        @request-delete="openDeleteConfirmation"
      />
      <ConversationGroup
        v-if="groups.thisWeek.length"
        label="Cette semaine"
        :conversations="groups.thisWeek"
        :active-conversation-id="activeConversationId ?? ''"
        :deleting-conversation-id="deletingConversationId"
        @select-conversation="$emit('select-conversation', $event)"
        @request-delete="openDeleteConfirmation"
      />
      <ConversationGroup
        v-if="groups.thisMonth?.length"
        label="Ce mois"
        :conversations="groups.thisMonth"
        :active-conversation-id="activeConversationId ?? ''"
        :deleting-conversation-id="deletingConversationId"
        @select-conversation="$emit('select-conversation', $event)"
        @request-delete="openDeleteConfirmation"
      />
    </template>
  </div>
  <ConfirmDialog
    :open="!!pendingDeleteId"
    title="Supprimer cette conversation ?"
    description="Cette conversation ne sera plus affichée dans votre historique."
    confirm-label="Supprimer"
    cancel-label="Annuler"
    :is-busy="isDeletingPending"
    @cancel="closeDeleteConfirmation"
    @confirm="confirmDelete"
  />
</template>
