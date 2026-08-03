const rawTimeout = Number(import.meta.env.VITE_API_TIMEOUT_MS);

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeoutMs: Number.isFinite(rawTimeout) && rawTimeout > 0 ? rawTimeout : 15_000,
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
