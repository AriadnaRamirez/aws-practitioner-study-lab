"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { plural, type TopicOption } from "./builder-model";

export function TopicOptionRow({
  option,
  checked,
  onToggle,
}: {
  option: TopicOption;
  checked: boolean;
  onToggle: () => void;
}) {
  const { cat, total } = option;
  const label = cat.group === "aws" ? `${cat.title} de AWS` : cat.title;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className={cn(
        "group flex w-full min-w-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        "[@media(max-height:500px)]:py-2",
        checked
          ? "bg-[color-mix(in_srgb,var(--accent)_24%,var(--surface-elevated))] hover:bg-[color-mix(in_srgb,var(--accent)_30%,var(--surface-elevated))]"
          : "bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)]",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-flex size-5 shrink-0 items-center justify-center rounded-md transition-colors",
          checked
            ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
            : "bg-[color-mix(in_srgb,var(--foreground)_14%,var(--surface))] group-hover:bg-[color-mix(in_srgb,var(--foreground)_22%,var(--surface))]",
        )}
      >
        {checked ? <Check className="size-3.5" strokeWidth={3} /> : null}
      </span>

      <span className="min-w-0 flex-1 text-sm font-semibold leading-snug text-[var(--foreground)]">
        {label}
      </span>
      {total !== null ? (
        <span className="shrink-0 text-xs tabular-nums text-[var(--foreground-muted)]">
          {plural(total, "carta", "cartas")}
        </span>
      ) : null}
    </button>
  );
}
