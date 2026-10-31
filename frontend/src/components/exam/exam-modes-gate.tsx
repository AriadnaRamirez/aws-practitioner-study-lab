"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { EXAM_TIMED_SIZES, FEATURE_FLAG_EXAM_MODES } from "@aps/shared";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/spinner";
import { useFeatureFlag } from "@/lib/use-feature-flag";

export function ExamModesGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const enabled = useFeatureFlag(FEATURE_FLAG_EXAM_MODES);

  useEffect(() => {
    if (enabled === false) router.replace("/estudiar");
  }, [enabled, router]);

  if (!enabled) {
    return (
      <PageContainer aria-busy="true">
        <PageHeader title="Examen" />
        <p className="sr-only" role="status">
          {enabled === false
            ? "El modo examen no está disponible. Te llevamos a Estudiar…"
            : "Preparando el modo examen…"}
        </p>
        <div className="mt-8 flex flex-col gap-6" aria-hidden>
          <div className="space-y-3">
            <Skeleton className="block h-4 w-16" />
            <div className="grid gap-2 sm:grid-cols-2">
              {EXAM_TIMED_SIZES.map((n) => (
                <Skeleton key={n} className="block h-12 w-full rounded-xl" />
              ))}
            </div>
          </div>
          <Skeleton className="block h-12 w-full rounded-full" />
        </div>
      </PageContainer>
    );
  }
  return <>{children}</>;
}
