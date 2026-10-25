import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Crear cuenta",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-16">
      <Link
        href="/"
        className="font-display text-sm font-semibold text-[var(--foreground)]"
      >
        AWS Practitioner Study Lab
      </Link>
      <h1 className="font-display mt-8 text-3xl font-bold tracking-tight">
        Crear cuenta
      </h1>
      <p className="mt-2 text-sm text-[var(--foreground-muted)]">
        Stub de UI — registro con correo, username y contraseña llega con
        auth.
      </p>
      <form className="mt-8 flex flex-col gap-4" action="#" method="post">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Correo
          <Input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            disabled
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Username
          <Input
            name="username"
            type="text"
            autoComplete="username"
            placeholder="visible_en_podio"
            disabled
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Contraseña
          <Input
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            disabled
          />
        </label>
        <button
          type="button"
          disabled
          className={cn(buttonVariants({ size: "lg" }), "w-full opacity-60")}
        >
          Crear cuenta (próximamente)
        </button>
      </form>
      <p className="mt-6 text-sm text-[var(--foreground-muted)]">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </main>
  );
}
