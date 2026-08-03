# Cartin AI — Frontend

Interface React/TypeScript pour Cartin AI. **Statut actuel** : page de connexion et de demande d’accès (`/login`) prête côté UI ; authentification backend **non disponible**.

## Prérequis

- Node.js 20+
- npm 10+
- Backend FastAPI optionnel sur `http://localhost:8000` (chat existant ; auth absente)

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
VITE_API_TIMEOUT_MS=15000
```

Laisser `VITE_AUTH_API_ENABLED=false` tant que `/auth/*` n’existe pas sur le backend.

## Lancement

```bash
npm run dev
```

Ouvrir `http://localhost:5173/login`.

## Tests

Exécuter les suites **séparément** (évite de saturer la machine) :

```bash
npm run test:unit
npm run test:integration
npm run test:api
```

Ou l’ensemble :

```bash
npm test
```

## Build

```bash
npm run build
npm run preview
```

## Organisation

Voir `ARCHITECTURE.md`. Maquettes HTML de référence dans `docs/`.

## Authentification — statut

| Fonctionnalité | Statut |
|---|---|
| UI connexion | ✅ |
| UI demande d’accès | ✅ |
| Validation Zod | ✅ |
| Services HTTP isolés | ✅ (désactivés par flag) |
| Login réel / JWT / Google | ❌ backend absent |
| Redirection `/chat` | ❌ après auth réelle |
| Session locale simulée | ❌ volontairement absente |
