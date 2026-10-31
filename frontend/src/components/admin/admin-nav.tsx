"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  FileUp,
  Flag,
  FolderTree,
  Gauge,
  Layers,
  LogOut,
  type LucideIcon,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { FOCUS_RING } from "@/components/ui/focus";
import { segmentedItem, segmentedList } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; icon: LucideIcon };

const GROUPS: { label: string; items: Item[] }[] = [
  {
    label: "Métricas",
    items: [
      { href: "/admin", label: "Resumen", icon: Gauge },
      { href: "/admin/usuarios", label: "Usuarios", icon: Users },
      { href: "/admin/podio", label: "Podio", icon: Trophy },
      { href: "/admin/guests", label: "Invitados", icon: UserPlus },
    ],
  },
  {
    label: "Contenido",
    items: [
      { href: "/admin/temas", label: "Temas", icon: FolderTree },
      { href: "/admin/flash", label: "Cartas", icon: Layers },
      { href: "/admin/banco", label: "Banco de examen", icon: BookOpen },
      { href: "/admin/import", label: "Importar / exportar", icon: FileUp },
    ],
  },
  {
    label: "Sistema",
    items: [{ href: "/admin/flags", label: "Feature flags", icon: Flag }],
  },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

const LINK = cn(
  "flex items-center gap-2.5 rounded-full px-3 py-2 text-sm font-medium transition-colors",
  FOCUS_RING,
);

const LINK_IDLE =
  "text-[var(--foreground-muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]";

const GROUP_LABEL = "px-3 text-xs font-semibold text-[var(--foreground-muted)]";

/** Desktop: fixed sidebar. Mobile: compact top bar with a scrolling tab strip. */
export function AdminNav() {
  const pathname = usePathname();
  const items = GROUPS.flatMap((g) => g.items);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col overflow-y-auto bg-[var(--surface)] px-3 py-5 lg:flex">
        <Link
          href="/admin"
          className={cn("flex items-center gap-2 rounded-full px-3", FOCUS_RING)}
          aria-label="Panel de administración"
        >
          <Logo size={28} withWordmark />
        </Link>
        <p className={cn(GROUP_LABEL, "mt-1")}>Administración</p>

        <nav aria-label="Administración" className="mt-6 flex-1 space-y-6 overflow-y-auto">
          {GROUPS.map((group) => (
            <div key={group.label}>
              <p className={GROUP_LABEL}>{group.label}</p>
              <ul className="mt-1.5 space-y-0.5">
                {group.items.map(({ href, label, icon: Icon }) => {
                  const active = isActive(pathname, href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          LINK,
                          active
                            ? "bg-[var(--surface-elevated)] text-[var(--foreground)]"
                            : LINK_IDLE,
                        )}
                      >
                        <Icon
                          className={cn("size-4 shrink-0", active && "text-[var(--accent)]")}
                          aria-hidden
                        />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-4 space-y-0.5">
          <Link href="/dashboard" className={cn(LINK, LINK_IDLE)}>
            <ArrowLeft className="size-4" aria-hidden />
            Volver al Lab
          </Link>
          <Link href="/logout" className={cn(LINK, LINK_IDLE)}>
            <LogOut className="size-4" aria-hidden />
            Salir
          </Link>
        </div>
      </aside>

      <header className="sticky top-0 z-40 bg-[var(--nav-bg)] backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/admin"
            className={cn("flex items-center gap-2 rounded-full", FOCUS_RING)}
            aria-label="Panel de administración"
          >
            <Logo size={26} withWordmark />
            <Badge>Admin</Badge>
          </Link>
          <div className="flex items-center gap-1">
            <Link href="/dashboard" className={buttonVariants({ variant: "ghost", size: "xs" })}>
              Lab
            </Link>
            <Link
              href="/logout"
              aria-label="Salir"
              className={cn(buttonVariants({ variant: "ghost", size: "xs" }), "w-8 px-0")}
            >
              <LogOut className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
        <div className="px-3 pb-2">
          <nav aria-label="Administración" className={segmentedList}>
            {items.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={segmentedItem(active)}
                >
                  <Icon className={cn("size-3.5", active && "text-[var(--accent)]")} aria-hidden />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
}
