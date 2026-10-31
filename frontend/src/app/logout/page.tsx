"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ScreenLoader } from "@/components/ui/screen-loader";
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
    <main className="flex min-h-dvh items-center justify-center">
      <ScreenLoader pose="wave" message="Cerrando sesión… ¡hasta pronto!" />
    </main>
  );
}
