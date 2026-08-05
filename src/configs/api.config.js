const baseUrl = import.meta.env.VITE_API_BASE_URL;

if (!baseUrl) {
  throw new Error("VITE_API_BASE_URL n'est pas configurée");
}

const configuredTimeout = Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 60_000);

export const API_CONFIG = {
  baseUrl: String(baseUrl).replace(/\/+$/, ""),
  timeoutMs:
    Number.isFinite(configuredTimeout) && configuredTimeout > 0
      ? configuredTimeout
      : 60_000,
  defaultHeaders: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const AUTH_ENDPOINTS = {
  login: "/auth/login",
  logout: "/auth/logout",
  currentUser: "/auth/me",
  googleLogin: "/auth/google",
  forgotPassword: "/auth/forgot-password",
  accessRequest: "/access-requests",
};

export const CHAT_ENDPOINTS = {
  chat: "/chat",
};
