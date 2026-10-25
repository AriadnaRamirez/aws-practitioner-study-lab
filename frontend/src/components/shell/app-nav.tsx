"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { PublicUser } from "@aps/shared";
import { Logo } from "@/components/brand/logo";
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

export function AppNav() {
  const pathname = usePathname();
  const menuId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
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

  useEffect(() => {
    if (!menuOpen) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    function onPointer(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      if (
        panelRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return;
      }
      setMenuOpen(false);
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

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
        ? "font-semibold text-[var(--foreground)]"
        : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
    );

  return (
    <header className="relative sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/95">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-[var(--foreground)] focus:px-3 focus:py-2 focus:text-sm focus:text-[var(--accent-foreground)]"
      >
        Saltar al contenido
      </a>
      <div className="relative mx-auto flex w-full min-w-0 max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <Link
            href={user ? "/dashboard" : "/"}
            className="inline-flex min-w-0 items-center"
            aria-label="Study Lab"
          >
            <Logo size={28} withWordmark />
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
          ref={buttonRef}
          type="button"
          className="inline-flex h-9 items-center rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-4 text-xs font-semibold text-[var(--foreground)] sm:hidden"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? "Cerrar" : "Menú"}
        </button>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            aria-label="Cerrar menú"
            className="fixed inset-0 z-40 bg-black/50 sm:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <nav
            ref={panelRef}
            id={menuId}
            aria-label="Móvil"
            className="absolute inset-x-0 top-full z-50 border-b border-[var(--border)] bg-[var(--background)] px-4 py-4 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.7)] sm:hidden"
          >
            <ul className="mx-auto flex w-full max-w-3xl flex-col gap-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      linkClass(isActive(item)),
                      "block rounded-xl px-3 py-3",
                      isActive(item) && "bg-[var(--surface-elevated)]",
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                {user ? (
                  <Link
                    href="/logout"
                    className={cn(linkClass(false), "block rounded-xl px-3 py-3")}
                    onClick={() => setMenuOpen(false)}
                  >
                    Salir
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className={cn(linkClass(false), "block rounded-xl px-3 py-3")}
                    onClick={() => setMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </>
      ) : null}
    </header>
  );
}
