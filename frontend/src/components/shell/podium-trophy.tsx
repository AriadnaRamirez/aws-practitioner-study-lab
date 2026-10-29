"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PodiumEntry, PodiumResponse } from "@aps/shared";
import { Mascot } from "@/components/brand/mascot";
import { tileLinkClass } from "@/components/study/dashboard/dashboard-tile";
import { fetchPodium } from "@/lib/api";
import { conceptos, ofPlayers, standingLine } from "@/lib/podium-standing";
import { cn } from "@/lib/utils";

const PANEL_ID = "podio-rapido";

const MEDALS = {
  1: { label: "oro", face: "#f2c95c", rim: "#c9962e", ink: "#6b4a10", strap: "#d2652f", strapShade: "#a84a1f" },
  2: { label: "plata", face: "#e4e8ee", rim: "#a7b0bc", ink: "#3d4654", strap: "#5a6f92", strapShade: "#3f5170" },
  3: { label: "bronce", face: "#e3a274", rim: "#b2734a", ink: "#5a3018", strap: "#8a5a3e", strapShade: "#6a432d" },
} as const;

/** Flat medal with its place number on the face. */
export function Medal({
  rank,
  className,
}: {
  rank: 1 | 2 | 3;
  className?: string;
}) {
  const medal = MEDALS[rank];
  return (
    <svg
      viewBox="0 0 32 40"
      className={cn(
        "h-10 w-8 drop-shadow-[0_6px_10px_rgba(0,0,0,0.4)]",
        className,
      )}
      role="img"
      aria-label={`Medalla de ${medal.label}`}
    >
      <path d="M18 0h7l-5 16h-7z" fill={medal.strapShade} />
      <path d="M7 0h7l5 16h-7z" fill={medal.strap} />
      <circle cx="16" cy="27" r="11.5" fill={medal.rim} />
      <circle cx="16" cy="27" r="9" fill={medal.face} />
      <text
        x="16"
        y="27.5"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="11"
        fontWeight="800"
        fill={medal.ink}
        fontFamily="inherit"
      >
        {rank}
      </text>
    </svg>
  );
}

/** Visual order on the podium: 2nd, 1st, 3rd (by list position; ranks may tie). */
const PODIUM_SLOTS = [
  { index: 1, height: "h-12" },
  { index: 0, height: "h-[4.5rem]" },
  { index: 2, height: "h-8" },
] as const;

const PODIUM_POSE = {
  1: { pose: "champion", className: "h-20 w-[5.5rem]" },
  2: { pose: "silver", className: "h-[4.5rem] w-[5.5rem]" },
  3: { pose: "bronze", className: "h-16 w-[5.5rem]" },
} as const;

function PodiumColumn({
  entry,
  place,
  height,
  isMe,
}: {
  entry: PodiumEntry | undefined;
  place: 1 | 2 | 3;
  height: string;
  isMe: boolean;
}) {
  return (
    <li className="flex min-w-0 flex-1 flex-col items-center justify-end">
      <span className="sr-only">Lugar {place}:</span>
      <Mascot
        pose={PODIUM_POSE[place].pose}
        size="sm"
        glow={false}
        className={cn(PODIUM_POSE[place].className, "max-w-full", !entry && "opacity-25")}
      />
      <span className="mt-2 flex w-full min-w-0 items-center justify-center gap-1">
        <span
          className={cn(
            "truncate text-[13px] font-semibold tracking-tight",
            entry ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)]",
          )}
          title={entry ? `@${entry.username}` : undefined}
        >
          {entry ? `@${entry.username}` : "Libre"}
        </span>
        {isMe ? (
          <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-1.5 text-[10px] font-bold leading-4 text-[var(--accent)]">
            Tú
          </span>
        ) : null}
      </span>
      <span className="mt-0.5 h-4 whitespace-nowrap text-[11px] tabular-nums text-[var(--foreground-muted)]">
        {entry ? conceptos(entry.score) : null}
      </span>
      <div
        className={cn(
          "mt-2 w-full rounded-t-xl",
          height,
          place === 1
            ? "bg-[color-mix(in_srgb,var(--accent)_28%,var(--surface))]"
            : "bg-[var(--surface)]",
        )}
        aria-hidden
      />
    </li>
  );
}

function medalPlace(rank: number | undefined, fallback: number): 1 | 2 | 3 {
  const place = rank && rank >= 1 && rank <= 3 ? rank : fallback;
  return Math.min(3, Math.max(1, place)) as 1 | 2 | 3;
}

const OPEN_EVENT = "aps:open-podium";

/** Opens the navbar podium panel from anywhere in the app. */
export function openPodiumPanel() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function PodiumTrophy() {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<PodiumResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setError(null);
    fetchPodium("all")
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "No se pudo cargar el podio",
          );
        }
      });

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointer(e: Event) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      cancelled = true;
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const top = data?.entries.slice(0, 3) ?? [];
  const me = data?.me;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-label="Podio"
        aria-expanded={open}
        aria-controls={PANEL_ID}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors",
          open
            ? "text-[var(--foreground)]"
            : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
        )}
      >
        <Trophy className="size-[18px]" aria-hidden />
      </button>

      {open ? (
        <div
          id={PANEL_ID}
          role="dialog"
          aria-label="Podio rápido"
          className="animate-fade-up fixed right-4 top-[4.25rem] z-[80] w-[min(21rem,calc(100vw-2rem))] rounded-2xl bg-[var(--surface-elevated)] p-5 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.85)] sm:absolute sm:right-0 sm:top-full sm:mt-3 sm:w-[21rem] sm:p-6"
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="text-xl font-extrabold tracking-tight text-[var(--foreground)]">
                Podio
              </p>
              <p className="mt-0.5 text-sm leading-snug text-[var(--foreground-muted)]">
                ¿Quién va ganando? Domina conceptos y sube de lugar.
              </p>
            </div>
          </div>

          {error ? (
            <p className="mt-5 text-sm text-[var(--foreground-muted)]" role="alert">
              El podio no está disponible por ahora.
            </p>
          ) : !data ? (
            <div className="mt-5 flex items-end gap-2" aria-busy="true">
              {PODIUM_SLOTS.map((slot) => (
                <div
                  key={slot.index}
                  className={cn("flex-1 animate-pulse rounded-t-xl bg-[var(--surface)]", slot.height)}
                />
              ))}
            </div>
          ) : data.entries.length === 0 ? (
            <p className="mt-5 text-sm text-[var(--foreground-muted)]">
              Aún nadie domina conceptos. ¡Sé la primera persona en el podio!
            </p>
          ) : (
            <ol className="mt-5 flex items-end gap-2" aria-label="Top 3">
              {PODIUM_SLOTS.map((slot) => {
                const entry = top[slot.index];
                return (
                  <PodiumColumn
                    key={slot.index}
                    entry={entry}
                    place={medalPlace(entry?.rank, slot.index + 1)}
                    height={slot.height}
                    isMe={!!entry && entry.userId === me?.userId}
                  />
                );
              })}
            </ol>
          )}

          {data && me ? (
            <div className="mt-4 rounded-xl bg-[var(--surface)] px-4 py-3.5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold text-[var(--foreground-muted)]">
                  Tu lugar
                </p>
                <p className="text-lg font-extrabold tabular-nums tracking-tight text-[var(--foreground)]">
                  {me.podiumHidden ? (
                    "Oculto"
                  ) : me.rank != null ? (
                    <>
                      #{me.rank}{" "}
                      <span className="text-xs font-semibold text-[var(--foreground-muted)]">
                        {ofPlayers(data.totalRanked)}
                      </span>
                    </>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
              <p className="mt-1 text-xs leading-snug text-[var(--foreground-muted)]">
                {me.score === 1 ? "1 concepto dominado" : `${me.score} conceptos dominados`}
                {" · "}
                {standingLine(data)}
              </p>
            </div>
          ) : null}

          {data && me ? (
            <div className="mt-4">
              {me.podiumHidden ? (
                <Link href="/cuenta" className={tileLinkClass}>
                  Ir a Cuenta
                  <ChevronRight className="size-4" aria-hidden />
                </Link>
              ) : (
                <Link href="/estudiar?quick=1&start=10" className={tileLinkClass}>
                  {me.rank === 1 ? "Jugar para mantenerte arriba" : "Jugar para subir"}
                  <ChevronRight className="size-4" aria-hidden />
                </Link>
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
