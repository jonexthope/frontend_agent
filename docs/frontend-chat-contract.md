# Contrat frontend chat — POST /chat + historique

Contrat UI ↔ backend FastAPI `agent_cartin` pour l’écran `/chat` (Vue 3 + Pinia).

## Flux chat

```text
Question utilisateur
→ chat store (Pinia)
→ chat.service.sendChatMessage()
→ apiClient POST /chat
→ validation de la réponse
→ session_id conservé ; interaction_id sur le message assistant
→ ChatPage refresh history store
```

## Requête / réponse chat

Identiques au contrat backend : `question`, `session_id?`, `external_id?` → `answer`, `session_id`, `interaction_id`.

`external_id` vient uniquement de `getChatExternalId()` (`frontend-agent-temporary-user`).

## Historique

### Liste — `GET /conversations`

Appelé via `history.service.listConversations` avec :

| Param | Valeur frontend |
|---|---|
| `external_id` | `getChatExternalId()` (même identité que `/chat`) |
| `status` | `active` |
| `date_from` | `getHistoryStartDate().toISOString()` (min lundi / début hier) |
| `page` | `1` |
| `page_size` | `100` (max backend) |

Réponse lue : `items[]` avec `session_id`, `title`, `created_at`, `last_activity_at`, `status`, `interaction_count`.

Groupement UI (`conversationPeriods.js`) sur **`last_activity_at`**, fuseau **local** :

- Aujourd’hui
- Hier
- Cette semaine (depuis lundi, hors aujourd’hui/hier)

Conversations plus anciennes : non affichées. `title` null en liste → fallback `"Conversation"` sans appel N+1.

Limite : une page uniquement ; si `total > page_size`, des items peuvent manquer.

### Détail — `GET /conversations/{session_id}`

Au clic sidebar uniquement (pas de N+1 pour les titres).

`interactions[]` → messages chat (`question` → user, `answer` → assistant + `interactionId`).  
`answer === null` : pas de bulle assistant inventée.

Puis `chatStore.loadConversation` synchronise `sessionId` / `sessionIdRef` pour continuer avec le même `session_id` sur le prochain `POST /chat`.

Si la conversation n’a pas de titre en liste et contient des interactions, le frontend enrichit localement le titre avec la première question après ouverture.

### Suppression logique — `PATCH /conversations/{session_id}`

Le frontend utilise `history.service.archiveConversation` avec :

```json
{ "status": "archived" }
```

Flux :

```text
ConversationItem (⋯ → Supprimer)
→ ConfirmDialog
→ historyStore.deleteConversation
→ PATCH archived
→ retrait immédiat de la liste active
→ si active: chatStore.startNewConversation()
```

### Sécurité (limitation connue)

Le détail conversation backend ne filtre pas encore par `external_id`. À revoir avec JWT/auth.

## Hors périmètre

JWT, feedback, streaming, restauration d’une conversation archivée, suppression physique.
