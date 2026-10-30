/**
 * Dev-only: fictional students plus a full `demo` account (progress, weak
 * cards, sessions and history) so the app is not empty. Safe to re-run.
 *
 *   npm run prisma:seed:podium -w @aps/backend
 */
import {
  ContentStatus,
  PrismaClient,
  Role,
  StudyItemType,
  StudyMode,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { DEFAULT_TRACK_ID } from '@aps/shared';
import { syncLegacyExamFromUser } from '../src/user-exams/exam-date.util';

const prisma = new PrismaClient();

const TIMEZONE = 'America/Mexico_City';
const DAY_MS = 24 * 60 * 60 * 1000;

type DemoStudent = {
  username: string;
  /** Concepts mastered in total. */
  mastered: number;
  /** How many of those were mastered in the last 7 days. */
  masteredThisWeek: number;
  /** Concepts started but not mastered yet (1–2 correct in a row). */
  inProgress: number;
  /** Concepts with misses (feed "Más falladas"). */
  weak: number;
  streak: { current: number; longest: number; lastStudyDaysAgo: number };
  examInDays: number | null;
  podiumHidden?: boolean;
};

const STUDENTS: DemoStudent[] = [
  {
    username: 'sofia',
    mastered: 30,
    masteredThisWeek: 4,
    inProgress: 2,
    weak: 2,
    streak: { current: 14, longest: 14, lastStudyDaysAgo: 0 },
    examInDays: 9,
  },
  {
    username: 'diego',
    mastered: 24,
    masteredThisWeek: 15,
    inProgress: 4,
    weak: 3,
    streak: { current: 6, longest: 9, lastStudyDaysAgo: 0 },
    examInDays: 16,
  },
  {
    username: 'valeria',
    mastered: 19,
    masteredThisWeek: 9,
    inProgress: 5,
    weak: 4,
    streak: { current: 3, longest: 7, lastStudyDaysAgo: 1 },
    examInDays: 30,
  },
  {
    username: 'mateo',
    mastered: 12,
    masteredThisWeek: 2,
    inProgress: 6,
    weak: 5,
    streak: { current: 1, longest: 4, lastStudyDaysAgo: 0 },
    examInDays: 45,
  },
  {
    username: 'camila',
    mastered: 7,
    masteredThisWeek: 0,
    inProgress: 3,
    weak: 6,
    streak: { current: 0, longest: 6, lastStudyDaysAgo: 9 },
    examInDays: null,
  },
  {
    username: 'leo',
    mastered: 3,
    masteredThisWeek: 3,
    inProgress: 4,
    weak: 1,
    streak: { current: 2, longest: 2, lastStudyDaysAgo: 0 },
    examInDays: 60,
  },
  {
    username: 'andrea',
    mastered: 28,
    masteredThisWeek: 6,
    inProgress: 2,
    weak: 1,
    streak: { current: 21, longest: 21, lastStudyDaysAgo: 0 },
    examInDays: 5,
    podiumHidden: true,
  },
];

/** Deterministic shuffle so re-runs pick the same concepts per user. */
function shuffled<T>(items: T[], seedText: string): T[] {
  let seed = [...seedText].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function civilDate(daysAgo: number): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(Date.now() - daysAgo * DAY_MS));
}

function examDate(inDays: number | null): Date | null {
  if (inDays == null) return null;
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + inDays);
  d.setUTCHours(12, 0, 0, 0);
  return d;
}

/** Mastery timestamps: `recent` within the last 7 days, the rest 8–40 days ago. */
function masteredDates(total: number, recent: number): Date[] {
  const now = Date.now();
  return Array.from({ length: total }, (_, i) => {
    const daysAgo = i < recent ? (i % 6) + 0.5 : 8 + ((i * 3) % 32);
    return new Date(now - daysAgo * DAY_MS);
  });
}

async function main() {
  const password = process.env.DEMO_PASSWORD ?? 'StudyPass1!';
  const passwordHash = await bcrypt.hash(password, 12);
  const classmates: { id: string; username: string }[] = [];

  const knowledge = await prisma.knowledgeItem.findMany({
    where: { status: ContentStatus.published, trackId: DEFAULT_TRACK_ID },
    select: { id: true },
    orderBy: { id: 'asc' },
  });
  const ids = knowledge.map((k) => k.id);

  for (const s of STUDENTS) {
    const needed = s.mastered + s.inProgress + s.weak;
    if (needed > ids.length) {
      throw new Error(
        `${s.username} needs ${needed} concepts but only ${ids.length} are published`,
      );
    }

    // Existing exam dates are user data: only new demo users get one.
    const user = await prisma.user.upsert({
      where: { email: `${s.username}@example.com` },
      update: {
        username: s.username,
        passwordHash,
        role: Role.STUDENT,
        timezone: TIMEZONE,
        podiumHidden: s.podiumHidden ?? false,
        bannedAt: null,
      },
      create: {
        email: `${s.username}@example.com`,
        username: s.username,
        passwordHash,
        role: Role.STUDENT,
        timezone: TIMEZONE,
        examDate: examDate(s.examInDays),
        podiumHidden: s.podiumHidden ?? false,
      },
    });
    await syncLegacyExamFromUser(prisma, user.id, user.examDate);
    classmates.push({ id: user.id, username: s.username });

    const picked = shuffled(ids, s.username);
    const masteredIds = picked.slice(0, s.mastered);
    const inProgressIds = picked.slice(s.mastered, s.mastered + s.inProgress);
    const weakIds = picked.slice(s.mastered + s.inProgress, needed);
    const dates = masteredDates(s.mastered, s.masteredThisWeek);

    await prisma.itemProgress.deleteMany({ where: { userId: user.id } });
    await prisma.itemProgress.createMany({
      data: [
        ...masteredIds.map((itemId, i) => ({
          userId: user.id,
          itemType: 'KNOWLEDGE' as const,
          itemId,
          consecutiveCorrect: 3,
          passCount: 3 + (i % 3),
          failCount: i % 4 === 0 ? 1 : 0,
          masteredAt: dates[i],
        })),
        ...inProgressIds.map((itemId, i) => ({
          userId: user.id,
          itemType: 'KNOWLEDGE' as const,
          itemId,
          consecutiveCorrect: 1 + (i % 2),
          passCount: 1 + (i % 2),
          failCount: 0,
        })),
        ...weakIds.map((itemId, i) => ({
          userId: user.id,
          itemType: 'KNOWLEDGE' as const,
          itemId,
          consecutiveCorrect: 0,
          passCount: i % 2,
          failCount: 2 + (i % 3),
        })),
      ],
    });

    const streak = {
      current: s.streak.current,
      longest: s.streak.longest,
      lastStudyDate: civilDate(s.streak.lastStudyDaysAgo),
    };
    await prisma.dailyStreak.upsert({
      where: { userId: user.id },
      update: streak,
      create: { userId: user.id, ...streak },
    });
  }

  await seedClassmateSessions(classmates);
  await seedDemoShowcase();

  // eslint-disable-next-line no-console
  console.log(
    `Demo podium OK: ${STUDENTS.map((s) => `${s.username}(${s.mastered})`).join(', ')} / ${password}`,
  );
  // eslint-disable-next-line no-console
  console.log(`Demo showcase OK: demo / ${password}`);
}

function hoursAgo(hours: number): Date {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * DAY_MS);
}

function firstText(value: unknown): string | null {
  if (!Array.isArray(value)) return null;
  const text = value.find((entry) => typeof entry === 'string' && entry.trim());
  return typeof text === 'string' ? text.trim() : null;
}

/** Finished sessions so the admin charts are not a single empty week. */
async function seedClassmateSessions(
  users: { id: string; username: string }[],
) {
  const ids = users.map((u) => u.id);
  if (!ids.length) return;
  await prisma.studySession.deleteMany({ where: { userId: { in: ids } } });

  const rows = users.flatMap((user, index) =>
    [0, 2, 6].map((days, sessionIndex) => {
      const answered = 8 + ((index + sessionIndex) % 5);
      const correct = Math.max(4, answered - ((index + sessionIndex) % 3));
      const startedAt = daysAgo(days + index * 0.15);
      return {
        userId: user.id,
        mode: sessionIndex === 1 ? StudyMode.WEAK_REVIEW : StudyMode.FLASH_STUDY,
        size: answered,
        timezone: TIMEZONE,
        scopeJson: '[]',
        stateJson: '{}',
        startedAt,
        endedAt: new Date(startedAt.getTime() + 12 * 60 * 1000),
        answeredCount: answered,
        correctCount: correct,
        uniqueItems: answered,
        maxSessionStreak: 3 + (sessionIndex % 4),
        sessionStreak: 2,
      };
    }),
  );
  await prisma.studySession.createMany({ data: rows });
}

/**
 * The account you actually log into (`demo`) gets every state the UI can show:
 * countdown, streak, today's answers, weak cards, mix-ups, and history.
 */
async function seedDemoShowcase() {
  const user = await prisma.user.findUnique({
    where: { email: 'demo@example.com' },
  });
  if (!user) {
    throw new Error('Falta el usuario demo. Corre primero npm run db:seed');
  }

  const exam = user.examDate ?? examDate(23);
  await prisma.user.update({
    where: { id: user.id },
    data: { timezone: TIMEZONE, examDate: exam, podiumHidden: false },
  });
  await syncLegacyExamFromUser(prisma, user.id, exam);

  await prisma.studySession.deleteMany({ where: { userId: user.id } });
  await prisma.itemProgress.deleteMany({ where: { userId: user.id } });

  const knowledge = await prisma.knowledgeItem.findMany({
    where: { status: ContentStatus.published, trackId: DEFAULT_TRACK_ID },
    select: { id: true, topicId: true, distractors: true },
    orderBy: { id: 'asc' },
  });
  const byTopic = new Map<string, typeof knowledge>();
  for (const item of knowledge) {
    const list = byTopic.get(item.topicId) ?? [];
    list.push(item);
    byTopic.set(item.topicId, list);
  }
  const topics = [...byTopic.values()].sort((a, b) => b.length - a.length);
  const take = (bucket: typeof knowledge, count: number) => bucket.splice(0, count);
  const hard = take(topics[0] ?? [], 4);
  const almost = take(topics[1] ?? [], 2);
  const forgotten = take(topics[2] ?? [], 1);
  const rest = topics.flat();
  const masteredToday = take(rest, 2);
  const mastered = take(rest, 16);
  const started = take(rest, 4);

  const questions = await prisma.examQuestion.findMany({
    where: { status: ContentStatus.published, trackId: DEFAULT_TRACK_ID },
    select: { id: true, choices: true, correctIndex: true },
    orderBy: { id: 'asc' },
    take: 2,
  });

  if (hard.length < 2 || almost.length < 1 || forgotten.length < 1) {
    throw new Error('No hay suficiente contenido publicado para el showcase');
  }

  const weakWrong = new Map<string, string>();
  for (const item of [...hard, ...almost, ...forgotten]) {
    const wrong = firstText(item.distractors);
    if (wrong) weakWrong.set(item.id, wrong);
  }

  await prisma.itemProgress.createMany({
    data: [
      ...hard.map((item, i) => ({
        userId: user.id,
        itemType: StudyItemType.KNOWLEDGE,
        itemId: item.id,
        consecutiveCorrect: 0,
        passCount: i % 2,
        failCount: 6 - i,
      })),
      ...almost.map((item) => ({
        userId: user.id,
        itemType: StudyItemType.KNOWLEDGE,
        itemId: item.id,
        consecutiveCorrect: 2,
        passCount: 2,
        failCount: 3,
      })),
      ...forgotten.map((item) => ({
        userId: user.id,
        itemType: StudyItemType.KNOWLEDGE,
        itemId: item.id,
        consecutiveCorrect: 0,
        passCount: 3,
        failCount: 2,
        masteredAt: daysAgo(18),
      })),
      ...masteredToday.map((item) => ({
        userId: user.id,
        itemType: StudyItemType.KNOWLEDGE,
        itemId: item.id,
        consecutiveCorrect: 3,
        passCount: 3,
        failCount: 1,
        masteredAt: hoursAgo(3),
      })),
      ...mastered.map((item, i) => ({
        userId: user.id,
        itemType: StudyItemType.KNOWLEDGE,
        itemId: item.id,
        consecutiveCorrect: 3,
        passCount: 3 + (i % 2),
        failCount: i < 4 ? 1 : 0,
        masteredAt: daysAgo(3 + (i % 20)),
      })),
      ...started.map((item, i) => ({
        userId: user.id,
        itemType: StudyItemType.KNOWLEDGE,
        itemId: item.id,
        consecutiveCorrect: 1,
        passCount: 1,
        failCount: 0,
      })),
      ...questions.map((item, i) => ({
        userId: user.id,
        itemType: StudyItemType.EXAM_QUESTION,
        itemId: item.id,
        consecutiveCorrect: i === 0 ? 0 : 2,
        passCount: i,
        failCount: 4 - i,
      })),
    ],
  });

  const streak = {
    current: 5,
    longest: 8,
    lastStudyDate: civilDate(0),
  };
  await prisma.dailyStreak.upsert({
    where: { userId: user.id },
    update: streak,
    create: { userId: user.id, ...streak },
  });

  const sessions = [
    { days: 0, hours: 2, mode: StudyMode.FLASH_STUDY, size: 12, correct: 9, streak: 4 },
    { days: 1, hours: 26, mode: StudyMode.WEAK_REVIEW, size: 8, correct: 5, streak: 3 },
    { days: 4, hours: 96, mode: StudyMode.FLASH_STUDY, size: 10, correct: 7, streak: 5 },
    { days: 9, hours: 220, mode: StudyMode.EXAM_STUDY, size: 15, correct: 11, streak: 4 },
  ] as const;

  const practiceIds = [
    ...hard,
    ...almost,
    ...forgotten,
    ...masteredToday,
    ...mastered.slice(0, 6),
  ].map((item) => item.id);

  for (const plan of sessions) {
    const startedAt = hoursAgo(plan.hours);
    const queue = practiceIds.slice(0, plan.size).map((itemId) => ({
      itemType: 'KNOWLEDGE' as const,
      itemId,
    }));
    const created = await prisma.studySession.create({
      data: {
        userId: user.id,
        mode: plan.mode,
        size: plan.size,
        timezone: TIMEZONE,
        scopeJson: JSON.stringify(queue),
        stateJson: '{}',
        startedAt,
        endedAt: new Date(startedAt.getTime() + 14 * 60 * 1000),
        answeredCount: plan.size,
        correctCount: plan.correct,
        uniqueItems: plan.size,
        maxSessionStreak: plan.streak,
        sessionStreak: plan.streak,
      },
    });
    await prisma.studySession.update({
      where: { id: created.id },
      data: {
        summaryJson: JSON.stringify({
          sessionId: created.id,
          mode: plan.mode,
          uniqueItems: plan.size,
          answered: plan.size,
          correctAnswers: plan.correct,
          incorrectAnswers: plan.size - plan.correct,
          missRepeats: 0,
          maxSessionStreak: plan.streak,
          accuracyPct: Math.round((plan.correct / plan.size) * 100),
          dailyStreak: 5,
          longestDailyStreak: 8,
        }),
      },
    });

    const attempts = queue.map((item, i) => {
      const wrong = weakWrong.get(item.itemId);
      const missed = i >= plan.correct && Boolean(wrong);
      return {
        sessionId: created.id,
        userId: user.id,
        itemType: StudyItemType.KNOWLEDGE,
        itemId: item.itemId,
        correct: !missed,
        latencyMs: 2500 + i * 180,
        variant: missed ? 'DEFINITION_TO_NAME' : 'NAME_TO_DEFINITION',
        choiceIndex: missed ? 1 : 0,
        chosenText: missed ? wrong! : null,
        createdAt: new Date(startedAt.getTime() + i * 40_000),
      };
    });
    if (attempts.length) await prisma.attempt.createMany({ data: attempts });
  }

  const latest = await prisma.studySession.findFirst({
    where: { userId: user.id },
    orderBy: { startedAt: 'desc' },
  });
  if (latest) {
    const repeats = hard.flatMap((item, index) => {
      const wrong = weakWrong.get(item.id);
      if (!wrong) return [];
      const times = index === 0 ? [5, 30, 50] : [8 + index, 40 + index];
      return times.map((hours) => ({
        sessionId: latest.id,
        userId: user.id,
        itemType: StudyItemType.KNOWLEDGE,
        itemId: item.id,
        correct: false,
        latencyMs: 5100,
        variant: 'DEFINITION_TO_NAME',
        choiceIndex: 2,
        chosenText: wrong,
        createdAt: hoursAgo(hours),
      }));
    });
    if (repeats.length) await prisma.attempt.createMany({ data: repeats });
  }

  for (const question of questions) {
    const choices = Array.isArray(question.choices) ? question.choices : [];
    const wrong = choices.find(
      (choice, index) =>
        index !== question.correctIndex && typeof choice === 'string' && choice.trim(),
    );
    if (typeof wrong !== 'string') continue;
    const host = await prisma.studySession.findFirst({
      where: { userId: user.id, mode: StudyMode.EXAM_STUDY },
    });
    if (!host) continue;
    await prisma.attempt.create({
      data: {
        sessionId: host.id,
        userId: user.id,
        itemType: StudyItemType.EXAM_QUESTION,
        itemId: question.id,
        correct: false,
        latencyMs: 8000,
        choiceIndex: (question.correctIndex + 1) % 4,
        chosenText: wrong,
        createdAt: hoursAgo(question.correctIndex === 0 ? 20 : 70),
      },
    });
  }

  const guests = await prisma.guestProbe.count();
  if (guests === 0) {
    await prisma.guestProbe.createMany({
      data: [
        { sessionsCount: 1, createdAt: daysAgo(1) },
        { sessionsCount: 3, createdAt: daysAgo(4) },
        { sessionsCount: 2, createdAt: daysAgo(8), convertedUserId: user.id },
      ],
    });
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
