# Architecture — cartin_ai_frontend

Frontend React/TypeScript pour Cartin AI. Organisation calquée sur le backend `agent_ia_cartin` : `routers/` à la racine, couches métier dans `src/` (`configs`, `models`, `schemas`, `services`, `tools`), tests `unit` / `api` / `integration`, docs vivantes.

## Structure (miroir backend)

```text
agent_ia_cartin/                    cartin_ai_frontend/
├── main.py                         ├── src/main.tsx · App.tsx
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
│                                   │   ├── components/   # UI React
│                                   │   ├── pages/
│                                   │   ├── layouts/
│                                   │   ├── hooks/
│                                   │   ├── styles/
│                                   │   └── assets/
├── tests/                          ├── tests/
│   ├── unit/{domain}/              │   ├── unit/{auth,schemas,tools}/
│   ├── api/                        │   ├── api/auth/
│   └── integration/                │   └── integration/auth/
├── docs/                           ├── docs/
├── ARCHITECTURE.md                 ├── ARCHITECTURE.md
├── JOURNAL.md                      ├── JOURNAL.md
└── README.md                       └── README.md
```

## Détail

```text
cartin_ai_frontend/
├── routers/                      # équivalent routers/ FastAPI
├── src/
│   ├── configs/                  # app, api, routes, auth (flags + messages)
│   ├── models/                   # auth.ts, access_request.ts
│   ├── schemas/                  # login.ts, access_request.ts (Zod)
│   ├── services/
│   │   ├── api/                  # api_client, api_error
│   │   ├── auth_service.ts
│   │   └── access_request_service.ts
│   ├── tools/                    # helpers purs (ex-utils)
│   ├── components/{auth,common}/
│   ├── pages/auth/
│   ├── layouts/
│   ├── hooks/auth/
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
| `routers/` | `routers/` | Déclaration des routes frontend |
| `src/configs` | `src/configs` | Config pure, feature flags |
| `src/models` | `src/models` | Types / contrats TS |
| `src/schemas` | `src/schemas` | Validation Zod |
| `src/services` | `src/services` | HTTP métier via `api_client` |
| `src/tools` | `src/tools` | Utilitaires sans effet de bord |
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

## Couche API

- `services/api/api_client` (Axios) + `api_error`
- Flags : `VITE_AUTH_API_ENABLED`, `VITE_GOOGLE_AUTH_ENABLED`
- Contrat : `docs/frontend-api-contract.md`

## Fonctionnalités désactivées

Login réel, Google OAuth, forgot password, access requests persistées, JWT, accès `/chat` (ProtectedRoute → `/login`).

## Relation future avec FastAPI

1. Activer `VITE_AUTH_API_ENABLED=true`
2. Aligner types sur OpenAPI
3. Session token sécurisée
4. Remplacer `ProtectedRoute` / `external_id`
5. Rediriger `/login` → `/chat`

## Design

Fidèle à `docs/09_cartin_chat_auth.html` (navy `#1A3668`, accent `#F1A80B`, Nunito).
