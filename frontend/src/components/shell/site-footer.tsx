import Link from "next/link";

/** Classic site footer — reinforces “website”, not mobile-app chrome. */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold tracking-tight">
            AWS Practitioner Study Lab
          </p>
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Preparación CLF-C02
          </p>
        </div>
        <nav
          aria-label="Pie de página"
          className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--foreground-muted)]"
        >
          <Link href="/estudiar" className="hover:text-[var(--accent)]">
            Estudiar
          </Link>
          <Link href="/guest" className="hover:text-[var(--accent)]">
            Prueba
          </Link>
          <Link href="/login" className="hover:text-[var(--accent)]">
            Acceso
          </Link>
          <Link href="/register" className="hover:text-[var(--accent)]">
            Registro
          </Link>
        </nav>
      </div>
    </footer>
  );
}
