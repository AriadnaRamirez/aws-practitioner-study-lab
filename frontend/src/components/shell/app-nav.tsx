"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { PublicUser } from "@aps/shared";
import {
  clearAuth,
  fetchProgressOverview,
  getStoredToken,
  getStoredUser,
} from "@/lib/api";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; match?: string[] };

const BASE_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Inicio", match: ["/dashboard"] },
  { href: "/estudiar", label: "Estudiar", match: ["/estudiar"] },
  { href: "/mas-falladas", label: "Más falladas" },
  { href: "/progreso", label: "Progreso" },
  { href: "/podio", label: "Podio" },
  { href: "/cuenta", label: "Cuenta", match: ["/cuenta"] },
];

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [masteryPct, setMasteryPct] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    if (!getStoredToken()) {
      setMasteryPct(null);
      return;
    }
    void fetchProgressOverview()
      .then((ov) => setMasteryPct(ov.masteryPct))
      .catch(() => setMasteryPct(null));
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const items: NavItem[] =
    user?.role === "ADMIN"
      ? [...BASE_ITEMS, { href: "/admin", label: "Admin", match: ["/admin"] }]
      : BASE_ITEMS;

  function isActive(item: NavItem) {
    const prefixes = item.match ?? [item.href];
    return prefixes.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );
  }

  function logout() {
    clearAuth();
    setUser(null);
    setMasteryPct(null);
    router.push("/");
    router.refresh();
  }

  const linkClass = (active: boolean) =>
    cn(
      "shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors",
      active
        ? "bg-[var(--accent-soft)] text-[var(--accent)]"
        : "text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]",
    );

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur-md">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-[var(--accent)] focus:px-3 focus:py-2 focus:text-sm focus:text-[var(--accent-foreground)]"
      >
        Saltar al contenido
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={user ? "/dashboard" : "/"}
            className="font-display truncate text-sm font-semibold tracking-tight text-[var(--foreground)] transition-opacity hover:opacity-80"
          >
            AWS Practitioner Study Lab
          </Link>
          {masteryPct != null ? (
            <div
              className="hidden items-center gap-2 sm:flex"
              title="Dominio global"
            >
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--surface-hover)]">
                <div
                  className="h-full rounded-full bg-[var(--accent)] transition-[width]"
                  style={{ width: `${Math.min(100, masteryPct)}%` }}
                />
              </div>
              <span className="font-mono text-xs tabular-nums text-[var(--foreground-muted)]">
                {masteryPct}%
              </span>
            </div>
          ) : null}
        </div>

        <nav
          aria-label="Principal"
          className="hidden items-center gap-1 lg:flex"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClass(isActive(item))}
              aria-current={isActive(item) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <button
              type="button"
              onClick={logout}
              className={cn(linkClass(false), "ml-1")}
            >
              Salir
            </button>
          ) : (
            <Link href="/login" className={linkClass(false)}>
              Entrar
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="inline-flex items-center rounded-md border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground)] lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? "Cerrar" : "Menú"}
        </button>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Móvil"
          className="border-t border-[var(--border)] px-4 py-3 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(linkClass(isActive(item)), "block")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              {user ? (
                <button
                  type="button"
                  onClick={logout}
                  className={cn(linkClass(false), "w-full text-left")}
                >
                  Salir
                </button>
              ) : (
                <Link href="/login" className={cn(linkClass(false), "block")}>
                  Entrar
                </Link>
              )}
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
