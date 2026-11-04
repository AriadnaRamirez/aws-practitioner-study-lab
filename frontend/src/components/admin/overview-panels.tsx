import Link from "next/link";
import {
  STUDY_MODE_LABELS,
  getExamCatalogEntry,
  isExamCode,
  type AdminMetrics,
  type StudyMode,
} from "@aps/shared";
import { ShareBar } from "@/components/admin/admin-charts";
import { ADMIN_TABLE, AdminSection } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Stat } from "@/components/ui/stat";
import { MINIGAMES } from "@/lib/minigames";
import { cn } from "@/lib/utils";

const NUMBER = new Intl.NumberFormat("es-MX");

function pct(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

const EMPTY = "text-sm text-[var(--foreground-muted)]";

/** Exam modes only exist behind the `exam_modes` flag. */
const EXAM_MODES = new Set<StudyMode>(["EXAM_STUDY", "EXAM_TIMED"]);

/** Same order as the study menu: what everyone has first, gated modes last. */
const MODE_ORDER: StudyMode[] = ["FLASH_STUDY", "WEAK_REVIEW", "EXAM_STUDY", "EXAM_TIMED"];

const TRACK_EXAM: Record<string, string> = { CLF: "CLF-C02", AIF: "AIF-C01" };

function examName(code: string): string {
  return isExamCode(code) ? getExamCatalogEntry(code).name.replace("AWS Certified ", "") : code;
}

const SHORT_DATE = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

function daysLeftLabel(days: number): string {
  if (days === 0) return "hoy";
  if (days === 1) return "mañana";
  return `en ${days} días`;
}

export function ModesPanel({ m, className }: { m: AdminMetrics; className?: string }) {
  const rows = MODE_ORDER.flatMap((mode) => m.modes.filter((s) => s.mode === mode));
  return (
    <AdminSection
      title="Modos de estudio"
      description="Últimos 7 días. Terminadas = partidas que llegaron al resumen."
      className={className}
    >
      <div className="-mx-1 overflow-x-auto rounded-xl">
        <table className={ADMIN_TABLE.table}>
          <thead className={ADMIN_TABLE.thead}>
            <tr>
              <th className={ADMIN_TABLE.th}>Modo</th>
              <th className={cn(ADMIN_TABLE.th, "text-right")}>Partidas</th>
              <th className={cn(ADMIN_TABLE.th, "text-right")}>Estudiantes</th>
              <th className={cn(ADMIN_TABLE.th, "text-right")}>Terminadas</th>
              <th className={cn(ADMIN_TABLE.th, "text-right")}>Precisión</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const off = EXAM_MODES.has(s.mode) && !m.flags.examModes;
              return (
                <tr key={s.mode} className={ADMIN_TABLE.tr}>
                  <td className={ADMIN_TABLE.td}>
                    <span className="flex items-center gap-2">
                      <span className="font-medium text-[var(--foreground)]">
                        {STUDY_MODE_LABELS[s.mode]}
                      </span>
                      {off ? <Badge>Apagado</Badge> : null}
                    </span>
                  </td>
                  <td className={cn(ADMIN_TABLE.td, "text-right font-semibold")}>
                    {NUMBER.format(s.sessions)}
                  </td>
                  <td className={cn(ADMIN_TABLE.td, "text-right")}>{NUMBER.format(s.students)}</td>
                  <td className={cn(ADMIN_TABLE.td, "text-right")}>
                    {s.sessions > 0 ? pct(s.completedSessions / s.sessions) : "—"}
                  </td>
                  <td className={cn(ADMIN_TABLE.td, "text-right")}>
                    {s.answers > 0 ? pct(s.correctAnswers / s.answers) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!m.flags.examModes ? (
        <p className={cn(EMPTY, "mt-4")}>
          Estudio y Examen están ocultos para los estudiantes.{" "}
          <Link href="/admin/flags" className="font-semibold text-[var(--foreground)] underline underline-offset-2">
            Banderas de función
          </Link>
        </p>
      ) : null}
    </AdminSection>
  );
}

export function ExamDatesPanel({ m, className }: { m: AdminMetrics; className?: string }) {
  const { scheduled, upcoming } = m.exams;
  return (
    <AdminSection
      title="Fechas de examen"
      description="Estudiantes que ya agendaron su certificación."
      className={className}
    >
      <dl className="grid grid-cols-2 gap-2">
        {scheduled.map((e) => (
          <Stat
            key={e.examCode}
            label={examName(e.examCode)}
            value={NUMBER.format(e.students)}
            hint={pct(m.totals.students > 0 ? e.students / m.totals.students : 0)}
          />
        ))}
      </dl>
      <h3 className="mt-5 text-xs font-semibold text-[var(--foreground-muted)]">Próximos</h3>
      {upcoming.length === 0 ? (
        <p className={cn(EMPTY, "mt-2")}>Nadie tiene un examen por delante.</p>
      ) : (
        <ul className="mt-2 space-y-2 text-sm">
          {upcoming.map((e) => (
            <li
              key={`${e.username}-${e.examCode}`}
              className="flex items-center justify-between gap-3"
            >
              <span className="min-w-0 truncate">
                <span className="font-medium text-[var(--foreground)]">@{e.username}</span>
                <span className="ml-1.5 text-xs text-[var(--foreground-muted)]">{e.examCode}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2 tabular-nums">
                <span className="text-xs text-[var(--foreground-muted)]">
                  {SHORT_DATE.format(new Date(`${e.examDate}T12:00:00Z`)).replace(".", "")}
                </span>
                <Badge tone={e.daysLeft <= 7 ? "warning" : "neutral"}>
                  {daysLeftLabel(e.daysLeft)}
                </Badge>
              </span>
            </li>
          ))}
        </ul>
      )}
    </AdminSection>
  );
}

function ContentRow({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[var(--foreground-muted)]">{label}</dt>
      <dd className="font-semibold tabular-nums">
        {NUMBER.format(value)}
        {hint ? (
          <span className="ml-1.5 text-xs font-normal text-[var(--foreground-muted)]">{hint}</span>
        ) : null}
      </dd>
    </div>
  );
}

export function ContentPanel({ m, className }: { m: AdminMetrics; className?: string }) {
  return (
    <AdminSection
      title="Contenido"
      description="Lo publicado es lo que ven los estudiantes."
      className={className}
    >
      <div className="space-y-5">
        {m.content.map((track) => {
          const hidden = track.trackId === "AIF" && !m.flags.aiTrack;
          const drafts = track.cards.draft + track.questions.draft;
          return (
            <div key={track.trackId}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {examName(TRACK_EXAM[track.trackId] ?? track.trackId)}
                </p>
                {hidden ? <Badge>Oculto</Badge> : <Badge tone="success">Visible</Badge>}
              </div>
              <dl className="mt-2 space-y-1.5 text-sm">
                <ContentRow label="Temas" value={track.topics} />
                <ContentRow label="Cartas publicadas" value={track.cards.published} />
                <ContentRow
                  label="Preguntas de examen"
                  value={track.questions.published}
                  hint={m.flags.examModes ? undefined : "sin usar"}
                />
                {drafts > 0 ? <ContentRow label="Borradores" value={drafts} /> : null}
              </dl>
            </div>
          );
        })}
        <dl className="space-y-1.5 rounded-xl bg-[var(--surface-elevated)] px-3 py-3 text-sm">
          <ContentRow label="Dominios acumulados" value={m.totals.masteredItems} />
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-[var(--foreground-muted)]">Promedio por estudiante</dt>
            <dd className="font-semibold tabular-nums">
              {m.totals.students > 0 ? (m.totals.masteredItems / m.totals.students).toFixed(1) : "0"}
            </dd>
          </div>
        </dl>
      </div>
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <Link href="/admin/flash" className={buttonVariants({ variant: "secondary", size: "sm" })}>
          Cartas
        </Link>
        <Link href="/admin/banco" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          Banco
        </Link>
        <Link href="/admin/import" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          Importar
        </Link>
      </div>
    </AdminSection>
  );
}

const GAME_TITLE = new Map(MINIGAMES.map((g) => [g.slug, g.title]));

export function MinigamesPanel({ m, className }: { m: AdminMetrics; className?: string }) {
  const students = m.totals.students;
  return (
    <AdminSection
      title="Minijuegos"
      description="Estudiantes que han terminado cada juego. No cuentan para el progreso ni el podio."
      actions={
        m.minigames.players > 0 ? (
          <Badge>{NUMBER.format(m.minigames.players)} jugadores</Badge>
        ) : null
      }
      className={className}
    >
      {m.minigames.players === 0 ? (
        <p className={EMPTY}>Ningún estudiante ha terminado un minijuego todavía.</p>
      ) : (
        <div className="space-y-4">
          {m.minigames.games.map((g) => (
            <div key={g.id}>
              <ShareBar label={GAME_TITLE.get(g.id) ?? g.id} value={g.players} total={students} />
              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                {g.completed === 0
                  ? "Nadie lo ha hecho sin errores."
                  : `${NUMBER.format(g.completed)} sin errores al menos una vez`}
              </p>
            </div>
          ))}
        </div>
      )}
    </AdminSection>
  );
}

export function TimedExamsPanel({ m, className }: { m: AdminMetrics; className?: string }) {
  const t = m.timedExams;
  return (
    <AdminSection
      title="Simulacros de examen"
      description={`Modo Examen, últimos ${m.daily.length} días. Aprobado: ${t.passScore}% o más, como el 700/1000 del examen real.`}
      className={className}
    >
      {t.started === 0 ? (
        <p className={EMPTY}>
          {m.flags.examModes
            ? "Nadie ha hecho un simulacro en este periodo."
            : "El modo Examen está apagado, así que todavía no hay simulacros."}
        </p>
      ) : (
        <dl className="grid grid-cols-3 gap-2">
          <Stat
            label="Terminados"
            value={NUMBER.format(t.finished)}
            hint={`de ${NUMBER.format(t.started)}`}
          />
          <Stat
            label="Calificación promedio"
            value={t.averageScore === null ? "—" : `${Math.round(t.averageScore)}%`}
          />
          <Stat
            label="Aprobados"
            tone="success"
            value={t.finished > 0 ? pct(t.passed / t.finished) : "—"}
            hint={t.finished > 0 ? `${NUMBER.format(t.passed)}` : undefined}
          />
        </dl>
      )}
    </AdminSection>
  );
}
