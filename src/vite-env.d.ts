/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_AUTH_API_ENABLED: string;
  readonly VITE_GOOGLE_AUTH_ENABLED: string;
  readonly VITE_API_TIMEOUT_MS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
