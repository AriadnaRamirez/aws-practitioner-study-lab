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

## Alcance actual (APS-3 + APS-6)

Scaffold + **content stubs in-memory** (topics / knowledge / exam questions) y shell `/admin` en español.

| Qué | Dónde |
| --- | --- |
| Tipos compartidos | `packages/shared` (`Topic`, `KnowledgeItem`, `ExamQuestion`) |
| API contenido | `GET /api/v1/topics`, `/knowledge-items`, `/exam-questions` |
| Admin CRUD | `/api/v1/admin/...` + header `x-admin-token` (`ADMIN_TOKEN`) |
| UI admin | `/admin` (Resumen, Usuarios stub, Temas, Flash, Banco, Import stub) |
| Swagger | http://127.0.0.1:43124/docs |

**Fuera de alcance aún:** auth JWT (APS-4), Prisma content tables (APS-7), motor flash, examen, podio, import real.

### Admin token (APS-6 → APS-4)

Hasta el merge de auth, las mutaciones admin usan `x-admin-token` = `ADMIN_TOKEN` (default `dev-admin-token`). `AdminGuard` está documentado para sustituirse por JWT + role `ADMIN` sin renombrar los controllers.

## Scripts raíz

| Script | Qué hace |
| --- | --- |
| `npm run dev:web` | Next en `:43123` |
| `npm run dev:api` | Nest watch en `:43124` |
| `npm run build` | shared → api → web |
| `npm run test:api` | unit tests Nest |
