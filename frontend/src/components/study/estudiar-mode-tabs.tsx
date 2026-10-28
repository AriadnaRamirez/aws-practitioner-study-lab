"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { ExamStudyPanel } from "@/components/study/exam-study-panel";
import { FlashStudyClient } from "@/components/study/flash-study-client";
import { Skeleton, Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export type EstudiarMode = "flash" | "estudio";

const TAB_MODES = [
  { id: "flash" as const, label: "Cartas" },
  { id: "estudio" as const, label: "Estudio" },
];

function parseMode(raw: string | null): EstudiarMode | "examen" | null {
  if (raw === "flash" || raw === "estudio" || raw === "examen") return raw;
  return null;
}

function FlashBootFallback() {
  return (
    <div className="py-10" aria-busy="true">
      <Spinner label="Cargando" />
      <div className="mt-6 space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-14 w-full" />
      </div>
    </div>
  );
}

export function EstudiarModeTabs({ mode }: { mode: EstudiarMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function hrefFor(next: EstudiarMode) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "flash") {
      params.delete("mode");
    } else {
      params.set("mode", next);
    }
    // Session/start deep-links belong to Flash only
    if (next === "estudio") {
      params.delete("start");
      params.delete("session");
      params.delete("category");
    }
    const q = params.toString();
    return q ? `/estudiar?${q}` : "/estudiar";
  }

  return (
    <div
      className="mt-5 flex flex-wrap items-center gap-1"
      role="tablist"
      aria-label="Modo de estudio"
    >
      {TAB_MODES.map((tab, i) => {
        const active = mode === tab.id;
        return (
          <span key={tab.id} className="inline-flex items-center gap-1">
            {i > 0 ? (
              <span
                className="px-1 text-sm text-[var(--foreground-muted)]"
                aria-hidden
              >
                ·
              </span>
            ) : null}
            <button
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                if (!active) router.push(hrefFor(tab.id), { scroll: false });
              }}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                active
                  ? "bg-[var(--surface-hover)] text-[var(--foreground)]"
                  : "text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]",
              )}
            >
              {tab.label}
            </button>
          </span>
        );
      })}
      <span
        className="px-1 text-sm text-[var(--foreground-muted)]"
        aria-hidden
      >
        ·
      </span>
      <Link
        href="/estudiar/examen"
        role="tab"
        aria-selected={false}
        className="rounded-md px-3 py-2 text-sm font-semibold text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
      >
        Examen
      </Link>
    </div>
  );
}

function EstudiarHubInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parsed = parseMode(searchParams.get("mode"));

  useEffect(() => {
    if (parsed === "examen") {
      router.replace("/estudiar/examen");
    }
  }, [parsed, router]);

  const mode: EstudiarMode = parsed === "estudio" ? "estudio" : "flash";

  return (
    <div
      className={cn(
        "mx-auto w-full min-w-0 px-6 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12",
        mode === "flash" ? "max-w-xl lg:max-w-4xl" : "max-w-2xl lg:max-w-4xl",
      )}
    >
      <h1 className="font-display text-2xl font-semibold tracking-tight lg:text-3xl">
        Estudiar
      </h1>
      <EstudiarModeTabs mode={mode} />

      <section className="mt-6 min-w-0 lg:mt-8" aria-live="polite">
        {mode === "flash" ? (
          <Suspense fallback={<FlashBootFallback />}>
            <FlashStudyClient />
          </Suspense>
        ) : parsed === "examen" ? (
          <FlashBootFallback />
        ) : (
          // Panel brings its own inner padding; tighten negative margin so hub chrome aligns
          <div className="-mx-6 -mt-2 sm:-mx-6 lg:-mx-8">
            <ExamStudyPanel />
          </div>
        )}
      </section>
    </div>
  );
}

export function EstudiarHub() {
  return (
    <Suspense fallback={<FlashBootFallback />}>
      <EstudiarHubInner />
    </Suspense>
  );
}
