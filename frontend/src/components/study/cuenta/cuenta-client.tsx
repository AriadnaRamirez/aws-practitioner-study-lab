"use client";

import { ChartColumn, History, UserRound } from "lucide-react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { PublicUser, StudyHistoryEntry } from "@aps/shared";
import { ProgressPanel } from "@/components/study/progress-client";
import { SessionHistory } from "@/components/study/session-history";
import { FOCUS_RING } from "@/components/study/exam-date-dialog";
import { fetchMe, fetchStudySessions, getStoredUser, setStoredUser } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ExamCard } from "./exam-card";
import { HowToCard } from "./how-to-card";
import { ProfileCard } from "./profile-card";
import { SecurityCard } from "./security-card";
import { SessionCard } from "./session-card";
import type { CuentaTab } from "./cuenta-tabs";
import { errorMessage } from "./cuenta-ui";

const TABS: { id: CuentaTab; label: string; icon: typeof UserRound }[] = [
  { id: "cuenta", label: "Mi cuenta", icon: UserRound },
  { id: "progreso", label: "Progreso", icon: ChartColumn },
  { id: "historial", label: "Historial", icon: History },
];

const WIDE_QUERY = "(min-width: 1024px)";

function subscribeWide(onChange: () => void) {
  const mql = window.matchMedia(WIDE_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/** Matches Tailwind `lg`: two columns, so cards can be rebalanced. */
function useWide(): boolean {
  return useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE_QUERY).matches,
    () => false,
  );
}

export function CuentaClient({ initialTab }: { initialTab: CuentaTab }) {
  const wide = useWide();
  const [tab, setTab] = useState<CuentaTab>(initialTab);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
    fetchMe().then(
      (me) => {
        setUser(me);
        setStoredUser(me);
      },
      (err) => setError(errorMessage(err, "No se pudo cargar la cuenta")),
    );
  }, []);

  const onUserChange = useCallback((me: PublicUser) => {
    setUser(me);
    setStoredUser(me);
  }, []);

  function selectTab(next: CuentaTab) {
    setTab(next);
    window.history.replaceState(
      null,
      "",
      next === "cuenta" ? "/cuenta" : `/cuenta?tab=${next}`,
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 md:max-w-3xl lg:max-w-6xl lg:px-8 lg:py-12 [@media(max-height:500px)]:md:py-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold tracking-tight lg:text-3xl">
          Cuenta
        </h1>
        <div
          role="tablist"
          aria-label="Secciones de la cuenta"
          className="inline-flex rounded-full bg-[var(--surface)] p-1"
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={active}
                aria-controls={`panel-${id}`}
                onClick={() => selectTab(id)}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors",
                  FOCUS_RING,
                  active
                    ? "bg-[color-mix(in_srgb,var(--accent)_24%,var(--surface-elevated))] text-[var(--foreground)]"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className="mt-6 lg:mt-8"
      >
        {tab === "historial" ? (
          <HistoryPanel timezone={user?.timezone} />
        ) : tab === "progreso" ? (
          <ProgressPanel />
        ) : user ? (
          <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-6">
            <div className="grid min-w-0 gap-5 lg:gap-6">
              <ProfileCard user={user} onUserChange={onUserChange} />
              <ExamCard user={user} onUserChange={onUserChange} />
              {wide ? <SessionCard user={user} /> : null}
            </div>
            <div className="grid min-w-0 gap-5 lg:gap-6">
              <HowToCard />
              <SecurityCard />
              {wide ? null : <SessionCard user={user} />}
            </div>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2" aria-busy="true">
            <div className="h-72 animate-pulse rounded-3xl bg-[var(--surface)]" />
            <div className="h-72 animate-pulse rounded-3xl bg-[var(--surface)]" />
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryPanel({ timezone }: { timezone?: string }) {
  const [sessions, setSessions] = useState<StudyHistoryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudySessions(50).then(
      (res) => setSessions(res.sessions),
      (err) => {
        setError(errorMessage(err, "No se pudo cargar el historial"));
        setSessions([]);
      },
    );
  }, []);

  return (
    <section aria-label="Historial de partidas" className="max-w-3xl">
      <p className="text-sm text-[var(--foreground-muted)]">
        {sessions && sessions.length > 0
          ? `Tus últimas ${sessions.length === 1 ? "partida" : `${sessions.length} partidas`}. Toca una para ver cada respuesta.`
          : "Tus partidas aparecerán aquí."}
      </p>
      {error ? (
        <p className="mt-3 text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-4">
        {sessions === null ? (
          <div className="space-y-2" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-[var(--surface-elevated)]" />
            ))}
          </div>
        ) : (
          <SessionHistory
            sessions={sessions}
            timezone={timezone}
            showMasFalladasLink={false}
            linkDetail
          />
        )}
      </div>
    </section>
  );
}
