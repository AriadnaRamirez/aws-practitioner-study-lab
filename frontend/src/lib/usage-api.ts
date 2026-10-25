import type { AdminGuestRow, AdminUserRow, UsageSummary } from "@aps/shared";

/** Browser: same-origin proxy. Server components: hit Nest directly. */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window === "undefined"
    ? "http://127.0.0.1:43124/api/v1"
    : "/api/v1");

const ADMIN_TOKEN =
  process.env.NEXT_PUBLIC_ADMIN_TOKEN ??
  process.env.ADMIN_TOKEN ??
  "dev-admin-token";

async function adminFetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { "x-admin-token": ADMIN_TOKEN },
      next: { revalidate: 0 },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getUsageSummary(): Promise<{
  data: UsageSummary | null;
  source: "api" | "unavailable";
}> {
  const data = await adminFetchJson<UsageSummary>("/admin/usage");
  if (data) return { data, source: "api" };
  return { data: null, source: "unavailable" };
}

export async function getAdminUsers(): Promise<{
  data: AdminUserRow[];
  source: "api" | "unavailable";
}> {
  const data = await adminFetchJson<AdminUserRow[]>("/admin/users");
  if (data) return { data, source: "api" };
  return { data: [], source: "unavailable" };
}

export async function getAdminGuests(): Promise<{
  data: AdminGuestRow[];
  source: "api" | "unavailable";
}> {
  const data = await adminFetchJson<AdminGuestRow[]>("/admin/guests");
  if (data) return { data, source: "api" };
  return { data: [], source: "unavailable" };
}
