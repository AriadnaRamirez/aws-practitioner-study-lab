import Link from "next/link";
import { SiteCredits } from "@/components/shell/site-credits";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)]/40">
      <SiteCredits compact />
      <div className="border-t border-[var(--border)]/30">
        <div className="mx-auto flex w-full min-w-0 max-w-3xl items-center justify-between gap-4 px-4 py-3 text-xs text-[var(--foreground-muted)]/70 sm:px-6">
          <Link href="/" className="truncate hover:text-[var(--foreground-muted)]">
            Study Lab
          </Link>
          <nav aria-label="Pie" className="flex shrink-0 gap-4">
            <Link href="/login" className="hover:text-[var(--foreground-muted)]">
              Entrar
            </Link>
            <Link
              href="/register"
              className="hover:text-[var(--foreground-muted)]"
            >
              Crear cuenta
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
