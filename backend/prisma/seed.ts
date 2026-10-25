import {
  ContentStatus,
  PrismaClient,
  Role,
  TopicType,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  buildSeedKnowledge,
  buildSeedQuestions,
  buildSeedTopics,
} from '../src/content/content.seed';

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL ?? 'admin@example.com')
    .trim()
    .toLowerCase();
  const username = (process.env.ADMIN_USERNAME ?? 'admin').trim();
  const password = process.env.ADMIN_PASSWORD ?? 'ChangeMeAdmin1!';
  const timezone = process.env.ADMIN_TIMEZONE ?? 'America/Mexico_City';

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      username,
      passwordHash,
      role: Role.ADMIN,
      timezone,
    },
    create: {
      email,
      username,
      passwordHash,
      role: Role.ADMIN,
      timezone,
    },
  });

  // eslint-disable-next-line no-console
  console.log(`Admin seed OK: ${admin.email} / ${admin.username} (${admin.role})`);
}

async function seedContent() {
  const topics = buildSeedTopics();
  for (const t of topics) {
    await prisma.topic.upsert({
      where: { id: t.id },
      update: {
        trackId: t.trackId,
        type: t.type as TopicType,
        name: t.name,
        parentId: t.parentId ?? null,
        sortOrder: t.sortOrder,
      },
      create: {
        id: t.id,
        trackId: t.trackId,
        type: t.type as TopicType,
        name: t.name,
        parentId: t.parentId ?? null,
        sortOrder: t.sortOrder,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      },
    });
  }

  const knowledge = buildSeedKnowledge();
  for (const k of knowledge) {
    await prisma.knowledgeItem.upsert({
      where: { id: k.id },
      update: {
        topicId: k.topicId,
        trackId: k.trackId,
        name: k.name,
        definition: k.definition,
        distractors: k.distractors,
        explanation: k.explanation,
        allowedVariants: k.allowedVariants,
        status: k.status as ContentStatus,
        externalKey: k.externalKey ?? null,
      },
      create: {
        id: k.id,
        topicId: k.topicId,
        trackId: k.trackId,
        name: k.name,
        definition: k.definition,
        distractors: k.distractors,
        explanation: k.explanation,
        allowedVariants: k.allowedVariants,
        status: k.status as ContentStatus,
        externalKey: k.externalKey ?? null,
        createdAt: new Date(k.createdAt),
        updatedAt: new Date(k.updatedAt),
      },
    });
  }

  const questions = buildSeedQuestions();
  for (const q of questions) {
    await prisma.examQuestion.upsert({
      where: { id: q.id },
      update: {
        topicId: q.topicId,
        trackId: q.trackId,
        stem: q.stem,
        choices: q.choices,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        status: q.status as ContentStatus,
        externalKey: q.externalKey ?? null,
      },
      create: {
        id: q.id,
        topicId: q.topicId,
        trackId: q.trackId,
        stem: q.stem,
        choices: q.choices,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        status: q.status as ContentStatus,
        externalKey: q.externalKey ?? null,
        createdAt: new Date(q.createdAt),
        updatedAt: new Date(q.updatedAt),
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log(
    `Content seed OK: ${topics.length} topics, ${knowledge.length} knowledge, ${questions.length} questions`,
  );
}

async function main() {
  await seedAdmin();
  await seedContent();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
