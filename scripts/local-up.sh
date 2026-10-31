#!/usr/bin/env bash
# Arranca el MVP en TU máquina (localhost). No es Cloud Agent ni deploy.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

need() { command -v "$1" >/dev/null 2>&1 || { echo "Falta: $1"; exit 1; }; }
need node
need npm

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [[ "$NODE_MAJOR" -lt 20 ]]; then
  echo "Se necesita Node >= 20 (tienes $(node -v))"
  exit 1
fi

echo "==> npm install"
npm install

if [[ ! -f backend/.env ]]; then
  cp backend/.env.example backend/.env
  echo "==> Creado backend/.env desde .env.example"
fi

if [[ ! -f frontend/.env.local ]]; then
  cat > frontend/.env.local <<'EOF'
NEXT_PUBLIC_API_URL=http://127.0.0.1:43124/api/v1
EOF
  echo "==> Creado frontend/.env.local"
fi

if command -v docker >/dev/null 2>&1; then
  echo "==> Postgres (docker compose)"
  docker compose up -d
  # wait for ready
  for i in $(seq 1 30); do
    if docker compose exec -T db pg_isready -U aps -d aps_lab >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done
else
  echo "==> Docker no encontrado: usa Postgres local con DATABASE_URL en backend/.env"
fi

echo "==> shared + migrate + seed"
npm run build -w @aps/shared
npm run db:migrate:deploy
npm run db:seed

echo ""
echo "Listo. En dos terminales (o npm run local):"
echo "  npm run dev:backend   → http://127.0.0.1:43124/docs"
echo "  npm run dev:frontend  → http://127.0.0.1:43123"
echo ""
echo "Admin seed: admin / ChangeMeAdmin1!"
