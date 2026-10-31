"use client";

import { KeyRound } from "lucide-react";
import { type FormEvent, useState } from "react";
import { PASSWORD_MIN } from "@aps/shared";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { changePassword } from "@/lib/api";
import { FIELD_LABEL, errorMessage } from "./cuenta-ui";

export function SecurityCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const mismatch = confirmPassword.length > 0 && confirmPassword !== password;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (mismatch) return;
    setPending(true);
    setError(null);
    setNotice(null);
    try {
      const res = await changePassword({ currentPassword, password, confirmPassword });
      setNotice(`${res.message}. La próxima vez entra con la nueva.`);
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(errorMessage(err, "No se pudo cambiar la contraseña"));
    } finally {
      setPending(false);
    }
  }

  return (
    <Card as="section" aria-labelledby="seguridad-titulo">
      <CardLabel as="h2" id="seguridad-titulo" icon={<KeyRound aria-hidden />}>
        Cambiar contraseña
      </CardLabel>
      <p className="mt-1 text-xs text-[var(--foreground-muted)]">
        Mínimo {PASSWORD_MIN} caracteres, con mayúscula, minúscula y número.
      </p>
      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <label className={FIELD_LABEL}>
          Contraseña actual
          <Input
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={FIELD_LABEL}>
            Nueva contraseña
            <Input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={PASSWORD_MIN}
            />
          </label>
          <label className={FIELD_LABEL}>
            Confirmar nueva
            <Input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={PASSWORD_MIN}
              aria-invalid={mismatch || undefined}
            />
          </label>
        </div>
        {mismatch ? (
          <Notice tone="danger" className="text-xs">
            Las contraseñas no coinciden.
          </Notice>
        ) : null}
        {error ? <Notice tone="danger">{error}</Notice> : null}
        {notice ? <Notice tone="success">{notice}</Notice> : null}
        <Button type="submit" variant="secondary" disabled={mismatch} pending={pending}>
          {pending ? "Actualizando…" : "Cambiar contraseña"}
        </Button>
      </form>
    </Card>
  );
}
