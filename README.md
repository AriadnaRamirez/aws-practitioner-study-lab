# AWS Study Lab

Laboratorio para preparar la certificación **AWS Cloud Practitioner**. Quien estudia practica con cartas, repasa lo que se le dificulta y se mide con un examen contra reloj.

**En vivo:** [aws-practitioner-study-lab.vercel.app](https://aws-practitioner-study-lab.vercel.app)

Hay 356 cartas y 208 preguntas originales, escritas como casos del examen. Una carta se domina con tres aciertos seguidos. Lo que fallas vuelve a salir. El examen sigue el formato real: hasta 65 preguntas y 90 minutos. También hay guías para leer o bajar en PDF, un crucigrama para recordar los nombres de los servicios y un podio. Quien llega sin cuenta puede probar unas cartas. Quien se registra guarda su avance.

El navegador solo habla con Next.js. Next reenvía `/api/v1` a Nest. Los tipos compartidos viven en `packages/shared`.

Material de estudio. No oficial y no afiliado a AWS ni a Generation México.

## Qué hay en la web

| Ruta | Qué es |
| --- | --- |
| `/estudiar` | Cartas y las que más se dificultan |
| `/examen` | Examen contra reloj. Se enciende desde Administración |
| `/guias` | Guías para leer o descargar en PDF |
| `/minijuegos` | Crucigramas |
| `/cuenta` | Perfil, progreso, historial y fecha de examen |
| `/admin` | Contenido, usuarios, podio y banderas |

## Stack

TypeScript, Next.js (App Router), NestJS, Prisma, PostgreSQL y Tailwind.

| Pieza | Dónde |
| --- | --- |
| Web | [Vercel](https://aws-practitioner-study-lab.vercel.app) |
| API | [Render](https://aps-api-8tap.onrender.com) |
| Base | Neon, región Virginia (`us-east-1`) |

El plan gratuito de Render duerme la API tras 15 minutos sin visitas. El workflow [`.github/workflows/keep-api-warm.yml`](./.github/workflows/keep-api-warm.yml) la despierta cada 14 minutos. La variable del repo `API_HEALTH_URL` apunta a `https://aps-api-8tap.onrender.com/api/v1/health`.

## Correrlo en local

Hace falta Node 20+, npm 10 y Docker.

```bash
git clone https://github.com/AriadnaRamirez/aws-practitioner-study-lab.git
cd aws-practitioner-study-lab
npm run setup:local
npm run local
```

- Web: http://127.0.0.1:43123
- API: http://127.0.0.1:43124/api/v1/health
- Swagger: http://127.0.0.1:43124/docs

El login acepta usuario o correo. La cuenta de admin sale de `ADMIN_EMAIL`, `ADMIN_USERNAME` y `ADMIN_PASSWORD` en `backend/.env`. Si `DEMO_PASSWORD` está vacío, el seed no crea cuentas de prueba.

| Carpeta | Rol | Puerto |
| --- | --- | --- |
| `frontend/` | Next.js | `43123` |
| `backend/` | NestJS, Prisma | `43124` |
| `packages/shared/` | Tipos compartidos | — |

## Producción

| Variable | Dónde | Valor |
| --- | --- | --- |
| `DATABASE_URL` | Render | Cadena directa de Neon, sin `-pooler`, con `sslmode=require` |
| `WEB_ORIGIN` | Render | `https://aws-practitioner-study-lab.vercel.app` |
| `APS_API_PROXY_TARGET` | Vercel | `https://aps-api-8tap.onrender.com` |
| `API_HEALTH_URL` | GitHub Actions | `https://aps-api-8tap.onrender.com/api/v1/health` |

Render aplica las migraciones al arrancar. El contenido (cartas y preguntas) se carga una vez, desde la laptop, con `npx prisma db seed` apuntando a Neon. Sin `DEMO_PASSWORD` no se crean estudiantes de prueba.
