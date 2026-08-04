const baseUrl = import.meta.env.VITE_API_BASE_URL;

if (!baseUrl) {
  throw new Error("VITE_API_BASE_URL n'est pas configurée");
}

const timeoutValue = Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 60_000);

export const API_CONFIG = {
  baseUrl: String(baseUrl).replace(/\/+$/, ""),
  timeoutMs: Number.isFinite(timeoutValue) && timeoutValue > 0 ? timeoutValue : 60_000,
  defaultHeaders: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
} as const;

export const AUTH_ENDPOINTS = {
  login: "/auth/login",
  logout: "/auth/logout",
  currentUser: "/auth/me",
  googleLogin: "/auth/google",
  forgotPassword: "/auth/forgot-password",
  accessRequest: "/access-requests",
} as const;

export const CHAT_ENDPOINTS = {
  chat: "/chat",
} as const;
