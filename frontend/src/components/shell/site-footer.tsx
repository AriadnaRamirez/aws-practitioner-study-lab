import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)]/60">
      <div className="mx-auto flex w-full min-w-0 max-w-lg items-center justify-between gap-4 px-4 py-5 text-sm lowercase text-[var(--foreground-muted)] sm:px-6">
        <p className="truncate">study lab</p>
        <nav aria-label="pie" className="flex shrink-0 gap-4">
          <Link href="/login" className="hover:text-[var(--accent)]">
            entrar
          </Link>
          <Link href="/register" className="hover:text-[var(--accent)]">
            registro
          </Link>
        </nav>
      </div>
    </footer>
  );
}
