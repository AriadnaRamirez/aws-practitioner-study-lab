# Frontend — AWS Practitioner Study Lab

App **Next.js** (UI en español). Habla con el backend por `/api/v1` (proxy de Next, mismo origen); `NEXT_PUBLIC_API_URL` solo si quieres saltarte el proxy.

## Run

Desde la raíz del monorepo:

```bash
npm run dev:frontend
```

O desde esta carpeta:

```bash
npm run dev
```

- URL: http://127.0.0.1:43123  
- API esperada: http://127.0.0.1:43124/api/v1  

## Estructura

- `src/app` — rutas App Router
- `src/components` — UI
- `src/lib` — clientes HTTP (`api.ts`, `study-api.ts`, `content-api.ts`)

Paquete npm: `@aps/frontend`. Contratos: `@aps/shared`.
