# Contrat frontend chat — POST /chat

Contrat UI ↔ backend FastAPI `agent_cartin` pour l’écran `/chat` (Vue 3 + Pinia).

## Flux

```text
Question utilisateur
→ chat store (Pinia)
→ chat.service.sendChatMessage()
→ apiClient POST /chat
→ validation de la réponse
→ session_id conservé ; interaction_id sur le message assistant
```

## Requête / réponse

Identiques au contrat backend : `question`, `session_id?`, `external_id?` → `answer`, `session_id`, `interaction_id`.

## Hors périmètre

Historique backend, JWT, feedback, streaming.
