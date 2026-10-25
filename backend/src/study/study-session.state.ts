import type { FlashVariant } from '@aps/shared';
import type { ExamChoicesTuple } from './flash-render';

export interface QueueEntry {
  queueItemId: string;
  itemId: string;
  variant: FlashVariant;
}

export interface CurrentPromptState {
  queueItemId: string;
  itemId: string;
  variant: FlashVariant;
  stem: string;
  choices: ExamChoicesTuple;
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface SessionRuntimeState {
  /** Remaining appearances (front = next). */
  queue: QueueEntry[];
  current: CurrentPromptState | null;
  masteredItemIds: string[];
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
    };
  } catch {
    return { queue: [], current: null, masteredItemIds: [] };
  }
}

export function serializeState(state: SessionRuntimeState): string {
  return JSON.stringify(state);
}
