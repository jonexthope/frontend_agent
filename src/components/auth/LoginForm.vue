<script setup>
import { reactive } from "vue";
import AppInput from "@/components/common/AppInput.vue";
import AppButton from "@/components/common/AppButton.vue";
import PasswordInput from "@/components/auth/PasswordInput.vue";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton.vue";
import { validateLogin } from "@/utils/validation";

defineProps({
  isSubmitting: { type: Boolean, default: false },
});

const emit = defineEmits(["submit", "google-login", "forgot-password"]);

const form = reactive({ email: "", password: "", remember: true });
const errors = reactive({ email: "", password: "" });

function handleSubmit() {
  const result = validateLogin(form);
  errors.email = result.errors.email || "";
  errors.password = result.errors.password || "";
  if (!result.success) return;
  emit("submit", { ...result.data });
}
</script>

<template>
  <form
    id="panel-login"
    role="tabpanel"
    aria-labelledby="tab-login"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <AppInput
      id="loginEmail"
      v-model="form.email"
      label="Email"
      type="email"
      autocomplete="email"
      placeholder="prenom.nom@cartin.com"
      :error="errors.email"
    />

    <PasswordInput
      id="loginPass"
      v-model="form.password"
      label="Mot de passe"
      auto-complete="current-password"
      placeholder="••••••••"
      :error="errors.password"
    />

    <div class="auth-row-between">
      <label class="auth-check">
        <input v-model="form.remember" type="checkbox" />
        Se souvenir
      </label>
      <button
        type="button"
        class="auth-link"
        @click="$emit('forgot-password', form.email)"
      >
        Mot de passe oublié ?
      </button>
    </div>

    <AppButton type="submit" :loading="isSubmitting">
      Entrer dans Cartin AI
    </AppButton>

    <div class="auth-divider">ou</div>

    <GoogleLoginButton :disabled="isSubmitting" @click="$emit('google-login')" />
  </form>
</template>
