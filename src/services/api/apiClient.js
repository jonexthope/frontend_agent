import axios from "axios";
import { API_CONFIG } from "@/configs/api.config";
import { AUTH_MESSAGES } from "@/configs/auth.constants";
import { ApiError, NetworkError } from "@/services/api/apiError";

let tokenProvider = () => null;
let authRefreshHandler = null;
let refreshPromise = null;

export function setAuthTokenProvider(provider) {
  tokenProvider = provider;
}

export function setAuthRefreshHandler(handler) {
  authRefreshHandler = handler;
}

function defaultMessageForStatus(status) {
  switch (status) {
    case 400:
      return "Requête invalide.";
    case 401:
      return "Identifiants invalides ou session expirée.";
    case 403:
      return "Accès refusé.";
    case 409:
      return "Une demande est déjà en cours pour cet email.";
    case 422:
      return "Les données envoyées sont invalides.";
    case 500:
      return "Erreur serveur. Réessayez plus tard.";
    default:
      return AUTH_MESSAGES.unexpectedError;
  }
}

async function refreshAuthentication() {
  if (!authRefreshHandler) {
    return false;
  }

  if (!refreshPromise) {
    refreshPromise = Promise.resolve(authRefreshHandler()).finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

function createClient() {
  const client = axios.create({
    baseURL: API_CONFIG.baseUrl,
    timeout: API_CONFIG.timeoutMs,
    headers: API_CONFIG.defaultHeaders,
  });

  client.interceptors.request.use((config) => {
    const token = tokenProvider();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;
      const originalRequest = error.config;

      const canAttemptRefresh =
        status === 401 &&
        originalRequest &&
        !originalRequest._authRetry &&
        !originalRequest.skipAuthRefresh &&
        authRefreshHandler;

      if (canAttemptRefresh) {
        originalRequest._authRetry = true;

        try {
          const refreshed = await refreshAuthentication();

          if (refreshed) {
            const token = tokenProvider();

            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }

            return client.request(originalRequest);
          }
        } catch {
          // Le traitement standard de l'erreur continue ci-dessous.
        }
      }

      if (!error.response) {
        if (error.code === "ECONNABORTED") {
          throw new NetworkError("La requête a expiré. Réessayez.");
        }

        throw new NetworkError(AUTH_MESSAGES.networkError);
      }

      const data = error.response.data;
      const message =
        data?.detail || data?.message || defaultMessageForStatus(status);

      throw new ApiError(message, status, { details: data });
    },
  );

  return client;
}

export const apiClient = createClient();

export async function apiRequest(config) {
  const response = await apiClient.request(config);
  return response.data;
}