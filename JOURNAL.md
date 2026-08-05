# Journal technique — cartin_ai_frontend

### 2026-08-05
Regroupement des écrans routés dans `src/pages/{auth,chat}` et suppression de `src/views` afin de conserver la convention `pages`.

### 2026-08-05
Affichage du temps d’exécution client sous chaque réponse IA (`durationMs` mesuré dans le store chat, rendu dans `MessageBubble`).

### 2026-08-05
Migration complète React 19/TypeScript → Vue 3/JavaScript/Pinia : stores chat/auth/ui, composables, vues `.vue`, services `.js`, tests Vitest/Vue Test Utils, suppression de tous les fichiers `.ts`/`.tsx`, build et tests OK. Connexion `POST /chat` conservée.

### 2026-08-05
Suppression des derniers fichiers React/TypeScript et des anciens styles afin de finaliser la migration vers Vue 3/JavaScript.

### 2026-08-04
Branchements chat → `POST /chat` : `chat.service`, `useChat`, `chat-identity` (`external_id` temporaire), modèles API, suppression des mocks de réponses ; CORS `localhost:5173` côté `agent_cartin` ; tests service/hook/intégration ; docs ARCHITECTURE/README/contrat mises à jour. Pas de streaming.

### 2026-08-04
Intégration UI complète de `/chat` depuis le template agent : architecture chat modulaire (components/hooks/models/services/mocks/constants/utils), route `/chat` active sans fake auth/token, tests unitaires/intégration chat ajoutés, documentation architecture/README/contrat chat mise à jour pour préparer le branchement API ultérieur.

### 2026-08-03
Alignement du point d’entrée avec `agent_cartin` : `main.tsx` et `App.tsx` remontés à la racine (comme `main.py`), hors de `src/`.

### 2026-08-03
Suppression du dossier `template/` (doublon des maquettes HTML déjà présentes dans `docs/`).

### 2026-08-03
Réorganisation des dossiers pour mirroir `agent_cartin` : `routers/` à la racine, `src/{configs,models,schemas,services,tools}`, services aplatis (`auth_service.ts`), constants fusionnés dans `configs/auth.config.ts`, tests unitaires par domaine (`auth`, `schemas`, `tools`).

### 2026-08-03
Création du frontend Cartin AI (Vite + React + TS) : `/login` fidèle au template auth, architecture alignée sur `agent_ia_cartin`, logo officiel intégré, démos HTML retirées.

**Créé** : scaffold Vite, configs, routes, AuthLayout/AuthPage, composants auth/common, schémas Zod, services + `FeatureUnavailableError`, styles, tests unit/intégration/api, `docs/frontend-api-contract.md`, README, ARCHITECTURE.

**Décisions** : pas de session simulée ; `VITE_AUTH_API_ENABLED=false` ; RHF + Zod ; Axios via `apiClient` ; onglets React (`?mode=`).

**Démos HTML retirées** : localStorage auth, `?s=`, faux user/Google/démo, `cartin_ai_access_requests`.

**Restant** : endpoints FastAPI auth, session JWT, redirection `/chat`, UI agent, remplacement `external_id`.
