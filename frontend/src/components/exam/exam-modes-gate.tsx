"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { FEATURE_FLAG_EXAM_MODES } from "@aps/shared";
import { Spinner } from "@/components/ui/spinner";
import { useFeatureFlag } from "@/lib/use-feature-flag";

export function ExamModesGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const enabled = useFeatureFlag(FEATURE_FLAG_EXAM_MODES);

  useEffect(() => {
    if (enabled === false) router.replace("/estudiar");
  }, [enabled, router]);

  if (!enabled) {
    return (
      <div className="py-20" aria-busy="true">
        <Spinner label="Cargando" />
      </div>
    );
  }
  return <>{children}</>;
}
