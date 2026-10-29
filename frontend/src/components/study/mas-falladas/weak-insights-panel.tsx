"use client";

import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import {
  CalendarClock,
  Flame,
  RotateCcw,
  Shuffle,
  Sparkles,
  Target,
} from "lucide-react";
import { MASTERY_STREAK, type WeakItem } from "@aps/shared";
import { tilePillClass } from "@/components/study/dashboard/dashboard-tile";
import { cn } from "@/lib/utils";
import {
  cardAnchor,
  confusedWithName,
  failedWithinDays,
  hardestTopic,
  plural,
  topicPracticeHref,
} from "./weak-insights";

const MAX_INSIGHTS = 3;
const NAMES_SHOWN = 3;

type InsightAction =
  | { kind: "link"; href: string; label: string }
  | { kind: "study"; label: string };

type Insight = {
  id: string;
  icon: ReactNode;
  body: ReactNode;
  action?: InsightAction;
};

const actionClass = cn(tilePillClass, "h-auto min-h-8 py-1.5 text-left");

const nameLinkClass =
  "rounded-sm font-semibold text-[var(--foreground)] underline decoration-[var(--accent)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

function CardLinks({ items }: { items: WeakItem[] }) {
  const shown = items.slice(0, NAMES_SHOWN);
  const more = items.length - shown.length;
  return (
    <>
      {shown.map((item, i) => (
        <Fragment key={cardAnchor(item)}>
          {i > 0 ? (i === shown.length - 1 && more === 0 ? " y " : ", ") : null}
          <a href={`#${cardAnchor(item)}`} className={nameLinkClass}>
            {item.title}
          </a>
        </Fragment>
      ))}
      {more > 0 ? ` y ${more} más` : null}
    </>
  );
}

function buildInsights(items: WeakItem[], pending: WeakItem[]): Insight[] {
  const out: Insight[] = [];

  const topic = hardestTopic(items);
  if (topic && topic.cards >= 2) {
    out.push({
      id: "topic",
      icon: <Flame className="size-5" />,
      body: (
        <>
          Tu tema más difícil es <strong>{topic.topicName}</strong>:{" "}
          {topic.cards} de tus {plural(items.length, "carta fallada", "cartas falladas")}{" "}
          son de ahí.
        </>
      ),
      action: {
        kind: "link",
        href: topicPracticeHref(topic.topicId),
        label: `Practicar ${topic.topicName}`,
      },
    });
  }

  const toughest = pending[0];
  if (toughest && toughest.failCount >= 2) {
    out.push({
      id: "toughest",
      icon: <Target className="size-5" />,
      body: (
        <>
          La que más se te resiste es <strong>{toughest.title}</strong>: la
          fallaste {plural(toughest.failCount, "vez", "veces")}. Lee bien{" "}
          {toughest.itemType === "EXAM_QUESTION"
            ? "la respuesta correcta"
            : "su definición"}{" "}
          antes de repasar.
        </>
      ),
      action: {
        kind: "link",
        href: `#${cardAnchor(toughest)}`,
        label: "Ver la carta",
      },
    });
  }

  const mixUp = pending
    .filter((it) => confusedWithName(it) && it.confusedCount >= 2)
    .sort((a, b) => b.confusedCount - a.confusedCount)[0];
  if (mixUp) {
    out.push({
      id: "mixup",
      icon: <Shuffle className="size-5" />,
      body: (
        <>
          Confundes <strong>{mixUp.title}</strong> con{" "}
          <strong>{mixUp.confusedWith}</strong> (
          {plural(mixUp.confusedCount, "vez", "veces")}). Repásalas juntas:
          fíjate en qué las diferencia.
        </>
      ),
      action: {
        kind: "link",
        href: `#${cardAnchor(mixUp)}`,
        label: "Ver la carta",
      },
    });
  }

  const almost = pending.filter(
    (it) => it.consecutiveCorrect === MASTERY_STREAK - 1,
  );
  if (almost.length) {
    const one = almost.length === 1;
    out.push({
      id: "almost",
      icon: <Sparkles className="size-5" />,
      body: (
        <>
          <strong>
            {plural(almost.length, "carta", "cartas")}{" "}
            {one ? "está" : "están"} a 1 acierto de dominarse
          </strong>
          : <CardLinks items={almost} />.
        </>
      ),
      action: { kind: "study", label: one ? "Remátala" : "Remátalas" },
    });
  }

  const forgotten = pending.filter((it) => it.masteredAt);
  if (forgotten.length) {
    const one = forgotten.length === 1;
    out.push({
      id: "forgotten",
      icon: <RotateCcw className="size-5" />,
      body: (
        <>
          <strong>
            {plural(forgotten.length, "carta", "cartas")} que ya dominabas
          </strong>{" "}
          {one ? "se te olvidó" : "se te olvidaron"}:{" "}
          <CardLinks items={forgotten} />.
        </>
      ),
      action: { kind: "study", label: one ? "Recupérala" : "Recupéralas" },
    });
  }

  const recent = pending.filter((it) => failedWithinDays(it, 7));
  if (recent.length) {
    out.push({
      id: "recent",
      icon: <CalendarClock className="size-5" />,
      body: (
        <>
          Esta semana fallaste{" "}
          <strong>{plural(recent.length, "carta", "cartas")}</strong> que aún
          no dominas: <CardLinks items={recent} />.
        </>
      ),
    });
  }

  return out.slice(0, MAX_INSIGHTS);
}

export function WeakInsightsPanel({
  items,
  pending,
  studyPending,
  onStudyWeak,
}: {
  items: WeakItem[];
  pending: WeakItem[];
  studyPending: boolean;
  onStudyWeak: () => void;
}) {
  const insights = buildInsights(items, pending);
  if (!insights.length) return null;

  return (
    <section aria-labelledby="mas-falladas-vemos" className="mt-10">
      <h2
        id="mas-falladas-vemos"
        className="font-sans text-lg font-bold tracking-tight text-[var(--foreground)]"
      >
        Lo que vemos
      </h2>
      <ul
        className={cn(
          "mt-4 grid gap-3",
          insights.length > 1 && "md:grid-cols-2",
          insights.length > 2 && "lg:grid-cols-3",
        )}
      >
        {insights.map((insight) => (
          <li
            key={insight.id}
            className="flex min-w-0 flex-col rounded-2xl bg-[var(--surface-elevated)] p-5 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.8)]"
          >
            <span className="text-[var(--accent)]" aria-hidden>
              {insight.icon}
            </span>
            <p className="mt-3 break-words text-[15px] leading-relaxed text-[var(--foreground)]">
              {insight.body}
            </p>
            {insight.action ? (
              <div className="mt-auto pt-4">
                {insight.action.kind === "link" ? (
                  insight.action.href.startsWith("#") ? (
                    <a href={insight.action.href} className={actionClass}>
                      {insight.action.label}
                    </a>
                  ) : (
                    <Link href={insight.action.href} className={actionClass}>
                      {insight.action.label}
                    </Link>
                  )
                ) : (
                  <button
                    type="button"
                    className={cn(
                      actionClass,
                      "cursor-pointer disabled:cursor-wait disabled:opacity-60",
                    )}
                    disabled={studyPending}
                    onClick={onStudyWeak}
                  >
                    {insight.action.label}
                  </button>
                )}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
