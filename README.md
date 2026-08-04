# Cartin AI — Frontend

Interface React/TypeScript pour Cartin AI. **Statut actuel** : page `/chat` connectée à `POST /chat` du backend FastAPI `agent_cartin` ; authentification JWT encore désactivée.

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
VITE_API_TIMEOUT_MS=60000
```

- `VITE_API_BASE_URL` est **obligatoire** (jamais hardcodé dans les composants).
- `VITE_API_TIMEOUT_MS` : délai Axios (défaut 60000 ms pour les réponses chat longues).
- Laisser `VITE_AUTH_API_ENABLED=false` tant que `/auth/*` n’existe pas.

## Lancement du backend (`agent_cartin`)

Depuis le dépôt backend :

```bash
# selon le README du backend, typiquement :
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Swagger : [http://localhost:8000/docs](http://localhost:8000/docs)  
OpenAPI : [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

### CORS

Le backend autorise l’origine Vite de développement `http://localhost:5173` via `CORSMiddleware`. Sans cela, le navigateur bloquera les appels `POST /chat`.

## Lancement du frontend

```bash
npm run dev
```

Ouvrir :

- `http://localhost:5173/chat` — agent conversationnel (API réelle)
- `http://localhost:5173/login` — UI auth (API désactivée)

## Procédure de test manuelle

1. Démarrer `agent_cartin` sur le port 8000.
2. Démarrer le frontend (`npm run dev`).
3. Ouvrir `/chat`, poser une question.
4. Vérifier l’apparition immédiate du message user, le typing indicator, puis la réponse backend.
5. Poser une deuxième question : le même `session_id` doit être réutilisé (visible dans l’onglet Network).
6. Cliquer « Nouvelle conversation » puis reposer une question : pas de `session_id` sur le premier nouvel appel.
7. Tester Swagger `POST /chat` en parallèle si besoin.

## Tests automatisés

Exécuter les suites **séparément** :

```bash
npm run test:unit
npm run test:integration
npm run test:api
```

## Build

```bash
npm run build
npm run preview
```

## Organisation

Voir `ARCHITECTURE.md`. Contrat chat : `docs/frontend-chat-contract.md`.

## Chat — état actuel

| Fonctionnalité | Statut |
|---|---|
| UI chat complète (`/chat`) | ✅ |
| `POST /chat` réel (Axios) | ✅ |
| Conservation `session_id` / `interaction_id` | ✅ |
| Suggestions → même flux API | ✅ |
| Erreurs réseau / HTTP / timeout | ✅ |
| Typing indicator (sans faux streaming) | ✅ |
| `external_id` temporaire centralisé | ✅ |
| Historique backend (`/conversations`) | ❌ prochaine étape |
| Feedback backend | ❌ prochaine étape |
| JWT / profil utilisateur dynamique | ❌ prochaine étape |

## Authentification — statut

| Fonctionnalité | Statut |
|---|---|
| UI connexion | ✅ |
| UI demande d’accès | ✅ |
| Validation Zod | ✅ |
| Services HTTP isolés | ✅ (désactivés par flag) |
| Login réel / JWT / Google | ❌ backend absent |
| Remplacement de `external_id` | ❌ après auth réelle |
