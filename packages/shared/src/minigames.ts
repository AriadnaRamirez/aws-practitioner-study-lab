/** Minijuegos: completion tags per user. Never part of study progress. */

export const MINIGAME_IDS = ['crucigrama', 'quien-se-encarga', 'cuanto-pagas'] as const;

export type MinigameId = (typeof MINIGAME_IDS)[number];

/** `completed` = finished without mistakes or help; it never goes back to `played`. */
export type MinigameStatus = 'played' | 'completed';

/** Keyed by result id: `<gameId>` or `<gameId>:<topicId>` for games played per topic. */
export type MinigameResults = Record<string, MinigameStatus>;

export interface RecordMinigameResultRequest {
  resultId: string;
  perfect: boolean;
}

export const MINIGAME_RESULT_ID_MAX_LENGTH = 80;

const TOPIC_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isMinigameResultId(value: string): boolean {
  if (value.length > MINIGAME_RESULT_ID_MAX_LENGTH) return false;
  const [gameId, topicId, ...rest] = value.split(':');
  if (rest.length > 0) return false;
  if (!(MINIGAME_IDS as readonly string[]).includes(gameId)) return false;
  return topicId === undefined || TOPIC_ID_PATTERN.test(topicId);
}
