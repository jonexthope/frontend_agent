<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import AuthLayout from "@/layouts/AuthLayout.vue";
import AuthCard from "@/components/auth/AuthCard.vue";
import { useAuthStore } from "@/stores/auth.js";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { isSubmitting, error, success } = storeToRefs(authStore);

const mode = ref(route.query.mode === "access" ? "access" : "login");

watch(
  () => route.query.mode,
  (value) => {
    mode.value = value === "access" ? "access" : "login";
  },
);

function handleModeChange(nextMode) {
  authStore.clearFeedback();
  mode.value = nextMode;
  router.replace(nextMode === "login" ? { path: "/login" } : { path: "/login", query: { mode: "access" } });
}

async function handleLogin(values) {
  const loggedIn = await authStore.submitLogin(values);

  if (!loggedIn) {
    return;
  }

  const redirect =
    typeof route.query.redirect === "string"
      ? route.query.redirect
      : null;

  if (redirect) {
    await router.push(redirect);
    return;
  }

  await router.push({ name: "chat" });
}

async function handleForgotPassword(email) {
  await authStore.submitPasswordReset(email);
}

async function handleAccessRequest(values) {
  return authStore.submitAccessRequest(values);
}

const feedbackError = computed(() => error.value);
const feedbackSuccess = computed(() => success.value);
</script>

<template>
  <AuthLayout>
    <AuthCard
      :mode="mode"
      :error="feedbackError"
      :success="feedbackSuccess"
      :is-submitting="isSubmitting"
      @mode-change="handleModeChange"
      @login="handleLogin"
      @google-login="handleGoogleLogin"
      @forgot-password="handleForgotPassword"
      @access-request="handleAccessRequest"
    />
  </AuthLayout>
</template>
