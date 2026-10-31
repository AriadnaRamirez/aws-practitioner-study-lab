"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getStoredToken } from "@/lib/api";
import {
  markOnboardingCompleted,
  shouldShowOnboarding,
} from "@/lib/onboarding";
import { OnboardingTour } from "./onboarding-tour";

const OPEN_EVENT = "aps:open-onboarding";

/** Where the tour may open by itself (never in the middle of a game). */
const AUTO_SHOW_PATHS = new Set(["/dashboard", "/estudiar"]);

export function openOnboardingTour() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function OnboardingHost() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (open || !AUTO_SHOW_PATHS.has(pathname)) return;
    if (new URLSearchParams(window.location.search).has("session")) return;
    if (shouldShowOnboarding(Boolean(getStoredToken()))) setOpen(true);
  }, [pathname, open]);

  const finish = useCallback(() => {
    markOnboardingCompleted();
    setOpen(false);
  }, []);

  return open ? <OnboardingTour onFinish={finish} /> : null;
}
