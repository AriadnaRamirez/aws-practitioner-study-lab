"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStoredToken } from "@/lib/api";
import { loginHref } from "@/lib/route-labels";
import { ScreenLoader } from "@/components/ui/screen-loader";

type Props = {
  children: React.ReactNode;
};

/**
 * Avoids empty “solo Entrar” pages: anonymous visitors go straight to
 * /login?next=<ruta+query> so they come back to exactly what they opened.
 */
export function RequireAuth({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    if (getStoredToken()) {
      setOk(true);
      return;
    }
    setOk(false);
    router.replace(loginHref(`${window.location.pathname}${window.location.search}`));
  }, [pathname, router]);

  if (ok === null) {
    return <ScreenLoader pose="security" message="Comprobando tu sesión…" />;
  }
  if (!ok) {
    return <ScreenLoader pose="wave" message="Te llevamos a iniciar sesión…" />;
  }

  return <>{children}</>;
}
