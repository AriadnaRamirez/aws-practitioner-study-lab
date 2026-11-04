"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { MasFalladasPanel } from "@/components/mas-falladas/mas-falladas-client";
import { FlashStudyClient } from "@/components/study/flash-study-client";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { BuilderSkeleton } from "@/components/study/study-skeletons";
import { ScreenLoader } from "@/components/ui/screen-loader";
import { segmentedItem, segmentedList } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";

type EstudiarMode = "flash" | "repaso";

const TABS = [
  { id: "flash" as const, label: "Cartas" },
  { id: "repaso" as const, label: "Más falladas" },
];

function parseMode(raw: string | null): EstudiarMode | null {
  if (raw === "flash" || raw === "repaso") return raw;
  return null;
}

function EstudiarModeTabs({ mode }: { mode: EstudiarMode }) {
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
    if (next !== "flash") {
      params.delete("start");
      params.delete("session");
      params.delete("category");
      params.delete("quick");
    }
    const q = params.toString();
    return q ? `/estudiar?${q}` : "/estudiar";
  }

  return (
    <div
      className={cn(segmentedList, "mt-5")}
      role="tablist"
      aria-label="Modo de estudio"
    >
      {TABS.map((tab) => {
        const active = mode === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => {
              if (!active) router.push(hrefFor(tab.id), { scroll: false });
            }}
            className={segmentedItem(active)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function EstudiarHubInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("mode");
  const parsed = parseMode(raw);
  /** Old deep links: the exam moved out, and Estudio no longer exists. */
  const stale = raw !== null && parsed === null;

  useEffect(() => {
    if (!stale) return;
    if (raw === "examen") {
      router.replace("/examen");
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete("mode");
    const q = params.toString();
    router.replace(q ? `/estudiar?${q}` : "/estudiar");
  }, [stale, raw, router, searchParams]);

  const mode: EstudiarMode = parsed === "repaso" ? "repaso" : "flash";

  return (
    <PageContainer
      width="wide"
      className={cn(
        "[@media(max-height:500px)]:md:py-4",
        "[&:has([data-session-builder])>header]:hidden [&:has([data-session-builder])>[role=tablist]]:mt-0 [&:has([data-session-builder]):not(:has([role=tablist]))>section]:mt-0",
        "[&:has([data-session-summary])>header]:hidden [&:has([data-session-summary])>section]:mt-0",
        "[&:has([data-weak-round])>header]:hidden [&:has([data-weak-round])>[role=tablist]]:hidden [&:has([data-weak-round])>section]:mt-0",
        "[@media(max-height:500px)]:[&:has([data-study-card])>header]:hidden [@media(max-height:500px)]:[&:has([data-study-card])>[role=tablist]]:hidden [@media(max-height:500px)]:[&:has([data-study-card])>section]:mt-0",
      )}
    >
      <PageHeader title="Estudiar" />
      <EstudiarModeTabs mode={mode} />

      <section className="mt-8 min-w-0">
        {raw === "examen" ? (
          <ScreenLoader message="Abriendo el examen…" className="py-10" />
        ) : mode === "repaso" ? (
          <MasFalladasPanel />
        ) : (
          <Suspense fallback={<BuilderSkeleton />}>
            <FlashStudyClient />
          </Suspense>
        )}
      </section>
    </PageContainer>
  );
}

export function EstudiarHub() {
  return (
    <Suspense
      fallback={
        <PageContainer width="wide">
          <section className="min-w-0">
            <BuilderSkeleton />
          </section>
        </PageContainer>
      }
    >
      <EstudiarHubInner />
    </Suspense>
  );
}
