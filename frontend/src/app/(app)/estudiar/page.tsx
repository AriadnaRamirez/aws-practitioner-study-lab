import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FlashStudyClient } from "@/components/study/flash-study-client";
import { Skeleton, Spinner } from "@/components/ui/spinner";

export const metadata: Metadata = {
  title: "Estudiar",
};

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

export default function EstudiarPage() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex items-baseline justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Estudiar
        </h1>
        <Link
          href="/estudiar/examen"
          className="text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Examen
        </Link>
      </div>

      <section className="mt-6 min-w-0">
        <Suspense fallback={<FlashBootFallback />}>
          <FlashStudyClient />
        </Suspense>
      </section>
    </div>
  );
}
