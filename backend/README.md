# Backend — AWS Practitioner Study Lab

API **Nest.js** + Prisma + PostgreSQL. Expone `/api/v1` y Swagger en `/docs`.

## Run

Desde la raíz del monorepo:

```bash
npm run dev:backend
```

O desde esta carpeta:

```bash
cp .env.example .env   # si aún no existe
npm run start:dev
```

- Health: http://127.0.0.1:43124/api/v1/health  
- Swagger: http://127.0.0.1:43124/docs  

## Estructura

- `src/` — módulos Nest (`auth`, `content`, `study`, `guest`, `admin`, …)
- `prisma/` — schema + migrations + seed

## DB

```bash
npm run prisma:migrate
npm run prisma:seed
```

Paquete npm: `@aps/backend`. Contratos: `@aps/shared`.
