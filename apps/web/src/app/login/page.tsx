import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-16">
      <Link
        href="/"
        className="font-display text-sm font-semibold text-[var(--foreground)]"
      >
        AWS Practitioner Study Lab
      </Link>
      <h1 className="font-display mt-8 text-3xl font-bold tracking-tight">
        Entrar
      </h1>
      <p className="mt-2 text-sm text-[var(--foreground-muted)]">
        Stub de UI — el login real llega con auth (APS-4). Usa correo o
        username.
      </p>
      <form className="mt-8 flex flex-col gap-4" action="#" method="post">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Correo o username
          <Input
            name="identifier"
            type="text"
            autoComplete="username"
            placeholder="tu@email.com o username"
            disabled
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Contraseña
          <Input
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            disabled
          />
        </label>
        <button
          type="button"
          disabled
          className={cn(buttonVariants({ size: "lg" }), "w-full opacity-60")}
        >
          Entrar (próximamente)
        </button>
      </form>
      <p className="mt-6 text-sm text-[var(--foreground-muted)]">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Crear cuenta
        </Link>
      </p>
    </main>
  );
}
