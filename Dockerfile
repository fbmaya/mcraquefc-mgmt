# ── Build stage ──────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# API base is baked at build time (Vite). Override via build arg if needed.
ARG VITE_API_BASE=http://localhost:8000
ENV VITE_API_BASE=$VITE_API_BASE
RUN npm run build

# ── Serve stage ──────────────────────────────────────────────
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# SPA fallback assado na imagem (produção). No local, o docker-compose
# monta local/nginx/mgmt.conf por cima — conteúdo idêntico.
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
