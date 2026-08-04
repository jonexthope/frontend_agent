# Contrat frontend chat (étape UI locale)

Ce document décrit l'état actuel de l'interface `/chat` côté frontend, **sans appel backend**.

## Objectif de l'étape

- Intégrer l'UI complète de l'agent conversationnel depuis `docs/08_cartin_chat_agent.html`.
- Conserver le design et les tokens visuels utilisés par la page auth.
- Préparer une séparation claire UI locale ↔ future API.

## Périmètre implémenté

- Route `/chat` et `/chat/:conversationId`.
- Sidebar (historique local, nouvelle conversation, profil mock).
- Header (badge Cartin AI, bouton menu mobile, partage local).
- Welcome screen + 4 suggestions.
- Thread messages user/assistant.
- Typing indicator local.
- Composer (textarea auto-resize, Enter/Shift+Enter, toolbar live/analyse, send button).
- Responsive desktop/mobile (sidebar overlay + backdrop).

## État des données

- Conversations: mocks locaux (`src/mocks/conversations.mock.ts`).
- Réponses assistant: mocks locaux (`src/mocks/chat.mock.ts`).
- Utilisateur: mock local (`src/mocks/user.mock.ts`).
- Aucun stockage de session auth (`localStorage`) pour `/chat`.

## Flux local actuel

```text
Question utilisateur
→ useLocalChat.submitUserMessage()
→ ajout message user + placeholder assistant (sending)
→ typing indicator
→ réponse mock via chat-ui.service
→ message assistant final (sent)
```

## Contrat futur avec backend (non branché ici)

### À connecter ensuite

- `POST /chat`
- `GET /conversations`
- `GET /conversations/{session_id}`
- `PATCH /conversations/{session_id}`
- `GET /interactions/{interaction_id}`
- feedback endpoints

### Sortie attendue côté UI

`POST /chat` devra alimenter:

- `answer` → contenu assistant
- `session_id` → conversation active
- `interaction_id` → actions feedback

## Exclusions explicites de cette étape

- Pas de JWT/OAuth.
- Pas de persistance auth locale.
- Pas de streaming backend réel.
- Pas d'appels API chat/historique/feedback.
