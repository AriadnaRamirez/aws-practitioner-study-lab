"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { MASTERY_STREAK, type WeakItem } from "@aps/shared";
import { tilePillClass } from "@/components/study/dashboard/dashboard-tile";
import { cn } from "@/lib/utils";
import {
  cardAnchor,
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
  | { kind: "study"; label: string };

type Insight = {
  id: string;
  label: string;
  value: string;
  meta: string;
  action?: InsightAction;
};

const actionClass = cn(tilePillClass, "h-auto min-h-8 py-1.5 text-left");

const titles = (items: WeakItem[]) => joinNames(items.map((it) => it.title));

function buildInsights(items: WeakItem[], pending: WeakItem[]): Insight[] {
  const out: Insight[] = [];

  const topic = hardestTopic(items);
  if (topic && topic.cards >= 2) {
    out.push({
      id: "topic",
      label: "Tema más difícil",
      value: topic.topicName,
      meta: `${topic.cards} de ${plural(items.length, "carta fallada", "cartas falladas")}`,
      action: { kind: "link", href: topicPracticeHref(topic.topicId), label: "Practicar tema" },
    });
  }

  const toughest = pending[0];
  if (toughest && toughest.failCount >= 2) {
    out.push({
      id: "toughest",
      label: "La más resistente",
      value: toughest.title,
      meta: `Fallada ${plural(toughest.failCount, "vez", "veces")}`,
      action: { kind: "link", href: `#${cardAnchor(toughest)}`, label: "Ver carta" },
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
      action: { kind: "link", href: `#${cardAnchor(mixUp)}`, label: "Ver carta" },
    });
  }

  const almost = pending.filter((it) => it.consecutiveCorrect === MASTERY_STREAK - 1);
  if (almost.length) {
    out.push({
      id: "almost",
      label: "A 1 acierto",
      value: plural(almost.length, "carta", "cartas"),
      meta: titles(almost),
      action: { kind: "study", label: almost.length === 1 ? "Remátala" : "Remátalas" },
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
}: {
  action: InsightAction;
  studyPending: boolean;
  onStudyWeak: () => void;
}) {
  if (action.kind === "link") {
    if (action.href.startsWith("#")) {
      return (
        <a href={action.href} className={actionClass}>
          {action.label}
        </a>
      );
    }
    return (
      <Link href={action.href} className={actionClass}>
        {action.label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(actionClass, "cursor-pointer disabled:cursor-wait disabled:opacity-60")}
      disabled={studyPending}
      onClick={onStudyWeak}
    >
      {action.label}
    </button>
  );
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
    <section
      aria-labelledby="lo-que-vemos"
      className="mt-4 rounded-2xl bg-[var(--surface-elevated)] p-5 sm:p-6"
    >
      <h2
        id="lo-que-vemos"
        className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground-muted)]"
      >
        <Sparkles className="size-4 text-[var(--accent)]" aria-hidden />
        Lo que vemos
      </h2>
      <ul className="mt-4 space-y-5">
        {insights.map((insight) => (
          <li key={insight.id} className="flex min-w-0 items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[var(--foreground-muted)]">{insight.label}</p>
              <p
                className="mt-0.5 truncate text-sm font-semibold text-[var(--foreground)]"
                title={insight.value}
              >
                {insight.value}
              </p>
              <p
                className="truncate text-xs text-[var(--foreground-muted)]"
                title={insight.meta}
              >
                {insight.meta}
              </p>
            </div>
            {insight.action ? (
              <InsightActionButton
                action={insight.action}
                studyPending={studyPending}
                onStudyWeak={onStudyWeak}
              />
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
