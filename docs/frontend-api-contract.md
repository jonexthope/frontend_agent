# Contrat API frontend ↔ backend (authentification)

Statut : **prévisionnel**. Le backend `agent_ia_cartin` n’expose aujourd’hui aucune route OAuth/JWT/mot de passe. Les endpoints ci-dessous sont des **contrats cibles** côté frontend ; ils doivent être alignés sur OpenAPI (`/openapi.json` / Swagger) avant branchement réel.

## Configuration

| Variable | Rôle |
|---|---|
| `VITE_API_BASE_URL` | Base URL FastAPI (ex. `http://localhost:8000`) |
| `VITE_AUTH_API_ENABLED` | `true` pour autoriser les appels HTTP auth |
| `VITE_GOOGLE_AUTH_ENABLED` | `true` pour activer le flux Google |
| `VITE_API_TIMEOUT_MS` | Timeout Axios (défaut `15000`) |

Quand `VITE_AUTH_API_ENABLED=false`, les services lèvent `FeatureUnavailableError` **sans** appeler le backend.

## Endpoints prévus

| Méthode | Route | Body (prévu) | Réponse (prévue) |
|---|---|---|---|
| `POST` | `/auth/login` | `{ email, password, remember }` | `{ user, accessToken?, refreshToken? }` |
| `POST` | `/auth/logout` | — | `204` / `{ ok: true }` |
| `GET` | `/auth/me` | — | `{ id, email, name, … }` |
| `POST` | `/auth/google` | token / code OAuth | même forme que login |
| `POST` | `/auth/forgot-password` | `{ email }` | `{ ok: true }` |
| `POST` | `/access-requests` | `{ email, role, message, product }` | `{ id, email, role, status, createdAt }` |

## Codes d’erreur attendus

| HTTP | Usage frontend |
|---|---|
| `400` | Requête invalide |
| `401` | Identifiants invalides / session expirée |
| `403` | Accès refusé |
| `409` | Demande d’accès déjà en cours pour l’email |
| `422` | Validation serveur (Pydantic) |
| `500` | Erreur serveur |
| timeout / réseau | `NetworkError` |

## Relation avec l’API chat actuelle

Le backend expose déjà :

- `POST /chat`
- `GET /conversations`
- `GET /conversations/{session_id}`
- feedback / interactions

L’identification actuelle repose sur `external_id` (pas d’auth). Après auth réelle, le frontend devra :

1. stocker le token de façon sécurisée (hors URL, hors démo localStorage) ;
2. envoyer `Authorization: Bearer …` via `apiClient` ;
3. remplacer `external_id` anonyme par l’identité JWT / profil `/auth/me` ;
4. rediriger `/login` → `/chat` uniquement après succès confirmé.

## Règles

- Ne pas inventer silencieusement les payloads.
- Vérifier Swagger avant activation de `VITE_AUTH_API_ENABLED`.
- Ne jamais logger le mot de passe.
- Ne jamais placer un token dans l’URL.
