# AWS Practitioner Study Lab

Monorepo del lab de estudio para **AWS Certified Cloud Practitioner**.

| App | Stack | Puerto local |
| --- | --- | --- |
| `apps/web` | Next.js (App Router) + TypeScript + Tailwind | `43123` |
| `apps/api` | Nest.js + TypeScript + Swagger | `43124` |
| `packages/shared` | Tipos / constantes compartidas | — |

Producto y reglas: Project Context → `docs/documento-maestro.md`  
Cómo pedir trabajo: Project Context → `docs/sistema-tickets.md`

## Requisitos

- Node.js ≥ 20
- npm 10+

## Setup

```bash
npm install
npm run build -w @aps/shared
```

## Desarrollo

Terminal 1 — API:

```bash
npm run dev:api
```

- Health: http://127.0.0.1:43124/api/v1/health  
- Swagger: http://127.0.0.1:43124/docs  

Terminal 2 — Web:

```bash
npm run dev:web
```

- UI: http://127.0.0.1:43123  

Variables: ver `.env.example`.

## Tema UI (APS-5)

El front (`apps/web`) sigue la preferencia del sistema (`prefers-color-scheme`) vía **next-themes** en modo `system`: tokens CSS claro/oscuro en `apps/web/src/app/globals.css` (clase `.dark` en `<html>`).

Identidad: tipografías **Syne** (display) + **Figtree** (cuerpo); paleta teal / cool mist — no branding CCST.

## Alcance actual

- **APS-3:** monorepo, healthcheck, Swagger  
- **APS-5:** shell UI, tema system, landing de marca, nav placeholders  

**Fuera de alcance aún:** auth real, flashcards, modos de examen, podio, admin data, PostgreSQL en runtime.

## Scripts raíz

| Script | Qué hace |
| --- | --- |
| `npm run dev:web` | Next en `:43123` |
| `npm run dev:api` | Nest watch en `:43124` |
| `npm run build` | shared → api → web |
| `npm run test:api` | unit tests Nest |
