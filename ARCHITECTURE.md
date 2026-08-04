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
│   │   └── persistence/            │   │   └── api/
│   └── tools/                      │   ├── tools/
│                                   │   ├── constants/
│                                   │   ├── mocks/
│                                   │   ├── components/   # UI React
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
├── main.tsx                      # point d’entrée (équivalent main.py)
├── App.tsx                       # assemblage BrowserRouter + AppRouter
├── routers/                      # équivalent routers/ FastAPI
├── src/
│   ├── configs/                  # app, api, routes, auth (flags + messages)
│   ├── models/                   # auth.ts, access_request.ts, chat/*
│   ├── schemas/                  # login.ts, access_request.ts (Zod)
│   ├── services/
│   │   ├── api/                  # api_client, api_error
│   │   ├── auth_service.ts
│   │   ├── access_request_service.ts
│   │   └── chat/chat-ui.service.ts (mock local)
│   ├── tools/                    # helpers purs (ex-utils)
│   ├── constants/chat.constants.ts
│   ├── mocks/{chat,conversations,user}.mock.ts
│   ├── components/{auth,chat,common}/
│   ├── pages/{auth,chat}/
│   ├── layouts/
│   ├── hooks/{auth,chat}/
│   ├── utils/chat/
│   ├── styles/
│   └── assets/
├── tests/{unit,api,integration}/
├── docs/                         # maquettes HTML + contrat API + logo
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
| `src/mocks` | — | Données locales de démonstration |
| `components/pages/layouts/hooks` | — | Couche UI React (spécifique frontend) |
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

## Flux chat local (étape UI)

```text
ChatPage → useLocalChat + useChatComposer + useSidebar
  → chat-ui.service (mock delay/réponse)
  → mocks/chat.mock
  → MessageList / MessageBubble / TypingIndicator
```

- Aucune requête API n'est envoyée dans cette étape.
- Aucune session locale d'authentification n'est créée pour `/chat`.
- `ProtectedRoute` est conservé comme point d'extension, sans check token fictif.

## Couche API

- `services/api/api_client` (Axios) + `api_error`
- Flags : `VITE_AUTH_API_ENABLED`, `VITE_GOOGLE_AUTH_ENABLED`
- Contrat : `docs/frontend-api-contract.md`

## Fonctionnalités désactivées

Login réel, Google OAuth, forgot password, access requests persistées, JWT, API chat/historique/feedback branchées.

## Relation future avec FastAPI

1. Activer `VITE_AUTH_API_ENABLED=true`
2. Aligner types sur OpenAPI
3. Session token sécurisée
4. Brancher `POST /chat`, `/conversations`, `/interactions`, feedback
5. Remplacer `ProtectedRoute` / `external_id`
6. Rediriger `/login` → `/chat`

## Design

Fidèle à `docs/09_cartin_chat_auth.html` (navy `#1A3668`, accent `#F1A80B`, Nunito).
