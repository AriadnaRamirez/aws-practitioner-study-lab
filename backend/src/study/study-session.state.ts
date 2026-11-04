import type { FlashVariant, StudySessionScope } from '@aps/shared';
import type { ExamChoicesTuple } from './flash-render';
import { parseLedger, type MissLedger } from './miss-ledger';

export interface QueueEntry {
  queueItemId: string;
  itemId: string;
  variant: FlashVariant;
  /** Miss-repeat of a card failed earlier in this session. */
  repeat?: boolean;
}

export interface CurrentPromptState {
  queueItemId: string;
  itemId: string;
  variant: FlashVariant;
  stem: string;
  choices: ExamChoicesTuple;
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  repeat?: boolean;
}

export interface SessionRuntimeState {
  /** Remaining appearances (front = next). */
  queue: QueueEntry[];
  current: CurrentPromptState | null;
  masteredItemIds: string[];
  /** Partida rápida: cards were spread evenly across the scope topics. */
  balanced?: boolean;
  ledger?: MissLedger;
}

export function parseState(raw: string): SessionRuntimeState {
  try {
    const parsed = JSON.parse(raw) as Partial<SessionRuntimeState>;
    return {
      queue: Array.isArray(parsed.queue) ? parsed.queue : [],
      current: parsed.current ?? null,
      masteredItemIds: Array.isArray(parsed.masteredItemIds)
        ? parsed.masteredItemIds
        : [],
      ...(parsed.balanced === true ? { balanced: true } : {}),
      ledger: parseLedger(parsed.ledger),
    };
  } catch {
    return { queue: [], current: null, masteredItemIds: [], ledger: parseLedger(null) };
  }
}

/** FLASH_STUDY scope: topic ids from `scopeJson` (string[]) + balanced flag. */
export function flashScopeOf(
  scopeJson: string,
  state: Pick<SessionRuntimeState, 'balanced'>,
): StudySessionScope {
  let topicIds: string[] = [];
  try {
    const parsed = JSON.parse(scopeJson) as unknown;
    if (Array.isArray(parsed)) {
      topicIds = parsed.filter((id): id is string => typeof id === 'string');
    }
  } catch {
    /* legacy / malformed scope → whole bank */
  }
  return { topicIds, balanced: state.balanced === true };
}

export function serializeState(state: SessionRuntimeState): string {
  return JSON.stringify(state);
}
