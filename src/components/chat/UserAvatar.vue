<script setup>
defineProps({
  initials: {
    type: String,
    default: "?",
  },
  avatarUrl: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="user-avatar">
    <img
      v-if="avatarUrl"
      :src="avatarUrl"
      alt="Avatar utilisateur"
      class="user-avatar-image"
    />

    <span v-else class="user-avatar-initials">
      {{ initials }}
    </span>
  </div>
</template>

<style scoped>
.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #1a73e8;
  color: white;

  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
}

.user-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar-initials {
  line-height: 1;
}
</style>