import { ref } from "vue";
import { defineStore } from "pinia";
import {
  login,
  loginWithGoogle,
  requestPasswordReset,
} from "@/services/auth/auth.service";
import { requestAccess } from "@/services/auth/accessRequest.service";
import { toAuthErrorMessage } from "@/tools/authErrors";

export const useAuthStore = defineStore("auth", () => {
  const isSubmitting = ref(false);
  const error = ref(null);
  const success = ref(null);

  function clearFeedback() {
    error.value = null;
    success.value = null;
  }

  async function submitLogin(payload) {
    isSubmitting.value = true;
    clearFeedback();
    try {
      await login(payload);
      success.value = "Connexion réussie.";
      return true;
    } catch (err) {
      error.value = toAuthErrorMessage(err);
      return false;
    } finally {
      isSubmitting.value = false;
    }
  }

  async function submitGoogleLogin() {
    isSubmitting.value = true;
    clearFeedback();
    try {
      await loginWithGoogle();
      success.value = "Connexion Google réussie.";
      return true;
    } catch (err) {
      error.value = toAuthErrorMessage(err);
      return false;
    } finally {
      isSubmitting.value = false;
    }
  }

  async function submitPasswordReset(email) {
    isSubmitting.value = true;
    clearFeedback();
    try {
      await requestPasswordReset(email);
      success.value = "Lien de réinitialisation envoyé.";
      return true;
    } catch (err) {
      error.value = toAuthErrorMessage(err);
      return false;
    } finally {
      isSubmitting.value = false;
    }
  }

  async function submitAccessRequest(payload) {
    isSubmitting.value = true;
    clearFeedback();
    try {
      await requestAccess(payload);
      success.value =
        "Demande envoyée aux administrateurs. Vous serez notifié après validation.";
      return true;
    } catch (err) {
      error.value = toAuthErrorMessage(err);
      return false;
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    isSubmitting,
    error,
    success,
    clearFeedback,
    submitLogin,
    submitGoogleLogin,
    submitPasswordReset,
    submitAccessRequest,
  };
});
