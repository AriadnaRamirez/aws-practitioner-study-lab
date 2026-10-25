import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)]">
      <div className="mx-auto flex w-full min-w-0 max-w-3xl items-center justify-between gap-4 px-4 py-5 text-sm text-[var(--foreground-muted)] sm:px-6">
        <p className="truncate">Study Lab</p>
        <nav aria-label="Pie" className="flex shrink-0 gap-4">
          <Link href="/login" className="hover:text-[var(--accent)]">
            Entrar
          </Link>
          <Link href="/register" className="hover:text-[var(--accent)]">
            Registro
          </Link>
        </nav>
      </div>
    </footer>
  );
}
