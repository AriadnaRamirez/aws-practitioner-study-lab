import type { FeatureFlagDto } from "@aps/shared";
import { getApiUrl } from "@/lib/api";

const ADMIN_TOKEN_KEY = "aps_admin_token";

export function getAdminToken(): string {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? "dev-admin-token";
  }
  return (
    window.localStorage.getItem(ADMIN_TOKEN_KEY) ??
    process.env.NEXT_PUBLIC_ADMIN_TOKEN ??
    "dev-admin-token"
  );
}

export function setAdminToken(token: string) {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export async function fetchFeatureFlags(): Promise<FeatureFlagDto[]> {
  const res = await fetch(`${getApiUrl()}/feature-flags`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`No se pudieron cargar flags (${res.status})`);
  }
  return (await res.json()) as FeatureFlagDto[];
}

export async function updateFeatureFlag(
  key: string,
  enabled: boolean,
  updatedBy?: string,
): Promise<FeatureFlagDto> {
  const res = await fetch(`${getApiUrl()}/admin/feature-flags/${key}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": getAdminToken(),
    },
    body: JSON.stringify({ enabled, updatedBy }),
  });
  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = (await res.json()) as { message?: string | string[] };
      if (Array.isArray(body.message)) message = body.message.join(". ");
      else if (typeof body.message === "string") message = body.message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return (await res.json()) as FeatureFlagDto;
}
