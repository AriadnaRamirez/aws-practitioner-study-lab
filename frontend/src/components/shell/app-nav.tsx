"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  { href: "/mas-falladas", label: "Más falladas" },
  { href: "/podio", label: "Podio" },
  { href: "/progreso", label: "Progreso" },
  { href: "/cuenta", label: "Cuenta", match: ["/cuenta"] },
];

const GUEST_ITEMS: NavItem[] = [
  { href: "/", label: "Inicio", match: ["/"] },
  { href: "/guest", label: "Probar" },
  { href: "/register", label: "Crear cuenta" },
];

const MENU_ID = "app-mobile-nav";

export function AppNav() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [masteryPct, setMasteryPct] = useState<number | null>(null);
  const [dailyStreak, setDailyStreak] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [panelTop, setPanelTop] = useState(56);

  useEffect(() => {
    const stored = getStoredUser();
    const token = getStoredToken();
    setUser(token ? stored : null);
    setReady(true);
    if (!token) {
      setMasteryPct(null);
      setDailyStreak(null);
      return;
    }
    void fetchProgressOverview()
      .then((ov) => {
        setMasteryPct(ov.masteryPct);
        setDailyStreak(ov.dailyStreak);
      })
      .catch(() => {
        setMasteryPct(null);
        setDailyStreak(null);
      });
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useLayoutEffect(() => {
    function measure() {
      const h = headerRef.current?.getBoundingClientRect().height;
      if (h && h > 0) setPanelTop(Math.round(h));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    // Delay outside-dismiss so the opening tap/click doesn't immediately close.
    let active = false;
    const arm = window.setTimeout(() => {
      active = true;
    }, 50);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    function onPointer(e: Event) {
      if (!active) return;
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
    document.addEventListener("pointerdown", onPointer);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(arm);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const items: NavItem[] = !ready
    ? GUEST_ITEMS
    : user
      ? user.role === "ADMIN"
        ? [
            ...STUDENT_ITEMS,
            { href: "/admin", label: "Admin", match: ["/admin"] },
          ]
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
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-sm"
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-[var(--foreground)] focus:px-3 focus:py-2 focus:text-sm focus:text-[var(--background)]"
      >
        Saltar al contenido
      </a>
      <div className="mx-auto flex w-full min-w-0 max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
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
              {dailyStreak != null ? (
                <>
                  {" · "}
                  <span aria-label={`Racha de ${dailyStreak} días`}>
                    Racha {dailyStreak}
                  </span>
                </>
              ) : null}
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
          aria-controls={MENU_ID}
          aria-haspopup="true"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? "Cerrar" : "Menú"}
        </button>
      </div>

      {menuOpen ? (
        <>
          {/* Fixed layers avoid being clipped by overflow-x-hidden ancestors */}
          <button
            type="button"
            aria-label="Cerrar menú"
            className="fixed inset-0 z-[60] bg-black/55 sm:hidden"
            style={{ top: panelTop }}
            onClick={() => setMenuOpen(false)}
          />
          <nav
            ref={panelRef}
            id={MENU_ID}
            aria-label="Móvil"
            className="fixed inset-x-0 z-[70] border-b border-[var(--border)] bg-[var(--background)] px-4 py-3 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.75)] sm:hidden"
            style={{ top: panelTop }}
          >
            <ul className="mx-auto flex w-full max-w-3xl flex-col">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      linkClass(isActive(item)),
                      "block rounded-xl px-3 py-3.5 text-base",
                      isActive(item) && "bg-[var(--surface-elevated)]",
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-1 border-t border-[var(--border)] pt-1">
                {user ? (
                  <Link
                    href="/logout"
                    className={cn(
                      linkClass(false),
                      "block rounded-xl px-3 py-3.5 text-base",
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    Salir
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className={cn(
                      linkClass(false),
                      "block rounded-xl px-3 py-3.5 text-base",
                    )}
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
