"use client";

import { useEffect, useState } from "react";
import { getStoredUser } from "@/lib/api";

/**
 * Per-user minigame results in localStorage. Deliberately separate from study
 * progress: games never touch mastery, streaks or Más falladas.
 */

/** "played" = finished with mistakes; "completed" = finished without any. */
export type GameStatus = "played" | "completed";

type GameResults = Readonly<Record<string, GameStatus>>;

const EVENT = "aps:minigames-progress";

function storageKey(): string | null {
  const user = getStoredUser();
  return user ? `aps_minigames_${user.id}` : null;
}

function readResults(): GameResults {
  const key = storageKey();
  if (!key) return {};
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(key) ?? "{}",
    );
    return parsed && typeof parsed === "object" ? (parsed as GameResults) : {};
  } catch {
    return {};
  }
}

/** Result id for games played per topic, like the crossword. */
export const topicResultId = (gameId: string, topicId: string) =>
  `${gameId}:${topicId}`;

/** Saves a finished game. A completed entry never goes back to played. */
export function recordGameResult(perfect: boolean, id: string) {
  const key = storageKey();
  if (!key) return;
  const next: Record<string, GameStatus> = { ...readResults() };
  if (next[id] !== "completed") next[id] = perfect ? "completed" : "played";
  try {
    window.localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* storage full or blocked: the badge just won't show */
  }
}

/** Results for the signed-in user; empty until mounted to match the server render. */
export function useGameResults(): GameResults {
  const [results, setResults] = useState<GameResults>({});
  useEffect(() => {
    const sync = () => setResults(readResults());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return results;
}
