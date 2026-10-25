import Link from "next/link";
import { APP_NAME } from "@aps/shared";

const NAV = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/guests", label: "Guests" },
  { href: "/admin/temas", label: "Temas" },
  { href: "/admin/flash", label: "Flash" },
  { href: "/admin/banco", label: "Banco" },
  { href: "/admin/import", label: "Import" },
] as const;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs font-medium tracking-wide text-zinc-500">
              Panel owner · uso + contenido
            </p>
            <Link href="/admin" className="text-lg font-semibold tracking-tight">
              {APP_NAME}
            </Link>
          </div>
          <Link
            href="/"
            className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
          >
            ← Volver al inicio
          </Link>
        </div>
        <nav
          className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-2 pb-2"
          aria-label="Admin"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
