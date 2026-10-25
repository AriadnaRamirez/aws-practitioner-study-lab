"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import {
  FEATURE_FLAG_EXAM_TRACK_AI,
  type FeatureFlagDto,
} from "@aps/shared";
import {
  fetchFeatureFlags,
  getAdminToken,
  setAdminToken,
  updateFeatureFlag,
} from "@/lib/flags-api";

const FLAG_COPY: Record<string, { title: string; description: string }> = {
  [FEATURE_FLAG_EXAM_TRACK_AI]: {
    title: "Track AWS + IA (AIF)",
    description:
      "Cuando está apagado, los listados públicos ocultan temas, flash y banco con trackId=AIF.",
  },
};

export function FlagsPanel() {
  const [flags, setFlags] = useState<FeatureFlagDto[]>([]);
  const [token, setToken] = useState("dev-admin-token");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();

  const reload = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const data = await fetchFeatureFlags();
        setFlags(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar");
      } finally {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    setToken(getAdminToken());
    reload();
  }, [reload]);

  function onTokenBlur() {
    setAdminToken(token.trim() || "dev-admin-token");
  }

  async function toggle(flag: FeatureFlagDto) {
    setError(null);
    setAdminToken(token.trim() || "dev-admin-token");
    try {
      const updated = await updateFeatureFlag(
        flag.key,
        !flag.enabled,
        "admin-ui",
      );
      setFlags((prev) =>
        prev.map((f) => (f.key === updated.key ? updated : f)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    }
  }

  if (loading && flags.length === 0) {
    return <p className="text-sm text-zinc-500">Cargando flags…</p>;
  }

  return (
    <div className="space-y-6">
      <label className="block max-w-md space-y-1 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          Token admin (`x-admin-token`)
        </span>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onBlur={onTokenBlur}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          autoComplete="off"
        />
        <span className="text-xs text-zinc-500">
          Default local: <code>dev-admin-token</code>
        </span>
      </label>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {flags.map((flag) => {
          const copy = FLAG_COPY[flag.key] ?? {
            title: flag.key,
            description: "Feature flag",
          };
          return (
            <li
              key={flag.key}
              className="flex flex-wrap items-center justify-between gap-4 bg-white px-4 py-4 dark:bg-zinc-900"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium">{copy.title}</p>
                <p className="mt-0.5 font-mono text-xs text-zinc-500">
                  {flag.key}
                </p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {copy.description}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Actualizado: {new Date(flag.updatedAt).toLocaleString()}
                  {flag.updatedBy ? ` · ${flag.updatedBy}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void toggle(flag)}
                disabled={pending}
                aria-pressed={flag.enabled}
                className={
                  flag.enabled
                    ? "rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
                    : "rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-60"
                }
              >
                {flag.enabled ? "ON" : "OFF"}
              </button>
            </li>
          );
        })}
      </ul>

      {flags.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No hay flags. Ejecuta <code>npm run db:migrate</code> y{" "}
          <code>npm run db:seed</code>.
        </p>
      ) : null}
    </div>
  );
}
