"use client";

import { useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Eye, Lightbulb } from "lucide-react";
import type { KnowledgeItem } from "@aps/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import { Notice } from "@/components/ui/notice";
import { ProgressBar } from "@/components/ui/progress";
import {
  GamePicker,
  GameShell,
  GameSummary,
  KnowledgeGate,
  ReviewList,
  formatElapsed,
  useKnowledgeItems,
} from "@/components/minigames/game-ui";
import { categoryBadge, type GameCategory } from "@/lib/minigames/categories";
import {
  buildCrossword,
  cellKey,
  crosswordTopics,
  entryCells,
  pickHints,
  type Crossword,
  type CrosswordEntry,
  type Direction,
} from "@/lib/minigames/crucigrama";
import {
  recordGameResult,
  topicResultId,
  useGameResults,
} from "@/lib/minigames/progress";
import { cn } from "@/lib/utils";

const GAME_ID = "crucigrama";

const DIR_LABEL: Record<Direction, string> = {
  across: "Horizontal",
  down: "Vertical",
};

export function CrucigramaGame() {
  const knowledge = useKnowledgeItems();
  return (
    <KnowledgeGate {...knowledge}>
      {(items) => <CrucigramaFlow items={items} />}
    </KnowledgeGate>
  );
}

function CrucigramaFlow({ items }: { items: KnowledgeItem[] }) {
  const categories = useMemo(() => crosswordTopics(items), [items]);
  const [picked, setPicked] = useState<GameCategory | null>(null);
  const [round, setRound] = useState(0);
  const results = useGameResults();

  if (picked) {
    return (
      <CrucigramaRound
        key={round}
        category={picked}
        onReplay={() => setRound((r) => r + 1)}
        onExit={() => setPicked(null)}
      />
    );
  }

  return (
    <GamePicker
      title="Crucigrama"
      subtitle="Lee cada pista y escribe el nombre del servicio o concepto. Las palabras largas traen su primera letra de pista. Sin espacios ni acentos: Route 53 se escribe ROUTE53."
      options={categories.map((c) => ({
        id: c.category.id,
        title: c.category.title,
        description: `${c.category.subtitle} · ${c.items.length} palabras posibles`,
        badge: categoryBadge(c.category),
        status: results[topicResultId(GAME_ID, c.category.id)],
      }))}
      onPick={(id) =>
        setPicked(categories.find((c) => c.category.id === id) ?? null)
      }
    />
  );
}

function CrucigramaRound({
  category,
  onReplay,
  onExit,
}: {
  category: GameCategory;
  onReplay: () => void;
  onExit: () => void;
}) {
  const [puzzle] = useState(() => buildCrossword(category.items));
  return (
    <GameShell
      title="Crucigrama"
      subtitle={category.category.title}
      onExit={onExit}
    >
      {puzzle ? (
        <CrosswordBoard
          puzzle={puzzle}
          categoryId={category.category.id}
          onReplay={onReplay}
          onExit={onExit}
        />
      ) : (
        <Notice boxed tone="warning" className="mt-6">
          No pudimos armar un crucigrama con este tema. Prueba con otro.
        </Notice>
      )}
    </GameShell>
  );
}

type CellInfo = {
  solution: string;
  number?: number;
  across?: number;
  down?: number;
};

type Letters = Readonly<Record<string, string>>;

const keysOf = (e: CrosswordEntry) =>
  entryCells(e).map((c) => cellKey(c.row, c.col));

function CrosswordBoard({
  puzzle,
  categoryId,
  onReplay,
  onExit,
}: {
  puzzle: Crossword;
  categoryId: string;
  onReplay: () => void;
  onExit: () => void;
}) {
  const { entries, rows, cols } = puzzle;

  const cells = useMemo(() => {
    const map = new Map<string, CellInfo>();
    entries.forEach((e, index) => {
      entryCells(e).forEach(({ row, col, letter }, k) => {
        const key = cellKey(row, col);
        const info = map.get(key) ?? { solution: letter };
        info[e.dir] = index;
        if (k === 0) info.number = e.number;
        map.set(key, info);
      });
    });
    return map;
  }, [entries]);

  const [given, setGiven] = useState<ReadonlySet<string>>(() =>
    pickHints(entries),
  );
  const [letters, setLetters] = useState<Letters>(() =>
    Object.fromEntries(
      [...given].map((k) => [k, cells.get(k)!.solution] as const),
    ),
  );
  const [active, setActive] = useState(0);
  const [revealedWords, setRevealedWords] = useState<ReadonlySet<string>>(
    new Set(),
  );
  const [helpLetters, setHelpLetters] = useState(0);
  /** Words completed with a wrong letter; any of these rules out "completed". */
  const [slips, setSlips] = useState(0);
  const [announce, setAnnounce] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState<number | null>(null);
  const inputs = useRef(new Map<string, HTMLInputElement>());
  /** Programmatic focus already picked the word; the focus handler must not override it. */
  const steering = useRef(false);
  /** A tap on the focused cell switches between across and down. */
  const wasFocused = useRef(false);

  const activeEntry = entries[active];
  const activeKeys = useMemo(() => new Set(keysOf(activeEntry)), [activeEntry]);

  const isSolved = (e: CrosswordEntry, map: Letters) =>
    keysOf(e).every((k) => map[k] === cells.get(k)!.solution);
  const solved = entries.map((e) => isSolved(e, letters));
  const solvedCount = solved.filter(Boolean).length;

  /** Letters that don't fit, shown only once their word is complete. */
  const wrong = useMemo(() => {
    const set = new Set<string>();
    for (const e of entries) {
      const keys = keysOf(e);
      if (!keys.every((k) => letters[k])) continue;
      for (const k of keys) {
        if (letters[k] !== cells.get(k)!.solution) set.add(k);
      }
    }
    return set;
  }, [entries, letters, cells]);

  function focusCell(key: string | undefined) {
    if (!key) return;
    steering.current = true;
    inputs.current.get(key)?.focus();
    steering.current = false;
  }

  /** Where typing should go in a word: first empty cell, else first wrong one. */
  function openCell(
    e: CrosswordEntry,
    map: Letters,
    lock: ReadonlySet<string>,
  ): string | undefined {
    const editable = keysOf(e).filter((k) => !lock.has(k));
    return (
      editable.find((k) => !map[k]) ??
      editable.find((k) => map[k] !== cells.get(k)!.solution) ??
      editable[0]
    );
  }

  function goToEntry(index: number, map: Letters = letters, lock = given) {
    setActive(index);
    focusCell(openCell(entries[index], map, lock));
  }

  function nextUnsolved(from: number, map: Letters): number | null {
    for (let step = 1; step <= entries.length; step++) {
      const i = (from + step) % entries.length;
      if (!isSolved(entries[i], map)) return i;
    }
    return null;
  }

  /** Saves the grid and decides where the cursor goes next. */
  function commit(
    next: Letters,
    from: string,
    lock: ReadonlySet<string> = given,
    helped = false,
  ) {
    setLetters(next);
    if (entries.every((e) => isSolved(e, next))) {
      recordGameResult(
        slips === 0 && helpLetters === 0 && revealedWords.size === 0 && !helped,
        topicResultId(GAME_ID, categoryId),
      );
      setElapsed(Date.now() - startedAt);
      return;
    }
    const keys = keysOf(activeEntry);
    if (!keys.every((k) => next[k])) {
      const after = keys.slice(keys.indexOf(from) + 1);
      focusCell(
        after.find((k) => !lock.has(k) && !next[k]) ??
          keys.find((k) => !lock.has(k) && !next[k]),
      );
      return;
    }
    if (isSolved(activeEntry, next)) {
      const done = entries.filter((e) => isSolved(e, next)).length;
      setAnnounce(`¡Bien! ${done} de ${entries.length} palabras.`);
      const target = nextUnsolved(active, next);
      if (target !== null) goToEntry(target, next, lock);
      return;
    }
    const bad = keys.filter((k) => next[k] !== cells.get(k)!.solution).length;
    setSlips((n) => n + 1);
    setAnnounce(
      bad === 1
        ? "Una letra no encaja: está marcada en rojo."
        : `${bad} letras no encajan: están marcadas en rojo.`,
    );
  }

  function selectCell(key: string, toggle: boolean) {
    const info = cells.get(key);
    if (!info) return;
    const sameDir = info[activeEntry.dir];
    const otherDir = info[activeEntry.dir === "across" ? "down" : "across"];
    if (toggle && otherDir !== undefined) setActive(otherDir);
    else if (sameDir !== undefined) setActive(sameDir);
    else if (otherDir !== undefined) setActive(otherDir);
  }

  function onType(key: string, raw: string) {
    const char = raw
      .slice(-1)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
    if (!char) {
      setLetters({ ...letters, [key]: "" });
      return;
    }
    if (!/^[A-Z0-9]$/.test(char)) return;
    setAnnounce("");
    commit({ ...letters, [key]: char }, key);
  }

  function onKeyDown(key: string, e: React.KeyboardEvent<HTMLInputElement>) {
    const [r, c] = key.split(",").map(Number);
    const moves: Record<string, [number, number, Direction]> = {
      ArrowRight: [0, 1, "across"],
      ArrowLeft: [0, -1, "across"],
      ArrowDown: [1, 0, "down"],
      ArrowUp: [-1, 0, "down"],
    };
    if (e.key === "Backspace") {
      e.preventDefault();
      if (letters[key]) {
        setLetters({ ...letters, [key]: "" });
        return;
      }
      const keys = keysOf(activeEntry);
      const prev = keys
        .slice(0, Math.max(keys.indexOf(key), 0))
        .reverse()
        .find((k) => !given.has(k));
      if (prev) {
        setLetters({ ...letters, [prev]: "" });
        focusCell(prev);
      }
      return;
    }
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    const [dr, dc, dir] = move;
    for (let k = 1; k < Math.max(rows, cols); k++) {
      const target = cellKey(r + dr * k, c + dc * k);
      const info = cells.get(target);
      if (!info || given.has(target)) continue;
      setActive(info[dir] ?? info.across ?? info.down!);
      focusCell(target);
      return;
    }
  }

  function giveLetter() {
    const key = openCell(activeEntry, letters, given);
    if (!key || given.has(key)) return;
    const lock = new Set(given).add(key);
    setGiven(lock);
    setHelpLetters((n) => n + 1);
    setAnnounce(`Pista: la letra ${cells.get(key)!.solution}.`);
    commit({ ...letters, [key]: cells.get(key)!.solution }, key, lock, true);
  }

  function revealWord() {
    const keys = keysOf(activeEntry);
    const lock = new Set([...given, ...keys]);
    const next = { ...letters };
    for (const k of keys) next[k] = cells.get(k)!.solution;
    setGiven(lock);
    setRevealedWords(new Set(revealedWords).add(activeEntry.id));
    commit(next, keys[keys.length - 1], lock, true);
    setAnnounce(`Revelada: ${activeEntry.answer}.`);
  }

  if (elapsed !== null) {
    const helps = revealedWords.size + helpLetters;
    const perfect = helps === 0 && slips === 0;
    const extras = [
      slips ? (slips === 1 ? "1 error" : `${slips} errores`) : "",
      helps ? (helps === 1 ? "1 ayuda" : `${helps} ayudas`) : "",
    ].filter(Boolean);
    return (
      <GameSummary
        title={
          perfect
            ? "¡Perfecto, sin errores!"
            : helps
              ? "¡Crucigrama completo!"
              : "¡Lo resolviste solo!"
        }
        pose={perfect ? "champion" : "silver"}
        detail={[
          `${entries.length} palabras`,
          formatElapsed(elapsed),
          ...extras,
        ].join(" · ")}
        onReplay={onReplay}
        onExit={onExit}
        perfect={perfect}
      >
        <ReviewList
          heading="Repasa las palabras"
          entries={entries.map((e) => ({
            id: e.id,
            title: e.name,
            body: e.definition,
            tone: revealedWords.has(e.id) ? "danger" : undefined,
          }))}
        />
      </GameSummary>
    );
  }

  const groups: Direction[] = ["across", "down"];
  const activeDone = solved[active];

  return (
    <div className="mt-6">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-4 text-sm font-semibold text-[var(--foreground-muted)]">
          <span>
            <span className="text-[var(--foreground)] tabular-nums">
              {solvedCount} de {entries.length}
            </span>{" "}
            palabras
          </span>
          <span className="text-xs font-normal">
            Las letras{" "}
            <span className="font-bold text-[var(--accent)]">de color</span> ya
            vienen de pista
          </span>
        </div>
        <ProgressBar
          value={solvedCount}
          max={entries.length}
          className="mt-2"
        />

        <Card
          variant="flat"
          padding="sm"
          className="sticky top-2 z-10 mt-4 flex items-center gap-1 shadow-[var(--shadow-raised)]"
        >
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            aria-label="Palabra anterior"
            onClick={() =>
              goToEntry((active - 1 + entries.length) % entries.length)
            }
          >
            <ChevronLeft className="size-5" aria-hidden />
          </Button>
          <div className="min-w-0 flex-1 px-1">
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[var(--accent)] uppercase">
              {activeDone ? <Check className="size-3.5" aria-hidden /> : null}
              {activeEntry.number} {DIR_LABEL[activeEntry.dir]} ·{" "}
              {activeEntry.answer.length} letras
            </p>
            <p className="mt-1 text-sm leading-snug text-[var(--foreground)] sm:text-base">
              {activeEntry.clue}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            aria-label="Palabra siguiente"
            onClick={() => goToEntry((active + 1) % entries.length)}
          >
            <ChevronRight className="size-5" aria-hidden />
          </Button>
        </Card>

        <div
          className="mx-auto mt-4 grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            maxWidth: `${cols * 3}rem`,
          }}
        >
          {Array.from({ length: rows * cols }, (_, i) => {
            const r = Math.floor(i / cols);
            const c = i % cols;
            const key = cellKey(r, c);
            const info = cells.get(key);
            if (!info)
              return <div key={key} aria-hidden className="aspect-square" />;
            const entry =
              entries[info[activeEntry.dir] ?? info.across ?? info.down!];
            const position =
              entryCells(entry).findIndex((x) => x.row === r && x.col === c) +
              1;
            const isWrong = wrong.has(key);
            const isDone =
              (info.across !== undefined && solved[info.across]) ||
              (info.down !== undefined && solved[info.down]);
            const isGiven = given.has(key);
            const tone = cn(
              "size-full rounded-md text-center text-base font-bold uppercase transition-colors sm:text-xl",
              isWrong
                ? "status-danger ring-2 ring-[var(--danger)] ring-inset"
                : activeKeys.has(key)
                  ? "bg-[var(--accent-soft)]"
                  : isDone
                    ? "status-success"
                    : "bg-[var(--surface-elevated)]",
              !isWrong && isGiven
                ? "text-[var(--accent)]"
                : "text-[var(--foreground)]",
            );
            return (
              <div key={key} className="relative aspect-square">
                {info.number ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-0.5 left-1 z-[1] text-[0.5625rem] leading-none font-semibold text-[var(--foreground-muted)] sm:text-[0.625rem]"
                  >
                    {info.number}
                  </span>
                ) : null}
                {isGiven ? (
                  <div
                    role="img"
                    aria-label={`Pista, ${entry.number} ${DIR_LABEL[entry.dir]}, letra ${position}: ${info.solution}`}
                    onClick={() => {
                      const index =
                        info[activeEntry.dir] ?? info.across ?? info.down!;
                      goToEntry(index);
                    }}
                    className={cn(
                      tone,
                      "flex cursor-pointer items-center justify-center",
                    )}
                  >
                    {info.solution}
                  </div>
                ) : (
                  <input
                    ref={(el) => {
                      if (el) inputs.current.set(key, el);
                      else inputs.current.delete(key);
                    }}
                    value={letters[key] ?? ""}
                    onChange={(e) => onType(key, e.target.value)}
                    onKeyDown={(e) => onKeyDown(key, e)}
                    onPointerDown={(e) => {
                      wasFocused.current =
                        document.activeElement === e.currentTarget;
                    }}
                    onFocus={(e) => {
                      e.target.select();
                      if (!steering.current && !activeKeys.has(key)) {
                        selectCell(key, false);
                      }
                    }}
                    onClick={() => {
                      if (wasFocused.current) selectCell(key, true);
                      wasFocused.current = false;
                    }}
                    inputMode="text"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    aria-label={`${entry.number} ${DIR_LABEL[entry.dir]}, letra ${position} de ${entry.answer.length}`}
                    aria-invalid={isWrong || undefined}
                    className={cn(
                      tone,
                      "caret-transparent outline-none focus:ring-2 focus:ring-[var(--accent)]",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {announce}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={giveLetter}
            disabled={activeDone}
          >
            <Lightbulb className="size-4" aria-hidden />
            Darme una letra
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={revealWord}
            disabled={activeDone}
          >
            <Eye className="size-4" aria-hidden />
            Revelar palabra
          </Button>
        </div>
        <p
          aria-hidden
          className="mt-2 min-h-5 text-center text-sm text-[var(--foreground-muted)]"
        >
          {announce}
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {groups.map((dir) => {
          const list = entries
            .map((e, index) => ({ e, index }))
            .filter(({ e }) => e.dir === dir);
          if (!list.length) return null;
          return (
            <section key={dir}>
              <h2 className="text-sm font-semibold text-[var(--foreground-muted)]">
                {dir === "across" ? "Horizontales" : "Verticales"}
              </h2>
              <ol className="mt-2 space-y-1">
                {list.map(({ e, index }) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => goToEntry(index)}
                      aria-current={index === active || undefined}
                      className={cn(
                        "flex w-full gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm leading-snug transition-colors",
                        index === active
                          ? "bg-[var(--accent-soft)] text-[var(--foreground)]"
                          : solved[index]
                            ? "text-[var(--foreground-muted)] opacity-70 hover:bg-[var(--surface-hover)]"
                            : "text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)]",
                        FOCUS_RING,
                      )}
                    >
                      <span className="w-5 shrink-0 font-semibold text-[var(--foreground)]">
                        {solved[index] ? (
                          <Check
                            className="mt-0.5 size-4 text-[var(--success-text)]"
                            aria-label="Resuelta"
                          />
                        ) : (
                          `${e.number}.`
                        )}
                      </span>
                      <span className={cn(solved[index] && "line-through")}>
                        {e.clue}{" "}
                        <span className="whitespace-nowrap text-[var(--foreground-muted)]">
                          ({e.answer.length})
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
