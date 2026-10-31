"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { FEATURE_FLAG_EXAM_MODES } from "@aps/shared";
import { ExamStudyPanel } from "@/components/exam/exam-study-panel";
import { FlashStudyClient } from "@/components/study/flash-study-client";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { BuilderSkeleton } from "@/components/study/study-skeletons";
import { ScreenLoader } from "@/components/ui/screen-loader";
import { segmentedItem, segmentedList } from "@/components/ui/segmented";
import { useFeatureFlag } from "@/lib/use-feature-flag";
import { cn } from "@/lib/utils";

type EstudiarMode = "flash" | "estudio";

const TAB_MODES = [
  { id: "flash" as const, label: "Cartas" },
  { id: "estudio" as const, label: "Estudio" },
];

function parseMode(raw: string | null): EstudiarMode | "examen" | null {
  if (raw === "flash" || raw === "estudio" || raw === "examen") return raw;
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
      className={cn(segmentedList, "mt-5")}
      role="tablist"
      aria-label="Modo de estudio"
    >
      {TAB_MODES.map((tab) => {
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
      <Link
        href="/estudiar/examen"
        role="tab"
        aria-selected={false}
        className={segmentedItem(false)}
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
  const examModes = useFeatureFlag(FEATURE_FLAG_EXAM_MODES);
  const wantsExam = parsed === "estudio" || parsed === "examen";
  const redirecting = parsed === "examen" || (wantsExam && examModes !== true);

  useEffect(() => {
    if (!wantsExam || examModes === null) return;
    if (!examModes) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("mode");
      const q = params.toString();
      router.replace(q ? `/estudiar?${q}` : "/estudiar");
    } else if (parsed === "examen") {
      router.replace("/estudiar/examen");
    }
  }, [wantsExam, examModes, parsed, router, searchParams]);

  const mode: EstudiarMode = parsed === "estudio" ? "estudio" : "flash";

  return (
    <PageContainer
      width={mode === "flash" ? "wide" : "default"}
      className={cn(
        "[@media(max-height:500px)]:md:py-4",
        "[&:has([data-session-summary])>header]:hidden [&:has([data-session-summary])>section]:mt-0",
        "[@media(max-height:500px)]:[&:has([data-study-card])>header]:hidden [@media(max-height:500px)]:[&:has([data-study-card])>[role=tablist]]:hidden [@media(max-height:500px)]:[&:has([data-study-card])>section]:mt-0",
      )}
    >
      <PageHeader title="Estudiar" />
      {examModes ? <EstudiarModeTabs mode={mode} /> : null}

      <section className="mt-8 min-w-0" aria-live="polite">
        {redirecting ? (
          parsed === "examen" ? (
            <ScreenLoader message="Abriendo el modo examen…" className="py-10" />
          ) : (
            <BuilderSkeleton message="Preparando tu modo de estudio…" />
          )
        ) : mode === "flash" ? (
          <Suspense fallback={<BuilderSkeleton />}>
            <FlashStudyClient />
          </Suspense>
        ) : (
          <ExamStudyPanel />
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
          <PageHeader title="Estudiar" />
          <section className="mt-8 min-w-0">
            <BuilderSkeleton />
          </section>
        </PageContainer>
      }
    >
      <EstudiarHubInner />
    </Suspense>
  );
}
