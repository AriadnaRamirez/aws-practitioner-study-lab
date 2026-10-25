"use client";

import { useCallback, useEffect, useState } from "react";
import { getStoredToken } from "@/lib/api";
import {
  markOnboardingCompleted,
  shouldShowOnboarding,
} from "@/lib/onboarding";
import { OnboardingTour } from "./onboarding-tour";

export type OpenOnboardingDetail = { stepIndex?: number };

declare global {
  interface WindowEventMap {
    "aps:open-onboarding": CustomEvent<OpenOnboardingDetail>;
  }
}

export function openOnboardingTour(detail?: OpenOnboardingDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<OpenOnboardingDetail>("aps:open-onboarding", {
      detail: detail ?? {},
    }),
  );
}

export function OnboardingHost() {
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hasAuth = Boolean(getStoredToken());
    if (shouldShowOnboarding(hasAuth)) {
      setOpen(true);
      setStepIndex(0);
    }
    setReady(true);

    function onOpen(e: CustomEvent<OpenOnboardingDetail>) {
      setStepIndex(e.detail?.stepIndex ?? 0);
      setOpen(true);
    }
    window.addEventListener("aps:open-onboarding", onOpen);
    return () => window.removeEventListener("aps:open-onboarding", onOpen);
  }, []);

  const finish = useCallback(() => {
    markOnboardingCompleted();
    setOpen(false);
  }, []);

  if (!ready) return null;

  return (
    <OnboardingTour
      open={open}
      stepIndex={stepIndex}
      onStepChange={setStepIndex}
      onClose={finish}
      onComplete={finish}
    />
  );
}
