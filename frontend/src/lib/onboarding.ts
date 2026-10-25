/** Client-only onboarding persistence (APS-15). Nest flag optional later. */

export const ONBOARDING_COMPLETED_KEY = "aps_onboarding_completed";
export const ONBOARDING_FORCE_KEY = "aps_onboarding_force";

export function isOnboardingCompleted(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(ONBOARDING_COMPLETED_KEY) === "1";
}

export function markOnboardingCompleted() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ONBOARDING_COMPLETED_KEY, "1");
  window.localStorage.removeItem(ONBOARDING_FORCE_KEY);
}

export function clearOnboardingCompleted() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
}

/** Force tour once (e.g. right after register), even if previously dismissed. */
export function forceOnboardingOnce() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
  window.localStorage.setItem(ONBOARDING_FORCE_KEY, "1");
}

export function consumeOnboardingForce(): boolean {
  if (typeof window === "undefined") return false;
  const forced = window.localStorage.getItem(ONBOARDING_FORCE_KEY) === "1";
  if (forced) window.localStorage.removeItem(ONBOARDING_FORCE_KEY);
  return forced;
}

export function shouldShowOnboarding(hasAuth: boolean): boolean {
  if (!hasAuth) return false;
  if (typeof window === "undefined") return false;
  if (window.localStorage.getItem(ONBOARDING_FORCE_KEY) === "1") return true;
  return !isOnboardingCompleted();
}
