<script setup>
import { CHAT_USER_MOCK } from "@/mocks/user.mock.js";
import UserAvatar from "@/components/chat/UserAvatar.vue";
import LogoutButton from "@/components/chat/LogoutButton.vue";

defineEmits(["logout"]);
</script>

<template>
  <div class="chat-side-foot">
    <div class="chat-user-chip">
      <UserAvatar :initials="CHAT_USER_MOCK.initials" />
      <div class="chat-user-meta">
        <strong>{{ CHAT_USER_MOCK.displayName }}</strong>
        <small>{{ CHAT_USER_MOCK.email || "Auth non connectée" }}</small>
      </div>
      <LogoutButton @click="$emit('logout')" />
    </div>
  </div>
</template>
