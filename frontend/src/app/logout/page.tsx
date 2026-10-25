"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearAuth } from "@/lib/api";

/** Client logout: clears JWT storage and returns to landing (CCST `?bye=1`). */
export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    clearAuth();
    router.replace("/?bye=1");
    router.refresh();
  }, [router]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6">
      <p className="text-sm text-[var(--foreground-muted)]">Cerrando sesión…</p>
    </main>
  );
}
