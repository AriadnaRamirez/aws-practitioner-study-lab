"use client";

import { useEffect, useState } from "react";
import { fetchFeatureFlags } from "@/lib/flags-api";

/** `null` while loading; missing flags or load errors count as off. */
export function useFeatureFlag(key: string): boolean | null {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchFeatureFlags()
      .then((flags) => {
        if (!cancelled) {
          setEnabled(flags.some((f) => f.key === key && f.enabled));
        }
      })
      .catch(() => {
        if (!cancelled) setEnabled(false);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return enabled;
}
