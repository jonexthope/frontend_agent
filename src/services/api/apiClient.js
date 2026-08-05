import axios from "axios";
import { API_CONFIG } from "@/configs/api.config";
import { AUTH_MESSAGES } from "@/configs/auth.constants";
import { ApiError, NetworkError } from "@/services/api/apiError";

let tokenProvider = () => null;

export function setAuthTokenProvider(provider) {
  tokenProvider = provider;
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
    (error) => {
      if (!error.response) {
        if (error.code === "ECONNABORTED") {
          throw new NetworkError("La requête a expiré. Réessayez.");
        }
        throw new NetworkError(AUTH_MESSAGES.networkError);
      }

      const status = error.response.status;
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
