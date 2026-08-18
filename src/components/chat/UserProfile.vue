<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import UserAvatar from "@/components/chat/UserAvatar.vue";
import LogoutButton from "@/components/chat/LogoutButton.vue";

defineEmits(["logout"]);

const authStore = useAuthStore();

const user = computed(() => authStore.user);

const displayName = computed(() => {
  return (
    user.value?.display_name ||
    `${user.value?.first_name || ""} ${user.value?.last_name || ""}`.trim() ||
    user.value?.email ||
    "Utilisateur"
  );
});

const initials = computed(() => {
  const firstName = user.value?.first_name || "";
  const lastName = user.value?.last_name || "";

  if (firstName || lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  return user.value?.email?.charAt(0).toUpperCase() || "?";
});
</script>

<template>
  <div class="chat-side-foot">
    <div class="chat-user-chip">
      <UserAvatar
        :initials="initials"
        :avatar-url="user?.avatar_url"
      />

      <div class="chat-user-meta">
        <strong>{{ displayName }}</strong>
        <small>{{ user?.email || "Utilisateur non connecté" }}</small>
      </div>

      <LogoutButton @click="$emit('logout')" />
    </div>
  </div>
</template>