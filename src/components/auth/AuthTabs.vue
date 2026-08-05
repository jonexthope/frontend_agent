<script setup>
defineProps({
  mode: { type: String, required: true },
});

defineEmits(["change"]);
</script>

<template>
  <div class="auth-tabs" role="tablist" aria-label="Modes d’authentification">
    <button
      type="button"
      role="tab"
      id="tab-login"
      :class="['auth-tab', mode === 'login' ? 'auth-tab--active' : '']"
      :aria-selected="mode === 'login'"
      aria-controls="panel-login"
      :tabindex="mode === 'login' ? 0 : -1"
      @click="$emit('change', 'login')"
    >
      Se connecter
    </button>
    <button
      type="button"
      role="tab"
      id="tab-access"
      :class="['auth-tab', mode === 'access' ? 'auth-tab--active' : '']"
      :aria-selected="mode === 'access'"
      aria-controls="panel-access"
      :tabindex="mode === 'access' ? 0 : -1"
      @click="$emit('change', 'access')"
    >
      Demander un accès
    </button>
  </div>
</template>
