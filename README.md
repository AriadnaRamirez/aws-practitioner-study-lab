# AWS Practitioner Study Lab

Monorepo del lab de estudio para **AWS Certified Cloud Practitioner**.

| App | Stack | Puerto local |
| --- | --- | --- |
| `apps/web` | Next.js (App Router) + TypeScript + Tailwind | `43123` |
| `apps/api` | Nest.js + TypeScript + Prisma + Swagger | `43124` |
| `packages/shared` | Tipos / constantes compartidas | — |

Producto y reglas: Project Context → `docs/documento-maestro.md`  
Cómo pedir trabajo: Project Context → `docs/sistema-tickets.md`

## Requisitos

- Node.js ≥ 20
- npm 10+
- PostgreSQL 16 (recomendado vía Docker Compose)

## Setup

```bash
npm install
cp apps/api/.env.example apps/api/.env
# opcional web:
# echo 'NEXT_PUBLIC_API_URL=http://127.0.0.1:43124/api/v1' > apps/web/.env.local

# Postgres
docker compose up -d
# o Postgres local con DATABASE_URL=postgresql://aps:aps_dev@127.0.0.1:5432/aps_lab

# Apply Prisma migrations (auth + content models)
npm run db:migrate
# Seed ADMIN + demo topics / knowledge / exam questions (APS-7)
npm run db:seed
npm run build -w @aps/shared
```

### Migrate + seed (content)

From repo root (Postgres up, `apps/api/.env` with `DATABASE_URL`):

```bash
npm run db:migrate   # prisma migrate dev — creates/applies Topic, KnowledgeItem, ExamQuestion
npm run db:seed      # admin user + content from apps/api/src/content/content.seed.ts
```

Or from `apps/api`:

```bash
npx prisma migrate dev
npx prisma db seed
```

El seed crea **1 ADMIN** (`ADMIN_EMAIL` / `ADMIN_USERNAME` / `ADMIN_PASSWORD`) y el contenido demo CLF (temas Cómputo/Almacenamiento/Fundamentos, flash EC2/S3/responsabilidad compartida, 2 preguntas). No commits de secretos reales.

## Desarrollo

Terminal 1 — API:

```bash
npm run dev:api
```

- Health: http://127.0.0.1:43124/api/v1/health  
- Swagger: http://127.0.0.1:43124/docs  
- Auth: `POST /api/v1/auth/register|login|forgot-password|reset-password`, `GET /api/v1/auth/me` (Bearer)

Terminal 2 — Web:

```bash
npm run dev:web
```

- UI: http://127.0.0.1:43123  
- Páginas: `/register`, `/login`, `/forgot-password` (español)

### Auth (APS-4)

| Tema | Detalle |
| --- | --- |
| Registro | email + username + password + confirmación; fuerza mín. 8 + mayúscula/minúscula/número |
| Login | **email o username** + password → JWT access |
| Sesión | Access JWT Bearer (sin refresh en MVP; TTL `JWT_EXPIRES_IN`, default `7d`). El front guarda el token en `localStorage`. |
| Reset | Token de un solo uso (TTL 1h). En dev **no hay email real**: el link se imprime en el log de la API. |
| Roles | `STUDENT` \| `ADMIN` (un admin sembrado) |

### Tema UI (APS-5)

El front sigue la preferencia del sistema vía **next-themes** (`system`): tokens en `apps/web/src/app/globals.css`. Tipografías **Syne** + **Figtree**; paleta teal / cool mist — no branding CCST.

### Contenido (APS-6 + APS-7)

| Qué | Dónde |
| --- | --- |
| Tipos | `packages/shared` (`Topic`, `KnowledgeItem`, `ExamQuestion`) |
| Persistencia | Prisma `Topic` / `KnowledgeItem` / `ExamQuestion` (JSON: distractors, choices, allowedVariants) |
| API | `GET /api/v1/topics`, `/knowledge-items`, `/exam-questions` |
| Admin CRUD | `/api/v1/admin/...` + header `x-admin-token` (`ADMIN_TOKEN`) |
| UI admin | `/admin` (Resumen, Usuarios stub, Temas, Flash, Banco, Import stub) |
| Seed | `npm run db:seed` ← `content.seed.ts` |

Las mutaciones admin de contenido aún usan `x-admin-token`; siguiente paso: sustituir `AdminGuard` por JWT + role `ADMIN`.

## Alcance actual

- **APS-3–7:** monorepo, auth JWT, shell/tema, content CRUD sobre Postgres/Prisma
- **APS-8:** motor flash MCQ en Nest (`StudyModule`): `FLASH_STUDY`, miss-repeat, dominio 3, rachas; UI en `/estudiar`
- **APS-9/10:** `EXAM_STUDY` + `EXAM_TIMED` (Nest)
- **APS-13:** GuestProbe + usage analytics

API: NestJS en `apps/api` (`@nestjs/common`, `nest start`). Swagger: `http://127.0.0.1:43124/docs`.

**Fuera de alcance aún:** podio, Google OAuth, AdminGuard JWT.

## Scripts raíz

| Script | Qué hace |
| --- | --- |
| `npm run dev:web` | Next en `:43123` |
| `npm run dev:api` | Nest watch en `:43124` |
| `npm run db:up` | `docker compose up -d` (Postgres) |
| `npm run db:migrate` | Prisma migrate (auth + content) |
| `npm run db:seed` | Seed admin + content demo |
| `npm run build` | shared → api → web |
| `npm run test:api` | unit tests Nest |
