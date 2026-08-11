# Cartin AI — Frontend

Interface **Vue 3 + JavaScript + Pinia** pour Cartin AI. Le chat est connecté à `POST /chat` du backend FastAPI `agent_cartin`.

## Prérequis

- Node.js 20+
- npm 10+
- Backend `agent_cartin` sur `http://localhost:8000`

## Installation

```bash
npm install
```

## Variables d’environnement

Copier `.env.example` vers `.env` :

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Cartin AI
VITE_AUTH_API_ENABLED=false
VITE_GOOGLE_AUTH_ENABLED=false
VITE_API_TIMEOUT_MS=600000
```

## Lancement

```bash
# backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# frontend
npm run dev
```

- `http://localhost:5173/login` — connexion / demande d’accès (UI)
- `http://localhost:5173/chat` — agent conversationnel (API réelle)

Swagger : http://localhost:8000/docs

## Stack

- Vue 3 (Composition API, `<script setup>`)
- Pinia (stores `auth`, `chat`, `history`, `ui`)
- Vue Router
- Vite
- Axios
- Vitest + Vue Test Utils

## Tests

Exécuter les suites **séparément** :

```bash
npm run test:unit
npm run test:integration
```

## Build

```bash
npm run build
npm run preview
```

## Architecture

Voir `ARCHITECTURE.md` et `docs/frontend-chat-contract.md`.

## État fonctionnel

| Fonctionnalité | Statut |
|---|---|
| UI chat + `POST /chat` | ✅ |
| `session_id` / `interaction_id` | ✅ |
| Historique `/conversations` (Aujourd’hui / Hier / Cette semaine) | ✅ |
| UI auth (sans JWT réel) | ✅ |
| Feedback / JWT / streaming | ❌ hors périmètre actuel |
