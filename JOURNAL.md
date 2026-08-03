# Journal technique — cartin_ai_frontend

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
