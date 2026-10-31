"use client";

import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  type KeyboardEvent,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Mascot } from "@/components/brand/mascot";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";
import { MENU_ANCHOR, TOUR_STEPS, type TourStep } from "./steps";

/** Room around the highlighted element. */
const SPOT_PAD = 8;
/** Space between the highlight and the card. */
const GAP = 12;
/** Minimum distance from the card to the viewport edges. */
const EDGE = 12;
/** Keeps scrolled-to targets clear of the sticky header. */
const SAFE_TOP = 88;
/** Anchors can mount late (data fetches, route changes). */
const POLL_MS = 250;

type Box = { top: number; left: number; width: number; height: number };
type Layout = {
  spot: Box | null;
  card: { top: number; left: number } | null;
  anchor: string | null;
};

const CENTERED: Layout = { spot: null, card: null, anchor: null };

function visibleAnchors(name: string): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(`[data-tour="${name}"]`),
  ).filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
}

function findTarget(step: TourStep) {
  for (const name of step.anchors ?? []) {
    const els = visibleAnchors(name);
    if (els.length) return { name, els };
  }
  return null;
}

function unionBox(els: HTMLElement[]): Box {
  const rects = els.map((el) => el.getBoundingClientRect());
  const top = Math.min(...rects.map((r) => r.top));
  const left = Math.min(...rects.map((r) => r.left));
  const bottom = Math.max(...rects.map((r) => r.bottom));
  const right = Math.max(...rects.map((r) => r.right));
  return { top, left, width: right - left, height: bottom - top };
}

function availableSteps(): TourStep[] {
  return TOUR_STEPS.filter(
    (s) => !s.requires || document.querySelector(`[data-tour="${s.requires}"]`),
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function sameLayout(a: Layout, b: Layout) {
  const r = (n?: number) => Math.round(n ?? -1);
  return (
    a.anchor === b.anchor &&
    r(a.spot?.top) === r(b.spot?.top) &&
    r(a.spot?.left) === r(b.spot?.left) &&
    r(a.spot?.width) === r(b.spot?.width) &&
    r(a.spot?.height) === r(b.spot?.height) &&
    r(a.card?.top) === r(b.card?.top) &&
    r(a.card?.left) === r(b.card?.left)
  );
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Spotlight tour: dims the page, outlines the step's anchor and puts the card
 * next to it. Falls back to a centered card when the anchor isn't on screen.
 */
export function OnboardingTour({ onFinish }: { onFinish: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const titleId = useId();
  const bodyId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const scrolledFor = useRef<string | null>(null);
  const [steps, setSteps] = useState<TourStep[]>(() =>
    TOUR_STEPS.filter((s) => !s.requires),
  );
  const [currentId, setCurrentId] = useState(TOUR_STEPS[0].id);
  const [layout, setLayout] = useState<Layout>(CENTERED);

  useModal(true, onFinish, cardRef);

  const index = Math.max(
    0,
    steps.findIndex((s) => s.id === currentId),
  );
  const step = steps[index];
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  function goTo(next: number) {
    const target = steps[next];
    if (target) setCurrentId(target.id);
  }

  function next() {
    if (isLast) onFinish();
    else goTo(index + 1);
  }

  function prev() {
    if (!isFirst) goTo(index - 1);
  }

  useEffect(() => {
    if (step.path && pathname !== step.path) router.push(step.path);
  }, [step.path, pathname, router]);

  useLayoutEffect(() => {
    let frame = 0;

    function measure() {
      const available = availableSteps();
      setSteps((prev) =>
        prev.map((s) => s.id).join() === available.map((s) => s.id).join()
          ? prev
          : available,
      );

      const target = findTarget(step);
      const card = cardRef.current;
      if (!target || !card) {
        setLayout((prev) => (sameLayout(prev, CENTERED) ? prev : CENTERED));
        return;
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let box = unionBox(target.els);

      if (step.path && scrolledFor.current !== step.id) {
        scrolledFor.current = step.id;
        if (box.top < SAFE_TOP || box.top + box.height > vh - EDGE) {
          window.scrollTo({
            top: window.scrollY + box.top - SAFE_TOP,
            behavior: prefersReducedMotion() ? "auto" : "smooth",
          });
          box = unionBox(target.els);
        }
      }

      const spot: Box = {
        top: box.top - SPOT_PAD,
        left: box.left - SPOT_PAD,
        width: box.width + SPOT_PAD * 2,
        height: box.height + SPOT_PAD * 2,
      };
      const cw = card.offsetWidth;
      const ch = card.offsetHeight;
      const spotBottom = spot.top + spot.height;
      let top: number;
      if (vh - spotBottom - GAP >= ch + EDGE) top = spotBottom + GAP;
      else if (spot.top - GAP >= ch + EDGE) top = spot.top - GAP - ch;
      else top = vh - ch - EDGE;

      const nextLayout: Layout = {
        spot,
        anchor: target.name,
        card: {
          top: clamp(top, EDGE, vh - ch - EDGE),
          left: clamp(spot.left + spot.width / 2 - cw / 2, EDGE, vw - cw - EDGE),
        },
      };
      setLayout((prev) => (sameLayout(prev, nextLayout) ? prev : nextLayout));
    }

    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    }

    measure();
    const timer = window.setInterval(measure, POLL_MS);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(timer);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
    };
  }, [step]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "Enter" && e.target === e.currentTarget) {
      e.preventDefault();
      next();
    }
  }

  const { spot, card, anchor } = layout;
  const position = `Paso ${index + 1} de ${steps.length}`;

  return (
    <div className="fixed inset-0 z-[100]" role="presentation">
      {spot ? (
        <div
          aria-hidden
          className="pointer-events-none fixed rounded-[1.25rem] ring-2 ring-[var(--accent)] motion-safe:transition-[top,left,width,height] motion-safe:duration-300 motion-safe:ease-out"
          style={{ ...spot, boxShadow: "0 0 0 9999px var(--scrim)" }}
        />
      ) : (
        <div aria-hidden className="absolute inset-0 bg-[var(--scrim)]" />
      )}

      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className={cn(
          "fixed flex max-h-[calc(100dvh-1.5rem)] w-[min(24rem,calc(100vw-1.5rem))] flex-col gap-4 overflow-y-auto rounded-3xl bg-[var(--surface-elevated)] p-5 shadow-[var(--shadow-overlay)] outline-none sm:p-6",
          "motion-safe:animate-fade-up motion-safe:transition-[top,left] motion-safe:duration-300 motion-safe:ease-out",
          !card && "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        )}
        style={card ?? undefined}
      >
        <p className="sr-only" aria-live="polite">
          {`${position}: ${step.title}`}
        </p>

        <div className="flex items-center justify-between gap-3">
          <p
            aria-hidden
            className="text-xs font-semibold tabular-nums text-[var(--foreground-muted)]"
          >
            {position}
          </p>
          <IconButton
            aria-label="Cerrar recorrido"
            onClick={onFinish}
            className="-mr-1 -mt-1"
          >
            <X aria-hidden />
          </IconButton>
        </div>

        {isFirst ? (
          <div aria-hidden className="-mt-2 flex justify-center">
            <Mascot pose="wave" size="sm" glow={false} className="h-24 w-28" />
          </div>
        ) : null}

        <div className="min-w-0">
          <h2
            id={titleId}
            className="text-xl font-extrabold leading-tight tracking-tight text-[var(--foreground)] sm:text-2xl"
          >
            {step.title}
          </h2>
          <p
            id={bodyId}
            className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)] sm:text-base"
          >
            {step.body}
            {anchor === MENU_ANCHOR ? " Lo encuentras en el Menú." : null}
          </p>
        </div>

        <div aria-hidden className="flex items-center gap-1.5">
          {steps.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                "h-1.5 flex-1 rounded-full motion-safe:transition-colors",
                i <= index ? "bg-[var(--accent)]" : "bg-[var(--surface-hover)]",
              )}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          {isLast ? (
            <span />
          ) : (
            <Button type="button" variant="ghost" size="sm" onClick={onFinish}>
              Saltar
            </Button>
          )}
          <div className="flex gap-2">
            {isFirst ? null : (
              <Button type="button" variant="secondary" size="sm" onClick={prev}>
                Anterior
              </Button>
            )}
            <Button type="button" size="sm" onClick={next}>
              {isLast ? "Terminar" : "Siguiente"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
