import { DEFAULT_TRACK_ID, type ExamQuestion } from '@aps/shared';
import { AWS_GUIDE_CONCEPTS, AWS_GUIDE_QUESTIONS } from './aws-guide.data';

const now = '2026-10-28T12:00:00.000Z';

/** Practice questions from the AWS study guide; its concepts only map each question to a topic. */
export function buildAwsGuideQuestions(): ExamQuestion[] {
  const topicByConcept = new Map(
    AWS_GUIDE_CONCEPTS.map((c) => [c.key, c.topicId]),
  );
  return AWS_GUIDE_QUESTIONS.map((q) => {
    const topicId = topicByConcept.get(q.conceptKey);
    if (!topicId) {
      throw new Error(
        `Guide question ${q.number}: unknown concept ${q.conceptKey}`,
      );
    }
    const number = String(q.number).padStart(3, '0');
    return {
      id: `eq-guide-${number}`,
      topicId,
      trackId: DEFAULT_TRACK_ID,
      stem: q.stem,
      choices: [...q.choices],
      correctIndex: q.correctIndex,
      explanation: q.optionExplanations
        .map((text, i) => `${'ABCD'[i]}. ${text}`)
        .join('\n'),
      status: 'published' as const,
      externalKey: `guide.q.${number}`,
      createdAt: now,
      updatedAt: now,
    };
  });
}
