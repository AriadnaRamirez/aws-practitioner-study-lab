"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStoredToken } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";

type Props = {
  children: React.ReactNode;
  /**
   * Where to send anonymous visitors.
   * - `login` → /login?next=current (default)
   * - `home` → marketing landing /
   */
  fallback?: "login" | "home";
};

/**
 * Avoids empty “solo Entrar” pages: if there’s no session, leave immediately.
 */
export function RequireAuth({ children, fallback = "login" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    if (getStoredToken()) {
      setOk(true);
      return;
    }
    setOk(false);
    if (fallback === "home") {
      router.replace("/");
      return;
    }
    const next = pathname && pathname !== "/login" ? pathname : "/dashboard";
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [fallback, pathname, router]);

  if (ok !== true) {
    return (
      <div
        className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-20 text-sm text-[var(--foreground-muted)]"
        aria-busy="true"
      >
        <Spinner label="Comprobando sesión" />
        <p>Redirigiendo…</p>
      </div>
    );
  }

  return <>{children}</>;
}
