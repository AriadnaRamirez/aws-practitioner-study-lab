/**
 * Dev-only: fictional students with mastered concepts and streaks so the
 * podium, streaks and mastery % have something to show. Safe to re-run:
 * it rewrites progress only for these users.
 *
 *   npm run prisma:seed:podium -w @aps/backend
 */
import { ContentStatus, PrismaClient, Role } from '@prisma/client';
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

  // eslint-disable-next-line no-console
  console.log(
    `Demo podium OK: ${STUDENTS.map((s) => `${s.username}(${s.mastered})`).join(', ')} / ${password}`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
