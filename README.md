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

npm run db:migrate
npm run db:seed
npm run build -w @aps/shared
```

El seed crea **1 ADMIN** con `ADMIN_EMAIL` / `ADMIN_USERNAME` / `ADMIN_PASSWORD` (ver `.env.example`). No commits de secretos reales.

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

## Alcance actual (Wave 1 integrada)

- **APS-3:** monorepo, healthcheck, Swagger  
- **APS-4:** auth email/username + JWT + Prisma `User`  
- **APS-5:** shell UI, tema system, landing de marca  
- **APS-6:** content stubs in-memory + admin shell (tras merge)

**Fuera de alcance aún:** flashcards reales, modos de examen, podio, guest analytics, Prisma content, Google OAuth.

## Scripts raíz

| Script | Qué hace |
| --- | --- |
| `npm run dev:web` | Next en `:43123` |
| `npm run dev:api` | Nest watch en `:43124` |
| `npm run db:up` | `docker compose up -d` (Postgres) |
| `npm run db:migrate` | Prisma migrate |
| `npm run db:seed` | Seed admin |
| `npm run build` | shared → api → web |
| `npm run test:api` | unit tests Nest |
