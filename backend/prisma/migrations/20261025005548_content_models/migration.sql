-- CreateEnum
CREATE TYPE "TopicType" AS ENUM ('SERVICE', 'CONCEPT');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "type" "TopicType" NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeItem" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "distractors" JSONB NOT NULL,
    "explanation" TEXT NOT NULL,
    "allowedVariants" JSONB NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "externalKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamQuestion" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "stem" TEXT NOT NULL,
    "choices" JSONB NOT NULL,
    "correctIndex" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "externalKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Topic_trackId_idx" ON "Topic"("trackId");

-- CreateIndex
CREATE INDEX "Topic_parentId_idx" ON "Topic"("parentId");

-- CreateIndex
CREATE INDEX "Topic_sortOrder_idx" ON "Topic"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeItem_externalKey_key" ON "KnowledgeItem"("externalKey");

-- CreateIndex
CREATE INDEX "KnowledgeItem_topicId_idx" ON "KnowledgeItem"("topicId");

-- CreateIndex
CREATE INDEX "KnowledgeItem_trackId_idx" ON "KnowledgeItem"("trackId");

-- CreateIndex
CREATE INDEX "KnowledgeItem_status_idx" ON "KnowledgeItem"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ExamQuestion_externalKey_key" ON "ExamQuestion"("externalKey");

-- CreateIndex
CREATE INDEX "ExamQuestion_topicId_idx" ON "ExamQuestion"("topicId");

-- CreateIndex
CREATE INDEX "ExamQuestion_trackId_idx" ON "ExamQuestion"("trackId");

-- CreateIndex
CREATE INDEX "ExamQuestion_status_idx" ON "ExamQuestion"("status");

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeItem" ADD CONSTRAINT "KnowledgeItem_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamQuestion" ADD CONSTRAINT "ExamQuestion_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
