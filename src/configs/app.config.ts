export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || "Cartin AI",
  authApiEnabled: import.meta.env.VITE_AUTH_API_ENABLED === "true",
  googleAuthEnabled: import.meta.env.VITE_GOOGLE_AUTH_ENABLED === "true",
} as const;
