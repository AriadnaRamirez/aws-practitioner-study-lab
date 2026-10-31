"use client";

import Link from "next/link";
import {
  ArrowLeftRight,
  ArrowRight,
  CalendarClock,
  Mountain,
  RotateCcw,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { MASTERY_STREAK, type WeakItem } from "@aps/shared";
import { BENTO_LIST, bentoFill } from "@/components/ui/bento-tile";
import { Card, CardLabel } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import { SectionTitle } from "@/components/ui/page";
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

const actionClass = cn(
  "group/action inline-flex w-fit items-center gap-1 rounded-md text-sm font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)] disabled:pointer-events-none disabled:opacity-50",
  FOCUS_RING,
);

function ActionLabel({ children }: { children: string }) {
  return (
    <>
      {children}
      <ArrowRight
        aria-hidden
        className="size-3.5 transition-transform group-hover/action:translate-x-0.5"
      />
    </>
  );
}

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
  onOpenItem,
}: {
  action: InsightAction;
  studyPending: boolean;
  onStudyWeak: () => void;
  onOpenItem: (item: WeakItem) => void;
}) {
  if (action.kind === "link") {
    return (
      <Link href={action.href} className={actionClass}>
        <ActionLabel>{action.label}</ActionLabel>
      </Link>
    );
  }

  if (action.kind === "open") {
    const { item } = action;
    return (
      <button
        type="button"
        aria-haspopup="dialog"
        className={actionClass}
        onClick={() => onOpenItem(item)}
      >
        <ActionLabel>{action.label}</ActionLabel>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={actionClass}
      disabled={studyPending}
      onClick={onStudyWeak}
    >
      <ActionLabel>{action.label}</ActionLabel>
    </button>
  );
}

export function WeakInsightsPanel({
  items,
  pending,
  studyPending,
  onStudyWeak,
  onOpenItem,
  className,
}: {
  items: WeakItem[];
  pending: WeakItem[];
  studyPending: boolean;
  onStudyWeak: () => void;
  onOpenItem: (item: WeakItem) => void;
  className?: string;
}) {
  const insights = buildInsights(items, pending);
  if (!insights.length) return null;

  return (
    <section aria-labelledby="para-ti" className={className}>
      <SectionTitle id="para-ti">Para ti</SectionTitle>
      <p className="mt-1 text-sm text-[var(--foreground-muted)]">
        Lo que noté en tus fallos y por dónde seguir.
      </p>
      <ul className={cn(BENTO_LIST, "mt-4")}>
        {insights.map((insight, i) => {
          const Icon = ICONS[insight.id];
          return (
            <Card
              as="li"
              key={insight.id}
              className={cn(
                bentoFill(i, insights.length, { md: 3 }),
                "flex flex-col",
              )}
            >
              <CardLabel as="p" icon={<Icon aria-hidden />}>
                {insight.label}
              </CardLabel>
              <p
                className="mt-3 line-clamp-2 break-words text-xl font-extrabold leading-tight tracking-tight text-[var(--foreground)]"
                title={insight.value}
              >
                {insight.value}
              </p>
              <p
                className="mt-1 truncate text-sm text-[var(--foreground-muted)]"
                title={insight.meta}
              >
                {insight.meta}
              </p>
              {insight.action ? (
                <div className="mt-auto pt-4">
                  <InsightActionButton
                    action={insight.action}
                    studyPending={studyPending}
                    onStudyWeak={onStudyWeak}
                    onOpenItem={onOpenItem}
                  />
                </div>
              ) : null}
            </Card>
          );
        })}
      </ul>
    </section>
  );
}
