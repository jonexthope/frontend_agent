import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { API_CONFIG } from "@/configs/api.config";
import { AUTH_MESSAGES } from "@/configs/auth.config";
import { ApiError, NetworkError } from "@/services/api/api_error";

type TokenProvider = () => string | null;

let tokenProvider: TokenProvider = () => null;

export function setAuthTokenProvider(provider: TokenProvider): void {
  tokenProvider = provider;
}

function createClient(): AxiosInstance {
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
    (error: AxiosError<{ detail?: string; message?: string }>) => {
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

function defaultMessageForStatus(status: number): string {
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

export const apiClient = createClient();

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<T>(config);
  return response.data;
}
