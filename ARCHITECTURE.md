# Architecture — cartin_ai_frontend

Frontend Vue 3/JavaScript pour Cartin AI, construit avec Vite, Vue Router et Pinia. L'ancien socle React/TypeScript a été retiré.

## Structure

```text
src/
├── App.vue
├── main.js
├── assets/styles/              # unique emplacement des styles applicatifs
├── components/{auth,chat,common}/
├── composables/chat/           # logique réutilisable de composition
├── configs/                    # API, routes et constantes applicatives
├── constants/
├── layouts/
├── mocks/
├── pages/{auth,chat}/           # écrans routés
├── router/
├── services/{api,auth,chat,identity}/
├── stores/                     # état Pinia auth, chat et UI
└── tools/                      # helpers purs (validation, erreurs, formatage)

tests/
├── setup.js
├── integration/chat/
└── unit/{components,services,stores,tools}/
```

## Responsabilités

- `main.js` initialise Vue, Pinia, le routeur et les styles partagés.
- `pages` assemble les écrans routés (`AuthPage` et `ChatPage`).
- `router/index.js` est l’unique routeur et réutilise `configs/routes.config.js`.
- `layouts` définissent la structure des écrans auth et chat.
- `components` contient les composants Vue par domaine.
- `composables` porte la logique d'interface réutilisable.
- `stores` centralise l'état partagé avec Pinia.
- `services` isole les appels API et la logique d'intégration.
- `configs`, `constants`, `mocks` et `tools` restent sans dépendance UI directe.
- Les tests Vitest sont écrits en JavaScript.
- Les assets servis directement sont dans `public`; le logo applicatif utilise
  `public/images/cartin-logo.svg`. Le PNG des templates reste uniquement dans
  `docs/cartin-logo.png`.

## Flux de connexion

```text
AuthPage → LoginForm → auth store → auth.service.login
  → FeatureUnavailableError si VITE_AUTH_API_ENABLED=false
  → sinon POST /auth/login
  → AuthFeedback
```

## Flux de demande d’accès

```text
AuthPage (mode=access) → AccessRequestForm
  → accessRequest.service.requestAccess
  → FeatureUnavailableError tant que l’API n’existe pas
```

## Flux chat → POST /chat

```text
ChatPage
  → chat store (messages, sessionId, isSending, error)
  → chat.service
  → apiClient (Axios)
  → POST {VITE_API_BASE_URL}/chat
  → MessageList / MessageBubble / TypingIndicator
```

### Rôles

- **`apiClient`** : HTTP commun (base URL, timeout, JSON, erreurs, futur Bearer token).
- **`chat.service`** : seule couche qui connaît la route `/chat` ; valide `answer` / `session_id` / `interaction_id`.
- **`chatIdentity.service`** : centralise `external_id` temporaire (`frontend-agent-temporary-user`) ; pas une auth.
- **Store chat** : unique entrée UI pour envoyer, réessayer, créer une conversation et gérer les erreurs.

### Gestion du `session_id`

1. Première question : payload sans `session_id` (backend crée la session).
2. Réponse : conserver `session_id` (ref + state) pour les questions suivantes.
3. « Nouvelle conversation » : `sessionId = null`, messages vidés ; le prochain `/chat` crée une nouvelle session.
4. Ne jamais générer un faux `session_id` côté frontend.
5. Un `session_id` inconnu côté backend → HTTP 404 (message UX dédié).

### `interaction_id`

Conservé sur le message assistant (`interactionId`) pour le futur feedback. Non utilisé pour l’instant.

### Temps d’exécution affiché

Le store chat mesure la durée client de `POST /chat` via `performance.now()` et la stocke sur le message assistant (`durationMs`). `MessageBubble` l’affiche sous la réponse, en secondes, pour les messages IA uniquement. La valeur inclut le réseau.

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

- `services/api/apiClient.js` (Axios) + `apiError.js`
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
5. Remplacer l’identité temporaire et la garde de route par l’identité connectée
6. Rediriger `/login` → `/chat`

## Design

Fidèle à `docs/09_cartin_chat_auth.html` et `docs/08_cartin_chat_agent.html` (navy `#1A3668`, accent `#F1A80B`, Nunito). Les réponses sont rendues sans HTML injecté.
