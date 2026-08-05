<script setup>
import AuthHero from "@/components/auth/AuthHero.vue";
</script>

<template>
  <div class="auth-layout">
    <AuthHero />
    <section class="auth-panel">
      <slot />
    </section>
  </div>
</template>
