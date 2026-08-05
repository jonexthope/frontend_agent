<script setup>
import CartinLogo from "@/components/common/CartinLogo.vue";
import AuthTabs from "@/components/auth/AuthTabs.vue";
import AuthFeedback from "@/components/auth/AuthFeedback.vue";
import LoginForm from "@/components/auth/LoginForm.vue";
import AccessRequestForm from "@/components/auth/AccessRequestForm.vue";

defineProps({
  mode: { type: String, required: true },
  error: { type: String, default: "" },
  success: { type: String, default: "" },
  isSubmitting: { type: Boolean, default: false },
});

defineEmits([
  "mode-change",
  "login",
  "google-login",
  "forgot-password",
  "access-request",
]);

const COPY = {
  login: {
    title: "Connexion",
    subtitle: "Accédez à Cartin AI, votre assistant business.",
  },
  access: {
    title: "Demander un accès",
    subtitle: "Votre demande sera examinée par un administrateur Cartin.",
  },
};
</script>

<template>
  <div class="auth-card">
    <div class="auth-card__logo">
      <CartinLogo :width="110" />
    </div>

    <div class="auth-card__badge">
      <span class="auth-card__badge-dot" aria-hidden />
      Accès Cartin AI
    </div>

    <h2>{{ COPY[mode].title }}</h2>
    <p class="auth-card__sub">{{ COPY[mode].subtitle }}</p>

    <AuthTabs :mode="mode" @change="$emit('mode-change', $event)" />
    <AuthFeedback :error="error" :success="success" />

    <LoginForm
      v-if="mode === 'login'"
      :is-submitting="isSubmitting"
      @submit="$emit('login', $event)"
      @google-login="$emit('google-login')"
      @forgot-password="$emit('forgot-password', $event)"
    />
    <AccessRequestForm
      v-else
      :is-submitting="isSubmitting"
      :on-submit="(values) => $emit('access-request', values)"
    />

    <div class="auth-foot">Accès réservé aux utilisateurs validés</div>
  </div>
</template>
