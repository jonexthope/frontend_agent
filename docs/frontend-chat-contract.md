# Contrat frontend chat — POST /chat

Contrat UI ↔ backend FastAPI `agent_cartin` pour l’écran `/chat`.

## Objectif

Remplacer le chat simulé par un appel réel à `POST /chat`, sans streaming.

## Flux

```text
Question utilisateur
→ useChat.sendMessage()
→ affichage immédiat du message user + TypingIndicator
→ chat.service.sendChatMessage()
→ apiRequest POST /chat
→ validation SendChatResponse
→ session_id conservé ; interaction_id sur le message assistant
→ affichage de answer en texte (formatage léger, pas de HTML brut)
```

## Requête

```json
{
  "question": "string",
  "session_id": "uuid (optionnel, uniquement si conversation existante)",
  "external_id": "frontend-agent-temporary-user"
}
```

- Première question d’une conversation : **ne pas** envoyer `session_id`.
- Questions suivantes : réutiliser le `session_id` retourné.
- `external_id` : valeur temporaire centralisée dans `chat-identity.service` (pas une auth).

## Réponse

```json
{
  "answer": "string",
  "session_id": "uuid",
  "interaction_id": "uuid"
}
```

## Erreurs UX

| Cas | Message utilisateur |
|---|---|
| Réseau | Impossible de communiquer avec Cartin AI… |
| Timeout | La réponse prend trop de temps… |
| 404 | Cette conversation n’est plus disponible… |
| 422 | La question envoyée n’est pas valide. |
| 500 / 503 | Cartin AI est temporairement indisponible. |
| Corps invalide | La réponse reçue de Cartin AI est invalide. |

## Hors périmètre (prochaine étape)

- Historique `GET /conversations` / groupement Aujourd’hui·Hier
- JWT / `external_id` réel
- Feedback sur `interaction_id`
- SSE / WebSocket / streaming
