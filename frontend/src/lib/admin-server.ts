import { cookies } from "next/headers";
import type { PublicUser } from "@aps/shared";
import { AUTH_COOKIE } from "@/lib/api";

/**
 * Server-only admin access. Forwards the visitor's own session cookie as a
 * Bearer token; the API decides (AdminGuard: 401 / 403). Never use a shared
 * admin secret here: anything fetched ends up in the rendered HTML.
 */

function serverApiUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (configured && /^https?:\/\//.test(configured)) return configured;
  const target = process.env.APS_API_PROXY_TARGET ?? "http://127.0.0.1:43124";
  return `${target.replace(/\/$/, "")}/api/v1`;
}

async function sessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value || null;
}

export type AdminSession =
  | { status: "admin"; user: PublicUser }
  | { status: "anonymous" }
  | { status: "forbidden" }
  | { status: "unavailable" };

export async function getAdminSession(): Promise<AdminSession> {
  const token = await sessionToken();
  if (!token) return { status: "anonymous" };
  try {
    const res = await fetch(`${serverApiUrl()}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.status === 401) return { status: "anonymous" };
    if (!res.ok) return { status: "unavailable" };
    const user = (await res.json()) as PublicUser;
    return user.role === "ADMIN"
      ? { status: "admin", user }
      : { status: "forbidden" };
  } catch {
    return { status: "unavailable" };
  }
}

/** GET an admin endpoint as the current visitor; `null` on any failure. */
export async function adminServerGet<T>(path: string): Promise<T | null> {
  const token = await sessionToken();
  if (!token) return null;
  try {
    const res = await fetch(`${serverApiUrl()}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
