"use client";

import * as React from "react";
import { X } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Modal behavior shared by every overlay: focus the panel, keep Tab inside it,
 * close on Escape, lock page scroll and give focus back on close.
 */
export function useModal(
  open: boolean,
  onClose: () => void,
  panelRef: React.RefObject<HTMLElement | null>,
) {
  const closeRef = React.useRef(onClose);
  React.useEffect(() => {
    closeRef.current = onClose;
  });

  React.useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [open, panelRef]);
}

const SIZE = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
} as const;

type DialogProps = {
  open: boolean;
  onClose: () => void;
  /** id of the element that names the dialog (usually its h2). */
  labelledBy: string;
  describedBy?: string;
  size?: keyof typeof SIZE;
  className?: string;
  children: React.ReactNode;
};

/** Centered on desktop, bottom sheet on phones. */
export function Dialog({
  open,
  onClose,
  labelledBy,
  describedBy,
  size = "md",
  className,
  children,
}: DialogProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  useModal(open, onClose, panelRef);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Cerrar"
        tabIndex={-1}
        className="absolute inset-0 bg-[var(--scrim)] backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={cn(
          "animate-fade-up relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-full flex-col gap-4 overflow-y-auto rounded-3xl bg-[var(--surface-elevated)] p-5 shadow-[var(--shadow-overlay)] outline-none sm:p-6",
          SIZE[size],
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Title row with the close button. `children` goes under the title. */
export function DialogHeader({
  titleId,
  title,
  eyebrow,
  media,
  onClose,
  children,
}: {
  titleId: string;
  title: React.ReactNode;
  /** Small context line above the title ("Seguridad · 6 fallos"). */
  eyebrow?: React.ReactNode;
  /** Leading image or icon. */
  media?: React.ReactNode;
  onClose: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {media}
        <div className="min-w-0">
          {eyebrow ? (
            <p className="truncate text-xs text-[var(--foreground-muted)]">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={titleId}
            className="text-xl font-extrabold leading-tight tracking-tight text-[var(--foreground)] sm:text-2xl"
          >
            {title}
          </h2>
          {children}
        </div>
      </div>
      <IconButton aria-label="Cerrar" onClick={onClose} className="-mr-1 -mt-1">
        <X aria-hidden />
      </IconButton>
    </div>
  );
}
