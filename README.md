# AWS Practitioner Study Lab

Se corre en **tu laptop** (`localhost`) con los scripts de abajo, o en producción con el plan gratuito de Vercel + Render + Neon (ver [Deploy](#deploy)).

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

El seed crea una cuenta admin y cuentas de estudiante de prueba; sus contraseñas salen de `ADMIN_PASSWORD` y `DEMO_PASSWORD` en `backend/.env`. El login acepta **username o email** en el mismo campo. Si el login falla, corre `npm run db:seed`.

Alternativa en dos terminales: `npm run dev:backend` y `npm run dev:frontend`.

Producto: Project Context → `docs/documento-maestro.md`  
Tickets: Project Context → `docs/sistema-tickets.md`

## Setup manual (si no usas setup:local)

```bash
npm install
cp backend/.env.example backend/.env
docker compose up -d
npm run db:migrate:deploy
npm run db:seed
npm run build -w @aps/shared
```

## Deploy

| Pieza | Plataforma | Configuración |
| --- | --- | --- |
| PostgreSQL | [Neon](https://neon.tech) (región AWS us-east-1) | connection string directa (sin `-pooler`) |
| API Nest | [Render](https://render.com) (Blueprint) | [`render.yaml`](./render.yaml): aplica migraciones al arrancar |
| Web Next | [Vercel](https://vercel.com), Root Directory `frontend` | [`frontend/vercel.json`](./frontend/vercel.json) |

Variables:

- Render: `DATABASE_URL` (Neon), `WEB_ORIGIN` y `WEB_PUBLIC_URL` (URL de Vercel). `JWT_SECRET` se genera solo.
- Vercel: `APS_API_PROXY_TARGET` = URL de Render (sin `/api/v1`). El navegador sigue usando `/api/v1` y Next lo reenvía.
- GitHub → Settings → Variables: `API_HEALTH_URL` = `https://<api>.onrender.com/api/v1/health` activa [`keep-api-warm`](./.github/workflows/keep-api-warm.yml) para que la API gratuita no se duerma.

Seed de producción (una vez, desde tu laptop; sin `DEMO_PASSWORD` no crea cuentas demo):

```bash
cd backend
DATABASE_URL="<neon>" ADMIN_EMAIL="<tu-email>" ADMIN_PASSWORD="<segura>" DEMO_PASSWORD= npx prisma db seed
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
| Admin CRUD | `/api/v1/admin/...` + `Authorization: Bearer <JWT>` de un usuario `ADMIN` (`x-admin-token` solo si `ADMIN_TOKEN` está definido, para scripts) |
| UI admin | `/admin` en el frontend |
| Seed | `npm run db:seed` ← `backend/src/content/content.seed.ts` |

### Estudio (Nest `StudyModule`)

- `FLASH_STUDY` (APS-8), `EXAM_STUDY` (APS-9), `EXAM_TIMED` (APS-10), `WEAK_REVIEW` (APS-11)
- UI: `/estudiar`, `/estudiar/examen`, `/mas-falladas`, `/cuenta` (historial)

### Wave 2 (APS-11 / 12 / 14 / 16)

| Ticket | Qué | Dónde |
| --- | --- | --- |
| APS-11 | Más falladas + historial + `WEAK_REVIEW` | `/mas-falladas`, `/cuenta`, `GET /progress/weak-items` |
| APS-12 | Podio (ítems dominados, all/week) | `/podio`, `GET /podium` |
| APS-14 | Import / export CSV·JSON (dry-run) | `/admin/import`, `/api/v1/admin/import|export` |
| APS-16 | Feature flag `exam_track_ai` | `/admin/flags`, `/api/v1/feature-flags` |
| APS-18 | Integración Wave 2 | este README / rama `mvp-local` |

## Alcance actual

- Frontend Next + backend Nest separados
- Auth JWT, shell/tema, content Prisma, flash + modos examen, guest analytics
- Podio, más falladas, import/export, feature flags (Wave 2)

**Fuera de alcance aún:** Google OAuth.

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
