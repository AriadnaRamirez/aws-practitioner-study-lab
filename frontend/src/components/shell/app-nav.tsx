"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { PublicUser } from "@aps/shared";
import {
  fetchProgressOverview,
  getStoredToken,
  getStoredUser,
} from "@/lib/api";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; match?: string[] };

const STUDENT_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Inicio", match: ["/dashboard"] },
  { href: "/estudiar", label: "Estudiar", match: ["/estudiar"] },
  { href: "/progreso", label: "Progreso" },
  { href: "/cuenta", label: "Cuenta", match: ["/cuenta"] },
];

const GUEST_ITEMS: NavItem[] = [
  { href: "/", label: "Inicio", match: ["/"] },
  { href: "/guest", label: "Probar" },
  { href: "/register", label: "Crear cuenta" },
];

function MarkStar({ className }: { className?: string }) {
  return (
    <svg
      className={cn("mark-star shrink-0", className)}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 1.5 14.2 9.8 22.5 12 14.2 14.2 12 22.5 9.8 14.2 1.5 12l8.3-2.2L12 1.5Z" />
    </svg>
  );
}

export function AppNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [masteryPct, setMasteryPct] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    const token = getStoredToken();
    setUser(token ? stored : null);
    setReady(true);
    if (!token) {
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

  const items: NavItem[] = !ready
    ? GUEST_ITEMS
    : user
      ? user.role === "ADMIN"
        ? [...STUDENT_ITEMS, { href: "/admin", label: "Admin", match: ["/admin"] }]
        : STUDENT_ITEMS
      : GUEST_ITEMS;

  function isActive(item: NavItem) {
    if (item.href === "/") return pathname === "/";
    const prefixes = item.match ?? [item.href];
    return prefixes.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );
  }

  const linkClass = (active: boolean) =>
    cn(
      "shrink-0 py-1 text-sm transition-colors",
      active
        ? "font-semibold text-[var(--accent)]"
        : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
    );

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur-xl">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-[var(--accent)] focus:px-3 focus:py-2 focus:text-sm focus:text-[var(--accent-foreground)]"
      >
        Saltar al contenido
      </a>
      <div className="mx-auto flex w-full min-w-0 max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <Link
            href={user ? "/dashboard" : "/"}
            className="font-display inline-flex min-w-0 items-center gap-2 truncate text-sm font-semibold tracking-tight"
          >
            <MarkStar />
            <span>Study Lab</span>
          </Link>
          {masteryPct != null ? (
            <span className="hidden font-mono text-xs tabular-nums text-[var(--foreground-muted)] sm:inline">
              {masteryPct}%
            </span>
          ) : null}
        </div>

        <nav
          aria-label="Principal"
          className="hidden items-center gap-4 sm:flex"
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
            <Link href="/logout" className={linkClass(false)}>
              Salir
            </Link>
          ) : (
            <Link href="/login" className={linkClass(false)}>
              Entrar
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="glass-pill h-9 px-4 text-xs sm:hidden"
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
          className="border-t border-[var(--border)] px-4 py-3 sm:hidden"
        >
          <ul className="flex flex-col gap-3">
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
                <Link href="/logout" className={cn(linkClass(false), "block")}>
                  Salir
                </Link>
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
