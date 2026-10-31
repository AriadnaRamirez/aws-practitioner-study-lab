"use client";

import { ChartColumn, Compass, History, UserRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { PublicUser, StudyHistoryEntry } from "@aps/shared";
import { ProgressPanel } from "./progress-client";
import { HISTORY_LIST, SessionHistory } from "./session-history";
import { openOnboardingTour } from "@/components/onboarding/onboarding-host";
import { BentoGrid } from "@/components/ui/bento";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { segmentedItem, segmentedList } from "@/components/ui/segmented";
import { Skeleton } from "@/components/ui/spinner";
import { fetchMe, fetchStudySessions, getStoredUser, setStoredUser } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ExamCard } from "./exam-card";
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

/**
 * Mi cuenta, lg and up (12 tracks): the forms with two-column fields take 7, the compact cards 5.
 * ┌──────────────┬──────────┐
 * │ perfil       │ examen   │
 * ├──────────────┼──────────┤
 * │ seguridad    │ sesión   │
 * └──────────────┴──────────┘
 * Each tile stretches its card to the row height. Below lg the cards stack in this order.
 */
const ACCOUNT_GRID = "gap-5 lg:grid-cols-12";
const ACCOUNT_TILE = {
  wide: "flex min-w-0 flex-col *:flex-1 lg:col-span-7",
  narrow: "flex min-w-0 flex-col *:flex-1 lg:col-span-5",
} as const;

export function CuentaClient({ initialTab }: { initialTab: CuentaTab }) {
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
    <PageContainer width="wide" className="[@media(max-height:500px)]:md:py-6">
      <PageHeader
        title="Cuenta"
        actions={
          <>
            <div
              role="tablist"
              aria-label="Secciones de la cuenta"
              className={segmentedList}
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
                    className={segmentedItem(active)}
                  >
                    <Icon className="size-4" aria-hidden />
                    {label}
                  </button>
                );
              })}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => openOnboardingTour()}
            >
              <Compass className="size-4" aria-hidden />
              Ver recorrido guiado
            </Button>
          </>
        }
      />

      {error ? (
        <Notice tone="danger" className="mt-4">
          {error}
        </Notice>
      ) : null}

      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className="mt-8"
      >
        {tab === "historial" ? (
          <HistoryPanel timezone={user?.timezone} />
        ) : tab === "progreso" ? (
          <ProgressPanel />
        ) : user ? (
          <BentoGrid className={ACCOUNT_GRID}>
            <div className={ACCOUNT_TILE.wide}>
              <ProfileCard user={user} onUserChange={onUserChange} />
            </div>
            <div className={ACCOUNT_TILE.narrow}>
              <ExamCard user={user} onUserChange={onUserChange} />
            </div>
            <div className={ACCOUNT_TILE.wide}>
              <SecurityCard />
            </div>
            <div className={ACCOUNT_TILE.narrow}>
              <SessionCard user={user} />
            </div>
          </BentoGrid>
        ) : (
          <BentoGrid className={ACCOUNT_GRID} aria-busy="true">
            <p className="sr-only" role="status">
              Cargando tu cuenta…
            </p>
            <Skeleton className={cn(ACCOUNT_TILE.wide, "block h-80 rounded-2xl bg-[var(--surface)]")} />
            <Skeleton className={cn(ACCOUNT_TILE.narrow, "block h-80 rounded-2xl bg-[var(--surface)]")} />
            <Skeleton className={cn(ACCOUNT_TILE.wide, "block h-72 rounded-2xl bg-[var(--surface)]")} />
            <Skeleton className={cn(ACCOUNT_TILE.narrow, "block h-72 rounded-2xl bg-[var(--surface)]")} />
          </BentoGrid>
        )}
      </div>
    </PageContainer>
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
    <section aria-label="Historial de partidas">
      <p className="text-sm text-[var(--foreground-muted)]">
        {sessions && sessions.length > 0
          ? `Tus últimas ${sessions.length === 1 ? "partida" : `${sessions.length} partidas`}. Toca una para ver cada respuesta.`
          : "Tus partidas aparecerán aquí."}
      </p>
      {error ? (
        <Notice tone="danger" className="mt-3">
          {error}
        </Notice>
      ) : null}
      <div className="mt-4">
        {sessions === null ? (
          <div className={HISTORY_LIST} aria-busy="true">
            <p className="sr-only" role="status">
              Cargando tu historial…
            </p>
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="block h-16 rounded-2xl bg-[var(--surface-elevated)]" />
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
