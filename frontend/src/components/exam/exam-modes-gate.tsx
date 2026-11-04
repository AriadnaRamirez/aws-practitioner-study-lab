"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { EXAM_TIMED_SIZES, FEATURE_FLAG_EXAM_MODES } from "@aps/shared";
import { buttonVariants } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/spinner";
import { useFeatureFlag } from "@/lib/use-feature-flag";

export function ExamModesGate({ children }: { children: ReactNode }) {
  const enabled = useFeatureFlag(FEATURE_FLAG_EXAM_MODES);

  if (enabled === false) {
    return (
      <PageContainer>
        <PageHeader title="Examen" />
        <Notice tone="info" boxed className="mt-6">
          El modo examen aún no está disponible. Mientras tanto, practica con las cartas: usan
          los mismos conceptos del examen.
        </Notice>
        <Link href="/estudiar" className={buttonVariants({ className: "mt-6" })}>
          Ir a Estudiar
        </Link>
      </PageContainer>
    );
  }

  if (!enabled) {
    return (
      <PageContainer aria-busy="true">
        <PageHeader title="Examen" />
        <p className="sr-only" role="status">
          Preparando el modo examen…
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
