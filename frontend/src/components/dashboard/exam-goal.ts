import {
  MASTERY_STREAK,
  STUDY_SIZES,
  type ProgressOverview,
  type UserExam,
} from "@aps/shared";
import { daysUntilExam } from "@/lib/exam-date";

/** Days kept free before the exam: the plan finishes the day before. */
const SLACK_DAYS = 1;
/** Accuracy floor so a rough start doesn't explode the answer estimate. */
const MIN_ACCURACY = 0.35;

export type ExamGoal =
  | { kind: "no-exam"; hadPastExam: boolean }
  | { kind: "mastered"; exam: UserExam; daysLeft: number }
  | { kind: "final-review"; exam: UserExam; daysLeft: number }
  | {
      kind: "pace";
      exam: UserExam;
      daysLeft: number;
      studyDays: number;
      /** Civil YYYY-MM-DD of the last study day; today counts as day 1. */
      targetDate: string;
      /** Cards to master per day, fixed for the whole day. */
      cardsPerDay: number;
      /** Rough answers per day needed to master `cardsPerDay`. */
      answersPerDay: number;
    };

function shiftCivilDate(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const shifted = new Date(Date.UTC(y, m - 1, d + days));
  return shifted.toISOString().slice(0, 10);
}

/** Each card needs MASTERY_STREAK correct answers in a row; misses add more. */
export function estimateAnswers(
  cards: number,
  accuracy: number | null,
): number {
  const hitRate = Math.min(Math.max(accuracy ?? 1, MIN_ACCURACY), 1);
  return Math.ceil((cards * MASTERY_STREAK) / hitRate);
}

/** Session size closest to the answers still needed today (at least 10). */
export function sessionSizeFor(answersNeeded: number): number {
  return STUDY_SIZES.reduce((best, size) =>
    Math.abs(size - answersNeeded) < Math.abs(best - answersNeeded)
      ? size
      : best,
  );
}

export function computeExamGoal(
  exams: UserExam[],
  overview: ProgressOverview,
  timeZone: string,
  now = new Date(),
): ExamGoal {
  const dated = exams
    .map((exam) => ({ exam, days: daysUntilExam(exam.examDate, now, timeZone) }))
    .filter((e) => !Number.isNaN(e.days));
  const next = dated
    .filter((e) => e.days >= 0)
    .sort((a, b) => a.days - b.days)[0];
  if (!next) {
    return { kind: "no-exam", hadPastExam: dated.some((e) => e.days < 0) };
  }

  const remaining = Math.max(
    overview.totalTrackableItems - overview.masteredItems,
    0,
  );
  if (remaining === 0) {
    return { kind: "mastered", exam: next.exam, daysLeft: next.days };
  }

  const studyDays = next.days - SLACK_DAYS;
  if (studyDays <= 0) {
    return { kind: "final-review", exam: next.exam, daysLeft: next.days };
  }

  // Cards mastered today still count toward today's quota, so the goal
  // doesn't shrink while the user plays.
  const remainingAtDayStart = remaining + overview.masteredToday;
  const cardsPerDay = Math.ceil(remainingAtDayStart / studyDays);
  return {
    kind: "pace",
    exam: next.exam,
    daysLeft: next.days,
    studyDays,
    targetDate: shiftCivilDate(next.exam.examDate, -SLACK_DAYS - 1),
    cardsPerDay,
    answersPerDay: estimateAnswers(cardsPerDay, overview.recentAccuracy),
  };
}
