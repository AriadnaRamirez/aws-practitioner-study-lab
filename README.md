# AWS Practitioner Study Lab

Frontend y backend viven **por separado** en la raíz del repo (mismo monorepo npm, paquetes distintos).

| Carpeta | Rol | Stack | Puerto |
| --- | --- | --- | --- |
| [`frontend/`](./frontend) | UI | Next.js (App Router) + TypeScript + Tailwind | `43123` |
| [`backend/`](./backend) | API | Nest.js + TypeScript + Prisma + Swagger | `43124` |
| [`packages/shared/`](./packages/shared) | Contratos compartidos (tipos / constantes) | TypeScript | — |

Producto y reglas: Project Context → `docs/documento-maestro.md`  
Cómo pedir trabajo: Project Context → `docs/sistema-tickets.md`

## Requisitos

- Node.js ≥ 20
- npm 10+
- PostgreSQL 16 (recomendado vía Docker Compose)

## Setup

```bash
npm install
cp backend/.env.example backend/.env
# opcional frontend:
# echo 'NEXT_PUBLIC_API_URL=http://127.0.0.1:43124/api/v1' > frontend/.env.local

docker compose up -d
npm run db:migrate
npm run db:seed
npm run build -w @aps/shared
```

El seed crea **1 ADMIN** (`ADMIN_EMAIL` / `ADMIN_USERNAME` / `ADMIN_PASSWORD`) y contenido demo CLF. No commits de secretos reales.

## Desarrollo (dos procesos)

Terminal 1 — **backend** (Nest):

```bash
npm run dev:backend
```

- Health: http://127.0.0.1:43124/api/v1/health  
- Swagger: http://127.0.0.1:43124/docs  

Terminal 2 — **frontend** (Next):

```bash
npm run dev:frontend
```

- UI: http://127.0.0.1:43123  

Aliases legacy: `dev:api` → backend, `dev:web` → frontend.

### Auth

| Tema | Detalle |
| --- | --- |
| Registro / login | email **o** username + password |
| Tokens | JWT access Bearer |
| Reset | forgot/reset password |

### Contenido

| Qué | Dónde |
| --- | --- |
| Tipos | `packages/shared` |
| Persistencia | Prisma en `backend/prisma` |
| API pública | `GET /api/v1/topics`, `/knowledge-items`, `/exam-questions` |
| Admin CRUD | `/api/v1/admin/...` + `x-admin-token` |
| UI admin | `/admin` en el frontend |
| Seed | `npm run db:seed` ← `backend/src/content/content.seed.ts` |

### Estudio (Nest `StudyModule`)

- `FLASH_STUDY` (APS-8), `EXAM_STUDY` (APS-9), `EXAM_TIMED` (APS-10)
- UI: `/estudiar`, `/estudiar/examen`

## Alcance actual

- Frontend Next + backend Nest separados
- Auth JWT, shell/tema, content Prisma, flash + modos examen, guest analytics

**Fuera de alcance aún:** podio completo en UI, Google OAuth, AdminGuard JWT.

## Scripts raíz

| Script | Qué hace |
| --- | --- |
| `npm run dev:frontend` | Next en `:43123` |
| `npm run dev:backend` | Nest watch en `:43124` |
| `npm run db:up` | Postgres (Docker) |
| `npm run db:migrate` | Prisma migrate (backend) |
| `npm run db:seed` | Seed admin + content |
| `npm run build` | shared → backend → frontend |
| `npm run test:backend` | unit tests Nest |
