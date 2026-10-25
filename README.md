# AWS Practitioner Study Lab

**No hay deploy.** El MVP se corre en **tu laptop** (`localhost`). Un Cloud Agent no puede arrancar procesos en tu PC: clona el repo y usa los scripts de abajo.

Frontend y backend van **por separado** en la raíz (mismo monorepo npm).

| Carpeta | Rol | Stack | Puerto |
| --- | --- | --- | --- |
| [`frontend/`](./frontend) | UI | Next.js (App Router) + TypeScript + Tailwind | `43123` |
| [`backend/`](./backend) | API | Nest.js + TypeScript + Prisma + Swagger | `43124` |
| [`packages/shared/`](./packages/shared) | Contratos compartidos (tipos / constantes) | TypeScript | — |

## En tu máquina (localhost)

Requisitos: Node ≥ 20, npm 10+, Docker (Postgres) o Postgres local.

```bash
git clone https://github.com/AriadnaRamirez/aws-practitioner-study-lab.git
cd aws-practitioner-study-lab
npm run setup:local    # install, .env, docker Postgres, migrate, seed
npm run local          # Nest :43124 + Next :43123 a la vez
```

Luego abre:

- UI: http://127.0.0.1:43123  
- API health: http://127.0.0.1:43124/api/v1/health  
- Swagger: http://127.0.0.1:43124/docs  

Admin seed: usuario `admin` / password `ChangeMeAdmin1!`

Alternativa en dos terminales: `npm run dev:backend` y `npm run dev:frontend`.

Producto: Project Context → `docs/documento-maestro.md`  
Tickets: Project Context → `docs/sistema-tickets.md`

## Setup manual (si no usas setup:local)

```bash
npm install
cp backend/.env.example backend/.env
echo 'NEXT_PUBLIC_API_URL=http://127.0.0.1:43124/api/v1' > frontend/.env.local
docker compose up -d
npm run db:migrate:deploy
npm run db:seed
npm run build -w @aps/shared
```

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
