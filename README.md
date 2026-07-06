# mcraquefc-mgmt

Painel de administração da plataforma **Meu Craque FC** (uso interno do time
`platform_admin`). Gerencia escolinhas, licenças e usuários (gestores/professores).

Consome apenas os endpoints `/platform/*` do backend e o login exige
`role=platform_admin`.

## Stack

Vite + React 19 + TypeScript + TanStack Query + React Router. Mesma stack e
tokens de tema do `mcraquefc-frontend` (tema escuro/índigo).

```
src/
  api/        client HTTP (JWT) + tipos + endpoints /platform/*
  auth/       AuthContext (restrito a platform_admin)
  hooks/      queries.ts (TanStack Query)
  components/ Modal, Toast, Layout + modais (nova escola, licença, usuário, detalhe)
  pages/      LoginPage, OverviewPage, SchoolsPage
```

## Desenvolvimento

```bash
npm install
npm run dev      # http://localhost:3001 (backend esperado em :8000)
npm run build    # tsc -b && vite build
npm run lint     # oxlint
```

`VITE_API_BASE` (padrão `http://localhost:8000`) define a base da API em build.

## Docker

Build multi-stage (node → nginx) via `Dockerfile`. Servido em `:3001` pelo
`local/docker-compose.yml` com fallback SPA em `local/nginx/mgmt.conf`.
