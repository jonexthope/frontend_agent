# Architecture — cartin_ai_frontend

Frontend Vue 3/JavaScript pour Cartin AI, construit avec Vite, Vue Router et Pinia. L'ancien socle React/TypeScript a été retiré.

## Structure

```text
src/
├── App.vue
├── main.js
├── assets/styles/              # unique emplacement des styles applicatifs
│   ├── global.css, auth.css, chat.css, admin.css
├── components/{auth,chat,common}/
├── composables/chat/           # logique réutilisable de composition
├── configs/                    # API, routes et constantes applicatives
├── constants/
├── layouts/
├── mocks/
├── pages/{auth,chat,admin}/     # écrans routés
├── router/
├── services/{api,auth,chat,identity}/
├── stores/                     # état Pinia auth, chat, history et UI
└── tools/                      # helpers purs (validation, erreurs, formatage, périodes)

tests/
├── setup.js
├── integration/chat/
└── unit/{components,services,stores,tools}/
```

## Responsabilités

- `main.js` initialise Vue, Pinia, le routeur et les styles partagés (`global`, `auth`, `chat`, `admin`).
- `pages` assemble les écrans routés (`AuthPage`, `ChatPage`, pages admin).
- Les styles des pages admin (`AccountManagementPage`, `AccessRequestsPage`, `CreateUserPage`) vivent dans `assets/styles/admin.css` (pas de `<style scoped>` sur ces écrans).
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
- **`history.service`** : couche `/conversations` (liste + détail) ; valide `items` / `interactions`.
- **`chatIdentity.service`** : centralise `external_id` temporaire (`frontend-agent-temporary-user`) ; partagé chat + historique.
- **Store chat** : messages, envoi, retry, nouvelle conversation, `loadConversation`.
- **Store history** : liste sidebar, sélection, groupement par période ; n’appelle pas le chat store en sens inverse depuis le chat.

### Gestion du `session_id`

1. Première question : payload sans `session_id` (backend crée la session).
2. Réponse : conserver `session_id` (ref + state) pour les questions suivantes.
3. « Nouvelle conversation » : `sessionId = null`, messages vidés ; le prochain `/chat` crée une nouvelle session.
4. Sélection historique : `loadConversation` synchronise `sessionId` et `sessionIdRef`.
5. Ne jamais générer un faux `session_id` côté frontend.
6. Un `session_id` inconnu côté backend → HTTP 404 (message UX dédié).

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

`external_id` est envoyé à chaque appel chat et historique. Ce n’est **pas** une authentification sécurisée. Remplacer via la couche identity quand le JWT sera disponible.

## Flux historique → GET /conversations

```text
ChatPage (onMounted / refresh après send)
  → history store.loadHistory / refreshHistory
  → history.service.listConversations
  → GET /conversations?external_id&status=active&date_from&page=1&page_size=100
  → tools/conversationPeriods.groupConversationsByPeriod
  → ConversationHistory (Aujourd’hui / Hier / Cette semaine / Ce mois)
```

Sélection :

```text
ConversationItem
  → history.selectConversation
  → GET /conversations/{session_id}
  → map interactions → messages
  → chat.loadConversation({ sessionId, messages })
```

Suppression logique :

```text
ConversationItem (menu ⋯)
  → confirmation
  → history.deleteConversation
  → PATCH /conversations/{session_id} { status: "archived" }
  → retrait local de la liste active
  → si conversation active: chat.startNewConversation()
```

Règles de période (calendrier local, semaine = lundi) :

- **Aujourd’hui** / **Hier** / **Cette semaine** / **Ce mois** (hors groupes plus récents)
- hors mois courant : non affiché (sauf débordement semaine/hier en début de mois)
- `date_from = min(début mois, début semaine, début hier)`
- `title` liste null → fallback `"Conversation"` (pas de N+1 détail)
- après ouverture d’une conversation sans titre : enrichissement local depuis la première question
- limite actuelle : une seule page (`page_size=100`, max backend)

Limitation connue : `GET /conversations/{session_id}` ne filtre pas encore par `external_id` côté backend ; à revoir avec JWT/auth.

Refresh après `POST /chat` réussi : orchestré dans `ChatPage` (évite dépendance circulaire chat → history).

## Couche API

- `services/api/apiClient.js` (Axios) + `apiError.js`
- Config : `VITE_API_BASE_URL` (obligatoire), `VITE_API_TIMEOUT_MS` (défaut 60000)
- Flags auth : `VITE_AUTH_API_ENABLED`, `VITE_GOOGLE_AUTH_ENABLED`
- Contrats : `docs/frontend-api-contract.md`, `docs/frontend-chat-contract.md`
- Endpoints chat : `POST /chat`, `GET /conversations`, `GET /conversations/{session_id}`

## CORS (backend `agent_cartin`)

En développement, `CORSMiddleware` autorise `http://localhost:5173`. Les origines de production devront venir de la configuration backend.

## Fonctionnalités désactivées / hors périmètre actuel

Login réel, Google OAuth, forgot password, access requests persistées, JWT, feedback réel, SSE / streaming, restauration d’archives et suppression physique.

## Relation future avec FastAPI

1. Activer `VITE_AUTH_API_ENABLED=true`
2. Aligner types sur OpenAPI
3. Session token sécurisée
4. Brancher feedback `/interactions` ; sécuriser le détail conversation par identité
5. Remplacer l’identité temporaire et la garde de route par l’identité connectée
6. Rediriger `/login` → `/chat`

## Design

Fidèle à `docs/09_cartin_chat_auth.html` et `docs/08_cartin_chat_agent.html` (navy `#1A3668`, accent `#F1A80B`, Nunito). Les réponses sont rendues sans HTML injecté.
