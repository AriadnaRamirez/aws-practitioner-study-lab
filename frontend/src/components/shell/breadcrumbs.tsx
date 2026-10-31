"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { FOCUS_RING } from "@/components/ui/focus";
import { guideById } from "@/lib/study-guides";
import { cn } from "@/lib/utils";

type Crumb = { href: string; label: string };

const STUDENT: Record<string, string> = {
  estudiar: "Estudiar",
  examen: "Examen",
  "mas-falladas": "Más falladas",
  guias: "Guías",
  cuenta: "Cuenta",
  minijuegos: "Minijuegos",
  "osi-vs-tcp-ip": "OSI vs TCP/IP",
};

const ADMIN: Record<string, string> = {
  usuarios: "Usuarios",
  podio: "Podio",
  guests: "Invitados",
  temas: "Temas",
  flash: "Cartas",
  banco: "Banco de examen",
  import: "Importar / exportar",
  flags: "Feature flags",
};

function labelFor(part: string, href: string): string {
  if (href.startsWith("/guias/") && href !== "/guias") {
    return guideById(part)?.title ?? "Guía";
  }
  return STUDENT[part] ?? "Página";
}

function studentCrumbs(pathname: string): Crumb[] {
  const home: Crumb = { href: "/dashboard", label: "Inicio" };
  if (pathname === "/dashboard") return [];

  if (/^\/cuenta\/historial\/[^/]+$/.test(pathname)) {
    return [
      home,
      { href: "/cuenta?tab=historial", label: "Historial" },
      { href: pathname, label: "Sesión" },
    ];
  }

  const crumbs: Crumb[] = [home];
  let href = "";
  for (const part of pathname.split("/").filter(Boolean)) {
    href += `/${part}`;
    if (part === "dashboard") continue;
    crumbs.push({ href, label: labelFor(part, href) });
  }
  return crumbs;
}

function adminCrumbs(pathname: string): Crumb[] {
  const section = pathname.split("/").filter(Boolean)[1];
  if (!section || !ADMIN[section]) return [];
  return [
    { href: "/admin", label: "Administración" },
    { href: pathname, label: ADMIN[section] },
  ];
}

export function Breadcrumbs({ scope }: { scope: "student" | "admin" }) {
  const pathname = usePathname();
  const crumbs = scope === "admin" ? adminCrumbs(pathname) : studentCrumbs(pathname);
  if (crumbs.length < 2) return null;

  return (
    <nav
      aria-label="Migas de pan"
      className={
        scope === "student"
          ? "print:hidden"
          : "mb-4 print:hidden"
      }
    >
      <ol
        className={
          scope === "student"
            ? "mx-auto flex w-full min-w-0 max-w-5xl flex-wrap items-center gap-x-1.5 gap-y-1 px-5 py-2.5 text-sm sm:px-6 lg:max-w-6xl lg:px-8"
            : "flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-sm"
        }
      >
        {crumbs.map((crumb, index) => {
          const current = index === crumbs.length - 1;
          return (
            <li key={`${crumb.href}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {index > 0 ? (
                <ChevronRight
                  className="size-3.5 shrink-0 text-[var(--foreground-muted)]"
                  aria-hidden
                />
              ) : null}
              {current ? (
                <span
                  className="truncate font-semibold text-[var(--foreground)]"
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className={cn(
                    "truncate rounded-sm text-[var(--foreground-muted)] underline-offset-4 hover:text-[var(--foreground)] hover:underline",
                    FOCUS_RING,
                  )}
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
