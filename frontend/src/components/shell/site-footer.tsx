import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)]">
      <div className="mx-auto flex w-full min-w-0 max-w-3xl items-center justify-between gap-4 px-4 py-5 text-sm text-[var(--foreground-muted)] sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2 truncate" aria-label="Study Lab">
          <Logo size={22} />
          <span>Study Lab</span>
        </Link>
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
