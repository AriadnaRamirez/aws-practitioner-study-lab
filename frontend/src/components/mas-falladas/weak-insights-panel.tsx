"use client";

import Link from "next/link";
import {
  ArrowLeftRight,
  CalendarClock,
  ChevronRight,
  Mountain,
  RotateCcw,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { MASTERY_STREAK, type WeakItem } from "@aps/shared";
import { tileLinkClass } from "@/components/dashboard/dashboard-tile";
import { Card, CardLabel } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  confusedWithName,
  failedWithinDays,
  hardestTopic,
  joinNames,
  plural,
  topicPracticeHref,
} from "./weak-insights";

const MAX_INSIGHTS = 3;

type InsightAction =
  | { kind: "link"; href: string; label: string }
  | { kind: "open"; item: WeakItem; label: string }
  | { kind: "study"; label: string };

type Insight = {
  id: keyof typeof ICONS;
  label: string;
  value: string;
  meta: string;
  action?: InsightAction;
};

const ICONS = {
  topic: Target,
  toughest: Mountain,
  mixup: ArrowLeftRight,
  almost: Zap,
  forgotten: RotateCcw,
  recent: CalendarClock,
} satisfies Record<string, LucideIcon>;

const titles = (items: WeakItem[]) => joinNames(items.map((it) => it.title));

/** Up to three things worth acting on, most useful first. */
export function buildInsights(
  items: WeakItem[],
  pending: WeakItem[],
): Insight[] {
  const out: Insight[] = [];

  const topic = hardestTopic(items);
  if (topic && topic.cards >= 2) {
    out.push({
      id: "topic",
      label: "Tema más difícil",
      value: topic.topicName,
      meta: `${topic.cards} de ${plural(items.length, "carta fallada", "cartas falladas")}`,
      action: {
        kind: "link",
        href: topicPracticeHref(topic.topicId),
        label: "Practicar tema",
      },
    });
  }

  const toughest = pending[0];
  if (toughest && toughest.failCount >= 2) {
    out.push({
      id: "toughest",
      label: "La más resistente",
      value: toughest.title,
      meta: `Fallada ${plural(toughest.failCount, "vez", "veces")}`,
      action: { kind: "open", item: toughest, label: "Ver carta" },
    });
  }

  const mixUp = pending
    .filter((it) => confusedWithName(it) && it.confusedCount >= 2)
    .sort((a, b) => b.confusedCount - a.confusedCount)[0];
  if (mixUp) {
    out.push({
      id: "mixup",
      label: "La confundes",
      value: `${mixUp.title} ↔ ${mixUp.confusedWith}`,
      meta: plural(mixUp.confusedCount, "vez", "veces"),
      action: { kind: "open", item: mixUp, label: "Ver carta" },
    });
  }

  const almost = pending.filter(
    (it) => it.consecutiveCorrect === MASTERY_STREAK - 1,
  );
  if (almost.length) {
    out.push({
      id: "almost",
      label: "Casi dominadas",
      value: plural(almost.length, "carta", "cartas"),
      meta: titles(almost),
      action: {
        kind: "study",
        label: almost.length === 1 ? "Remátala" : "Remátalas",
      },
    });
  }

  const forgotten = pending.filter((it) => it.masteredAt);
  if (forgotten.length) {
    out.push({
      id: "forgotten",
      label: "Se te olvidaron",
      value: plural(forgotten.length, "carta", "cartas"),
      meta: titles(forgotten),
      action: {
        kind: "study",
        label: forgotten.length === 1 ? "Recupérala" : "Recupéralas",
      },
    });
  }

  const recent = pending.filter((it) => failedWithinDays(it, 7));
  if (recent.length) {
    out.push({
      id: "recent",
      label: "Falladas esta semana",
      value: plural(recent.length, "carta", "cartas"),
      meta: titles(recent),
    });
  }

  return out.slice(0, MAX_INSIGHTS);
}

function InsightActionButton({
  action,
  studyPending,
  onStudyWeak,
  onOpenItem,
}: {
  action: InsightAction;
  studyPending: boolean;
  onStudyWeak: () => void;
  onOpenItem: (item: WeakItem) => void;
}) {
  const content = (
    <>
      {action.label}
      <ChevronRight className="size-4" aria-hidden />
    </>
  );

  if (action.kind === "link") {
    return (
      <Link href={action.href} className={tileLinkClass}>
        {content}
      </Link>
    );
  }

  if (action.kind === "open") {
    const { item } = action;
    return (
      <button
        type="button"
        aria-haspopup="dialog"
        className={tileLinkClass}
        onClick={() => onOpenItem(item)}
      >
        {content}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        tileLinkClass,
        "disabled:pointer-events-none disabled:opacity-50",
      )}
      disabled={studyPending}
      onClick={onStudyWeak}
    >
      {content}
    </button>
  );
}

/** "Pistas": the insights side by side in one quiet band, split by hairlines. */
export function InsightsStrip({
  insights,
  studyPending,
  onStudyWeak,
  onOpenItem,
  className,
}: {
  insights: Insight[];
  studyPending: boolean;
  onStudyWeak: () => void;
  onOpenItem: (item: WeakItem) => void;
  className?: string;
}) {
  if (!insights.length) return null;
  return (
    <Card
      as="section"
      aria-labelledby="pistas"
      padding="none"
      className={className}
    >
      <h2 id="pistas" className="sr-only">
        Pistas sobre tus fallos
      </h2>
      <ul
        className={cn(
          "grid divide-y divide-[var(--border)] md:divide-x md:divide-y-0",
          insights.length === 3
            ? "md:grid-cols-3"
            : insights.length === 2
              ? "md:grid-cols-2"
              : "",
        )}
      >
        {insights.map((insight) => {
          const Icon = ICONS[insight.id];
          return (
            <li
              key={insight.id}
              className="flex min-w-0 flex-col px-5 py-4 sm:px-6"
            >
              <CardLabel as="p" icon={<Icon aria-hidden />}>
                {insight.label}
              </CardLabel>
              <p
                className="mt-2 line-clamp-2 break-words text-lg font-extrabold leading-tight tracking-tight text-[var(--foreground)]"
                title={insight.value}
              >
                {insight.value}
              </p>
              <p
                className="mt-0.5 truncate text-sm text-[var(--foreground-muted)]"
                title={insight.meta}
              >
                {insight.meta}
              </p>
              {insight.action ? (
                <div className="mt-auto pt-3">
                  <InsightActionButton
                    action={insight.action}
                    studyPending={studyPending}
                    onStudyWeak={onStudyWeak}
                    onOpenItem={onOpenItem}
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
