"use client";

import { useMemo, useRef, useState } from "react";
import {
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  Lightbulb,
} from "lucide-react";
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
  crosswordCountLabel,
  crosswordTopics,
  entryCells,
  HINT_LETTERS,
  hintCells,
  hyphenCells,
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
      subtitle="Escribe el nombre, en inglés si así se llama. Sin acentos. Hay 4 letras de pista, y el guion de las dos palabras ya está."
      options={categories.map((c) => ({
        id: c.category.id,
        title: c.category.title,
        description: `${c.category.subtitle} · ${c.items.length} palabras`,
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

  /** Hyphens between words, plus a few hint letters, come filled in. */
  const hyphens = useMemo(() => hyphenCells(entries), [entries]);
  const hints = useMemo(() => hintCells(entries), [entries]);
  const opened = useMemo(() => {
    const set = new Set(hyphens);
    for (const key of hints) set.add(key);
    return set;
  }, [hyphens, hints]);
  /** Cells you can no longer type in: hyphens, hints, letters given, words already right. */
  const [locked, setLocked] = useState<ReadonlySet<string>>(opened);
  /** Hint letters and letters from help, drawn in accent so you can tell them apart. */
  const [helped, setHelped] = useState<ReadonlySet<string>>(hints);
  /** Cells a check marked as not fitting; typing over one clears it. */
  const [checked, setChecked] = useState<ReadonlySet<string>>(new Set());
  const [letters, setLetters] = useState<Letters>(() =>
    Object.fromEntries(
      [...opened].map((k) => [k, cells.get(k)!.solution] as const),
    ),
  );
  const [active, setActive] = useState(0);
  const [revealedWords, setRevealedWords] = useState<ReadonlySet<string>>(
    new Set(),
  );
  /** Entry whose second wording is on screen. */
  const [rephrased, setRephrased] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [helpLetters, setHelpLetters] = useState(0);
  /** Wrong letters found, by a check or by finishing a word; rules out "completed". */
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

  /** Red only where a check (or a finished word) found a letter that doesn't fit. */
  const wrong = useMemo(() => {
    const set = new Set<string>();
    for (const k of checked) {
      if (letters[k] && letters[k] !== cells.get(k)!.solution) set.add(k);
    }
    return set;
  }, [checked, letters, cells]);

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

  function goToEntry(index: number, map: Letters = letters, lock = locked) {
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

  /**
   * Saves the grid, locks every word that is now right so a crossing can't be
   * erased by accident, and decides where the cursor goes next.
   */
  function commit(
    next: Letters,
    from: string,
    base: ReadonlySet<string> = locked,
    usedHelp = false,
  ) {
    const lock = new Set(base);
    for (const e of entries) {
      if (isSolved(e, next)) for (const k of keysOf(e)) lock.add(k);
    }
    setLetters(next);
    setLocked(lock);

    if (entries.every((e) => isSolved(e, next))) {
      recordGameResult(
        slips === 0 &&
          helpLetters === 0 &&
          revealedWords.size === 0 &&
          !usedHelp,
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
    const bad = keys.filter((k) => next[k] !== cells.get(k)!.solution);
    setChecked((marks) => new Set([...marks, ...bad]));
    setSlips((n) => n + 1);
    setAnnounce(
      bad.length === 1
        ? "Una letra no encaja: está marcada en rojo."
        : `${bad.length} letras no encajan: están marcadas en rojo.`,
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

  /** A cell you type over is no longer flagged. */
  function unflag(key: string) {
    setChecked((marks) => {
      if (!marks.has(key)) return marks;
      const next = new Set(marks);
      next.delete(key);
      return next;
    });
  }

  function onType(key: string, raw: string) {
    const char = raw
      .slice(-1)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
    unflag(key);
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
        unflag(key);
        setLetters({ ...letters, [key]: "" });
        return;
      }
      const keys = keysOf(activeEntry);
      const prev = keys
        .slice(0, Math.max(keys.indexOf(key), 0))
        .reverse()
        .find((k) => !locked.has(k));
      if (prev) {
        unflag(prev);
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
      if (!info || locked.has(target)) continue;
      setActive(info[dir] ?? info.across ?? info.down!);
      focusCell(target);
      return;
    }
  }

  /** Says whether what you wrote fits, without showing the answer. */
  function checkWord() {
    const keys = keysOf(activeEntry);
    const written = keys.filter((k) => letters[k] && !locked.has(k));
    if (!written.length) {
      setAnnounce("Todavía no has escrito nada en esta palabra.");
      return;
    }
    const bad = written.filter((k) => letters[k] !== cells.get(k)!.solution);
    if (!bad.length) {
      setAnnounce(
        written.length === keys.length
          ? "Todo encaja."
          : "Hasta aquí todo encaja: sigue.",
      );
      return;
    }
    if (bad.some((k) => !checked.has(k))) setSlips((n) => n + 1);
    setChecked((marks) => new Set([...marks, ...bad]));
    setAnnounce(
      bad.length === 1
        ? "Una letra no encaja: está marcada en rojo."
        : `${bad.length} letras no encajan: están marcadas en rojo.`,
    );
    focusCell(bad[0]);
  }

  function giveLetter() {
    const key = openCell(activeEntry, letters, locked);
    if (!key || locked.has(key)) return;
    const lock = new Set(locked).add(key);
    setLocked(lock);
    setHelped((set) => new Set(set).add(key));
    setHelpLetters((n) => n + 1);
    unflag(key);
    setAnnounce(`Te damos la letra ${cells.get(key)!.solution}.`);
    commit({ ...letters, [key]: cells.get(key)!.solution }, key, lock, true);
  }

  function revealWord() {
    const keys = keysOf(activeEntry);
    const lock = new Set([...locked, ...keys]);
    const next = { ...letters };
    for (const k of keys) next[k] = cells.get(k)!.solution;
    setLocked(lock);
    setHelped((set) => new Set([...set, ...keys]));
    setChecked((marks) => new Set([...marks].filter((k) => !keys.includes(k))));
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
            body: e.clue,
            tone: revealedWords.has(e.id) ? "danger" : undefined,
          }))}
        />
      </GameSummary>
    );
  }

  const groups: Direction[] = ["across", "down"];
  const activeDone = solved[active];
  const activeRevealed = revealedWords.has(activeEntry.id);

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
            {Math.min(HINT_LETTERS, hints.size)} letras de pista. Las que
            aciertas se quedan fijas
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
              {activeRevealed ? (
                <Eye className="size-3.5" aria-hidden />
              ) : activeDone ? (
                <Check className="size-3.5" aria-hidden />
              ) : null}
              {activeEntry.number} {DIR_LABEL[activeEntry.dir]} ·{" "}
              {crosswordCountLabel(activeEntry.answer)}
              {activeRevealed ? " · revelada" : ""}
            </p>
            <p className="mt-1 text-sm leading-snug text-[var(--foreground)] sm:text-base">
              {activeEntry.clue}
            </p>
            {activeEntry.another && !activeDone ? (
              rephrased === activeEntry.id ? (
                <p className="mt-1.5 text-sm leading-snug text-[var(--foreground-muted)]">
                  {activeEntry.another}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setRephrased(activeEntry.id)}
                  className={cn(
                    "mt-1 rounded-sm text-xs font-semibold text-[var(--accent)] underline-offset-4 hover:underline",
                    FOCUS_RING,
                  )}
                >
                  Dímelo de otra forma
                </button>
              )
            ) : null}
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
            const isHyphen = info.solution === "-";
            const isLocked = locked.has(key);
            const isHelped = helped.has(key);
            const tone = cn(
              "size-full rounded-md text-center text-base font-bold uppercase transition-colors sm:text-xl",
              isWrong
                ? "status-danger ring-2 ring-[var(--danger)] ring-inset"
                : activeKeys.has(key)
                  ? "bg-[var(--accent-soft)]"
                  : isDone
                    ? "status-success"
                    : "bg-[var(--surface-elevated)]",
              isWrong
                ? "text-[var(--foreground)]"
                : isHelped
                  ? "text-[var(--accent)]"
                  : isHyphen
                    ? "text-[var(--foreground-muted)]"
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
                {isLocked ? (
                  <div
                    role="img"
                    aria-label={
                      isHyphen
                        ? `Guion entre palabras, ${entry.number} ${DIR_LABEL[entry.dir]}`
                        : isHelped
                          ? `Letra dada, ${entry.number} ${DIR_LABEL[entry.dir]}, letra ${position}: ${info.solution}`
                          : `${entry.number} ${DIR_LABEL[entry.dir]}, letra ${position}: ${info.solution}, ya correcta`
                    }
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
        <div className="mt-5 flex flex-wrap justify-center gap-2 sm:gap-3">
          <Button size="sm" onClick={checkWord} disabled={activeDone}>
            <CheckCheck className="size-4" aria-hidden />
            Revisar
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={giveLetter}
            disabled={activeDone}
          >
            <Lightbulb className="size-4" aria-hidden />
            Una letra
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={revealWord}
            disabled={activeDone}
          >
            <Eye className="size-4" aria-hidden />
            Revelar
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-[var(--foreground-muted)]">
          Revisar marca en rojo lo que está mal. No te muestra la respuesta.
        </p>
        <p
          aria-hidden
          className="mt-2 min-h-5 text-center text-sm text-[var(--foreground-muted)]"
        >
          {announce}
        </p>
      </div>

      <Button
        variant="secondary"
        size="sm"
        className="mx-auto mt-8 flex sm:hidden"
        aria-expanded={listOpen}
        onClick={() => setListOpen((open) => !open)}
      >
        {listOpen ? "Ocultar las pistas" : `Ver las ${entries.length} pistas`}
      </Button>

      <div
        className={cn(
          "mt-4 gap-6 sm:mt-8 sm:grid sm:grid-cols-2",
          listOpen ? "grid" : "hidden",
        )}
      >
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
                        {revealedWords.has(e.id) ? (
                          <Eye
                            className="mt-0.5 size-4 text-[var(--foreground-muted)]"
                            aria-label="Revelada"
                          />
                        ) : solved[index] ? (
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
                          ({crosswordCountLabel(e.answer)})
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
