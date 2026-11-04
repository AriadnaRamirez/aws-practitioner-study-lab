"use client";

import { useEffect, useState } from "react";
import {
  isMinigameResultId,
  type MinigameResults,
  type MinigameStatus,
} from "@aps/shared";
import {
  fetchMinigameResults,
  getStoredToken,
  getStoredUser,
  recordMinigameResult,
} from "@/lib/api";

/**
 * Per-user minigame tags, saved by the API so they follow the account across
 * devices. Deliberately separate from study progress: games never touch
 * mastery, streaks or Más falladas.
 */

/** "played" = finished with mistakes; "completed" = finished without any. */
export type GameStatus = MinigameStatus;

type GameResults = Readonly<MinigameResults>;

const listeners = new Set<(results: GameResults) => void>();

function publish(results: GameResults) {
  listeners.forEach((listener) => listener(results));
}

/** Tags this browser kept in localStorage before they lived in the database. */
const legacyImports = new Map<string, Promise<void>>();

async function importLegacyResults(userId: string) {
  const key = `aps_minigames_${userId}`;
  const raw = window.localStorage.getItem(key);
  if (raw === null) return;
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    /* unreadable: nothing worth importing */
  }
  const entries =
    parsed && typeof parsed === "object" ? Object.entries(parsed) : [];
  await Promise.all(
    entries
      .filter(
        ([id, status]) =>
          isMinigameResultId(id) &&
          (status === "played" || status === "completed"),
      )
      .map(([resultId, status]) =>
        recordMinigameResult({ resultId, perfect: status === "completed" }),
      ),
  );
  window.localStorage.removeItem(key);
}

async function loadResults(): Promise<GameResults> {
  const user = getStoredUser();
  if (user) {
    let pending = legacyImports.get(user.id);
    if (!pending) {
      pending = importLegacyResults(user.id).catch(() => {
        legacyImports.delete(user.id);
      });
      legacyImports.set(user.id, pending);
    }
    await pending;
  }
  return fetchMinigameResults();
}

/** Result id for games played per topic, like the crossword. */
export const topicResultId = (gameId: string, topicId: string) =>
  `${gameId}:${topicId}`;

/** Saves a finished game. A completed entry never goes back to played. */
export function recordGameResult(perfect: boolean, id: string) {
  if (!getStoredToken()) return;
  recordMinigameResult({ resultId: id, perfect }).then(publish, () => {
    /* offline or API down: the tag just won't update this time */
  });
}

/** Results for the signed-in user; empty until loaded to match the server render. */
export function useGameResults(): GameResults {
  const [results, setResults] = useState<GameResults>({});
  useEffect(() => {
    let active = true;
    const update = (next: GameResults) => {
      if (active) setResults(next);
    };
    listeners.add(update);
    if (getStoredToken()) {
      loadResults().then(update, () => {
        /* tags are optional decoration; the games work without them */
      });
    }
    return () => {
      active = false;
      listeners.delete(update);
    };
  }, []);
  return results;
}
