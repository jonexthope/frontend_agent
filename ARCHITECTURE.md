# Architecture — cartin_ai_frontend

Frontend React/TypeScript pour Cartin AI. Organisation calquée sur le backend `agent_cartin` : `main.tsx` / `App.tsx` et `routers/` à la racine, couches métier dans `src/` (`configs`, `models`, `schemas`, `services`, `tools`), UI découpée par domaine (`auth`, `chat`), tests `unit` / `api` / `integration`, docs vivantes.

## Structure (miroir backend)

```text
agent_cartin/                       cartin_ai_frontend/
├── main.py                         ├── main.tsx · App.tsx
├── routers/                        ├── routers/
│   ├── chat.py                     │   ├── AppRouter.tsx
│   └── history.py                  │   ├── PublicRoute.tsx
│                                   │   └── ProtectedRoute.tsx
├── src/                            ├── src/
│   ├── configs/                    │   ├── configs/
│   ├── models/                     │   ├── models/
│   ├── schemas/                    │   ├── schemas/
│   ├── services/                   │   ├── services/
│   │   └── persistence/            │   │   ├── api/
│   │                               │   │   ├── chat/
│   │                               │   │   └── identity/
│   └── tools/                      │   ├── tools/
│                                   │   ├── constants/
│                                   │   ├── mocks/          # profil UI uniquement
│                                   │   ├── components/
│                                   │   ├── pages/
│                                   │   ├── layouts/
│                                   │   ├── hooks/
│                                   │   ├── utils/
│                                   │   ├── styles/
│                                   │   └── assets/
├── tests/                          ├── tests/
│   ├── unit/{domain}/              │   ├── unit/{auth,chat,schemas,tools}/
│   ├── api/                        │   ├── api/auth/
│   └── integration/                │   └── integration/{auth,chat}/
├── docs/                           ├── docs/
├── ARCHITECTURE.md                 ├── ARCHITECTURE.md
├── JOURNAL.md                      ├── JOURNAL.md
└── README.md                       └── README.md
```

## Détail

```text
cartin_ai_frontend/
├── main.tsx
├── App.tsx
├── routers/
├── src/
│   ├── configs/                  # app, api, routes, auth
│   ├── models/                   # auth, access_request, chat/*
│   ├── schemas/                  # login, access_request (Zod)
│   ├── services/
│   │   ├── api/                  # api_client (Axios), api_error
│   │   ├── chat/
│   │   │   ├── chat.service.ts   # seul point qui connaît POST /chat
│   │   │   └── chat-ui.service.ts # helpers UI (titre, message user)
│   │   ├── identity/
│   │   │   └── chat-identity.service.ts  # external_id temporaire
│   │   ├── auth_service.ts
│   │   └── access_request_service.ts
│   ├── tools/
│   ├── constants/chat.constants.ts
│   ├── mocks/user.mock.ts        # initiales profil UI uniquement
│   ├── components/{auth,chat,common}/
│   ├── pages/{auth,chat}/
│   ├── layouts/
│   ├── hooks/{auth,chat}/
│   ├── utils/chat/               # erreurs, formatage texte, textarea
│   ├── styles/
│   └── assets/
├── tests/{unit,api,integration}/
├── docs/
├── public/
├── ARCHITECTURE.md
├── JOURNAL.md
└── README.md
```

## Responsabilités

| Dossier | Équivalent backend | Rôle |
|---|---|---|
| `main.tsx` / `App.tsx` | `main.py` | Entrée app + montage des routers |
| `routers/` | `routers/` | Déclaration des routes frontend |
| `src/configs` | `src/configs` | Config pure, feature flags |
| `src/models` | `src/models` | Types / contrats TS |
| `src/schemas` | `src/schemas` | Validation Zod |
| `src/services` | `src/services` | HTTP métier via `api_client` |
| `src/tools` | `src/tools` | Utilitaires sans effet de bord |
| `src/constants` | — | Constantes UI/domain (suggestions, textes) |
| `src/mocks` | — | Données UI non métier (profil affichage) |
| `components/pages/layouts/hooks` | — | Couche UI React |
| `tests` | `tests` | unit / api / integration |

## Flux de connexion

```text
AuthPage → LoginForm → useLogin → auth_service.login
  → FeatureUnavailableError si VITE_AUTH_API_ENABLED=false
  → sinon POST /auth/login
  → AuthFeedback
```

## Flux de demande d’accès

```text
AuthPage (mode=access) → AccessRequestForm → useAccessRequest
  → access_request_service.requestAccess
  → FeatureUnavailableError tant que l’API n’existe pas
```

## Flux chat → POST /chat

```text
ChatPage
  → useChat (messages, sessionId, isSending, error)
  → sendChatMessage (chat.service)
  → apiRequest / apiClient (Axios)
  → POST {VITE_API_BASE_URL}/chat
  → MessageList / MessageBubble / TypingIndicator
```

### Rôles

- **`apiClient` / `apiRequest`** : HTTP commun (base URL, timeout, JSON, erreurs, futur Bearer token).
- **`chat.service`** : seule couche qui connaît la route `/chat` ; valide `answer` / `session_id` / `interaction_id`.
- **`chat-identity.service`** : centralise `external_id` temporaire (`frontend-agent-temporary-user`) ; pas une auth.
- **`useChat`** : unique entrée UI pour envoyer, réessayer, nouvelle conversation, erreurs.

### Gestion du `session_id`

1. Première question : payload sans `session_id` (backend crée la session).
2. Réponse : conserver `session_id` (ref + state) pour les questions suivantes.
3. « Nouvelle conversation » : `sessionId = null`, messages vidés ; le prochain `/chat` crée une nouvelle session.
4. Ne jamais générer un faux `session_id` côté frontend.
5. Un `session_id` inconnu côté backend → HTTP 404 (message UX dédié).

### `interaction_id`

Conservé sur le message assistant (`interactionId`) pour le futur feedback. Non utilisé pour l’instant.

### Comportement réseau (pas de streaming)

Le backend renvoie la réponse complète après traitement (pas de SSE / WebSocket / stream token).

Flux UX :

```text
message user immédiat → TypingIndicator (3 points) → POST /chat → bulle IA complète
```

Aucun faux streaming caractère par caractère.

### Identité temporaire

`external_id` est envoyé à chaque appel. Ce n’est **pas** une authentification sécurisée. Remplacer via la couche identity quand le JWT sera disponible.

## Couche API

- `services/api/api_client` (Axios) + `api_error`
- Config : `VITE_API_BASE_URL` (obligatoire), `VITE_API_TIMEOUT_MS` (défaut 60000)
- Flags auth : `VITE_AUTH_API_ENABLED`, `VITE_GOOGLE_AUTH_ENABLED`
- Contrats : `docs/frontend-api-contract.md`, `docs/frontend-chat-contract.md`
- Endpoint chat : `POST /chat` (`question`, `session_id?`, `external_id?` → `answer`, `session_id`, `interaction_id`)

## CORS (backend `agent_cartin`)

En développement, `CORSMiddleware` autorise `http://localhost:5173`. Les origines de production devront venir de la configuration backend.

## Fonctionnalités désactivées / hors périmètre actuel

Login réel, Google OAuth, forgot password, access requests persistées, JWT, historique backend groupé (Aujourd’hui / Hier), feedback réel, SSE / streaming.

## Relation future avec FastAPI

1. Activer `VITE_AUTH_API_ENABLED=true`
2. Aligner types sur OpenAPI
3. Session token sécurisée
4. Brancher `/conversations`, `/interactions`, feedback
5. Remplacer `getChatExternalId` / `ProtectedRoute` par l’identité connectée
6. Rediriger `/login` → `/chat`

## Design

Fidèle à `docs/09_cartin_chat_auth.html` et `docs/08_cartin_chat_agent.html` (navy `#1A3668`, accent `#F1A80B`, Nunito). Pas de `dangerouslySetInnerHTML` sur les réponses.
