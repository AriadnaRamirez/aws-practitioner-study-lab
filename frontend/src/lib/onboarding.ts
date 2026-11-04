/**
 * Client-only onboarding persistence (APS-15). Nest flag optional later.
 *
 * Stores the tour version the user finished. Bumping `ONBOARDING_VERSION`
 * shows the new tour once to everyone, including users who finished an older one.
 */

const ONBOARDING_VERSION = "2";
const ONBOARDING_SEEN_KEY = "aps_onboarding_version";
const ONBOARDING_FORCE_KEY = "aps_onboarding_force";
/** v1 flag ("1" = finished the old 4-card tour). */
const LEGACY_COMPLETED_KEY = "aps_onboarding_completed";

function isOnboardingCompleted(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(ONBOARDING_SEEN_KEY) === ONBOARDING_VERSION;
}

export function markOnboardingCompleted() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ONBOARDING_SEEN_KEY, ONBOARDING_VERSION);
  window.localStorage.removeItem(ONBOARDING_FORCE_KEY);
  window.localStorage.removeItem(LEGACY_COMPLETED_KEY);
}

/** Force tour once (e.g. right after register), even if previously dismissed. */
export function forceOnboardingOnce() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ONBOARDING_SEEN_KEY);
  window.localStorage.setItem(ONBOARDING_FORCE_KEY, "1");
}

export function shouldShowOnboarding(hasAuth: boolean): boolean {
  if (!hasAuth) return false;
  if (typeof window === "undefined") return false;
  if (window.localStorage.getItem(ONBOARDING_FORCE_KEY) === "1") return true;
  return !isOnboardingCompleted();
}
