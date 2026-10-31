import * as React from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const TONE = {
  danger: {
    box: "bg-[var(--danger-soft)] text-[var(--danger-text)]",
    text: "text-[var(--danger-text)]",
    icon: AlertCircle,
  },
  success: {
    box: "bg-[var(--success-soft)] text-[var(--success-text)]",
    text: "text-[var(--success-text)]",
    icon: CheckCircle2,
  },
  warning: {
    box: "bg-[var(--warning-soft)] text-[var(--warning-text)]",
    text: "text-[var(--warning-text)]",
    icon: TriangleAlert,
  },
  info: {
    box: "bg-[var(--surface-elevated)] text-[var(--foreground)]",
    text: "text-[var(--foreground-muted)]",
    icon: Info,
  },
} as const;

export type NoticeTone = keyof typeof TONE;

/**
 * Feedback message. `boxed` for page-level messages, plain for a line under a
 * field or button. Errors are announced with role="alert".
 */
export function Notice({
  tone = "info",
  boxed = false,
  title,
  action,
  className,
  children,
}: {
  tone?: NoticeTone;
  boxed?: boolean;
  title?: React.ReactNode;
  /** Button shown after the message (e.g. "Reintentar"). */
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  const t = TONE[tone];
  const Icon = t.icon;
  const role = tone === "danger" ? "alert" : "status";

  if (!boxed) {
    return (
      <p role={role} className={cn("text-sm", t.text, className)}>
        {children}
      </p>
    );
  }

  return (
    <div
      role={role}
      className={cn(
        "flex items-start gap-3 rounded-xl px-4 py-3 text-sm",
        t.box,
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? (
          <div className={cn("leading-relaxed", title && "mt-0.5 opacity-90")}>
            {children}
          </div>
        ) : null}
        {action ? <div className="mt-3">{action}</div> : null}
      </div>
    </div>
  );
}
