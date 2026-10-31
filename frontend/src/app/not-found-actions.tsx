"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { FOCUS_RING } from "@/components/ui/focus";
import { getStoredToken } from "@/lib/api";
import { cn } from "@/lib/utils";

const TEXT_LINK = cn(
  "rounded-sm text-sm font-medium text-[var(--foreground)] underline-offset-4 hover:underline",
  FOCUS_RING,
);

export function NotFoundActions() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setSignedIn(Boolean(getStoredToken()));
  }, []);

  if (signedIn) {
    return (
      <div className="relative z-10 mt-8 flex flex-col items-center gap-3">
        <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
          Ir a Inicio
        </Link>
        <Link href="/" className={TEXT_LINK}>
          Página principal
        </Link>
      </div>
    );
  }

  return (
    <div className="relative z-10 mt-8 flex flex-col items-center gap-3">
      <Link href="/" className={buttonVariants({ size: "lg" })}>
        Ir al inicio
      </Link>
      <Link href="/login" prefetch={false} className={TEXT_LINK}>
        Entrar
      </Link>
    </div>
  );
}
