/** Student-facing names for in-app paths (login hint, redirects). */
const ROUTE_LABELS: Array<[prefix: string, label: string]> = [
  ["/dashboard", "Inicio"],
  ["/examen", "Examen"],
  ["/estudiar", "Estudiar"],
  ["/guias", "Guías"],
  ["/minijuegos", "Minijuegos"],
  ["/cuenta/historial", "tu historial"],
  ["/cuenta", "Cuenta"],
  ["/progreso", "tu progreso"],
  ["/admin", "Administración"],
];

/** Same-origin relative path only: blocks `//host`, `/\host` and the login loop. */
export function isSafeNextPath(raw: string | null | undefined): raw is string {
  return (
    !!raw &&
    raw.startsWith("/") &&
    !raw.startsWith("//") &&
    !raw.startsWith("/\\") &&
    !raw.startsWith("/login")
  );
}

export function routeLabel(path: string): string | null {
  const pathname = path.split(/[?#]/)[0] ?? path;
  const hit = ROUTE_LABELS.find(
    ([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  return hit ? hit[1] : null;
}

export function loginHref(next?: string | null): string {
  return isSafeNextPath(next) ? `/login?next=${encodeURIComponent(next)}` : "/login";
}
