export const ACCESS_ROLES = [
  "Analyste",
  "Direction",
  "Ops / Logistique",
  "Lecture seule",
] as const;

export type AccessRole = (typeof ACCESS_ROLES)[number];

export const AUTH_MESSAGES = {
  loginUnavailable: "Le service de connexion n’est pas encore disponible.",
  accessUnavailable: "Le service de demande d’accès n’est pas encore disponible.",
  googleUnavailable: "La connexion Google n’est pas encore disponible.",
  resetUnavailable: "La réinitialisation du mot de passe n’est pas encore disponible.",
  networkError: "Impossible de contacter le serveur. Vérifiez votre connexion.",
  unexpectedError: "Une erreur inattendue est survenue. Réessayez.",
} as const;

export const AUTH_STORAGE_KEYS = {
  /** Reserved for a future secure session strategy — never for demo auth. */
  session: "cartin_ai_session",
} as const;
