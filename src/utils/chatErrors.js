import { ApiError, NetworkError } from "@/services/api/apiError";

export function getChatErrorMessage(error) {
  if (error instanceof NetworkError) {
    if (/expiré|timeout|délai/i.test(error.message)) {
      return "La réponse prend trop de temps. Réessayez dans quelques instants.";
    }
    return "Impossible de communiquer avec Cartin AI. Vérifiez votre connexion.";
  }

  if (error instanceof ApiError) {
    if (error.status === 404) {
      return "Cette conversation n’est plus disponible. Démarrez une nouvelle conversation.";
    }
    if (error.status === 422) {
      return "La question envoyée n’est pas valide.";
    }
    if (error.status === 500 || error.status === 503) {
      return "Cartin AI est temporairement indisponible.";
    }
    if (error.status === 0 || /invalide/i.test(error.message)) {
      return "La réponse reçue de Cartin AI est invalide.";
    }
    return error.message || "Une erreur inattendue est survenue. Réessayez.";
  }

  if (error instanceof Error && /abort|timeout|expiré/i.test(error.message)) {
    return "La réponse prend trop de temps. Réessayez dans quelques instants.";
  }

  return "Impossible de communiquer avec Cartin AI. Vérifiez votre connexion.";
}
