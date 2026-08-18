import { computed, ref } from "vue";
import { defineStore } from "pinia";
import {
  getCurrentUser,
  login,
  loginWithGoogle,
  logoutSession,
  refreshSession,
  requestPasswordReset,
} from "@/services/auth/auth.service";
import { requestAccess } from "@/services/auth/accessRequest.service";
import {
  setAuthRefreshHandler,
  setAuthTokenProvider,
} from "@/services/api/apiClient";
import {
  saveAuthSession,
  loadAuthSession,
  clearAuthSession as clearStoredAuthSession,
} from "@/services/auth/authSession.service";
import { toAuthErrorMessage } from "@/tools/authErrors";

export const useAuthStore = defineStore("auth", () => {
  const storedSession = loadAuthSession();

  const user = ref(storedSession?.user ?? null);
  const accessToken = ref(storedSession?.access_token ?? null);
  const refreshToken = ref(storedSession?.refresh_token ?? null);
  const expiresIn = ref(storedSession?.expires_in ?? null);
  const remember = ref(storedSession?.remember ?? false);

  const isSubmitting = ref(false);
  const error = ref(null);
  const success = ref(null);

  const isAuthenticated = computed(
    () => Boolean(user.value && accessToken.value),
  );

  setAuthTokenProvider(() => accessToken.value);
  setAuthRefreshHandler(() => refreshAccessToken());
  function clearFeedback() {
    error.value = null;
    success.value = null;
  }

  function setSession(tokenResponse, shouldRemember = false) {
    user.value = tokenResponse.user;
    accessToken.value = tokenResponse.access_token;
    refreshToken.value = tokenResponse.refresh_token;
    expiresIn.value = tokenResponse.expires_in;
    remember.value = shouldRemember;

    saveAuthSession(tokenResponse, shouldRemember);
  }

  function clearSession() {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    expiresIn.value = null;
    remember.value = false;

    clearStoredAuthSession();
  }

  async function refreshAccessToken() {
    if (!refreshToken.value) {
      clearSession();
      return false;
    }
  
    const shouldRemember = remember.value;
  
    try {
      const response = await refreshSession(refreshToken.value);
  
      setSession(response, shouldRemember);
  
      return true;
    } catch (err) {
      if (err?.status === 401 || err?.status === 403) {
        clearSession();
      }
  
      return false;
    }
  }

  async function submitLogout() {
    const currentRefreshToken = refreshToken.value;
  
    clearFeedback();
  
    try {
      if (currentRefreshToken) {
        await logoutSession(currentRefreshToken);
      }
  
      return true;
    } catch (err) {
      error.value = toAuthErrorMessage(err);
      return false;
    } finally {
      // On déconnecte toujours localement l'utilisateur,
      // même si le serveur est momentanément inaccessible.
      clearSession();
    }
  }

  async function restoreSession() {
    if (!accessToken.value) {
      clearSession();
      return false;
    }
  
    try {
      const currentUser = await getCurrentUser();
  
      user.value = currentUser;
      return true;
    } catch (err) {
      if (err?.status !== 401) {
        // Erreur réseau ou serveur :
        // on ne détruit pas une session locale potentiellement encore valide.
        return isAuthenticated.value;
      }
    }
  
    if (!refreshToken.value) {
      clearSession();
      return false;
    }
  
    const shouldRemember = remember.value;
  
    try {
      const response = await refreshSession(refreshToken.value);
  
      // Le backend effectue une rotation du refresh token.
      // Il faut donc sauvegarder toute la nouvelle réponse.
      setSession(response, shouldRemember);
  
      return true;
    } catch (err) {
      if (err?.status === 401 || err?.status === 403) {
        clearSession();
        return false;
      }
  
      // Une panne réseau/serveur ne doit pas supprimer les tokens stockés.
      return isAuthenticated.value;
    }
  }
  async function submitLogin(payload) {
    isSubmitting.value = true;
    clearFeedback();

    try {
      const response = await login(payload);

      setSession(response, payload.remember === true);

      success.value = "Connexion réussie.";
      return true;
    } catch (err) {
      clearSession();
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
      const response = await loginWithGoogle();

      if (response?.access_token) {
        setSession(response, false);
      }

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
    user,
    accessToken,
    refreshToken,
    expiresIn,
    remember,
    isAuthenticated,
    isSubmitting,
    error,
    success,
    clearFeedback,
    setSession,
    clearSession,
    restoreSession,
    submitLogin,
    submitLogout,
    submitGoogleLogin,
    submitPasswordReset,
    submitAccessRequest,
    refreshAccessToken,
  };
});