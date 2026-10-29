-- CreateTable
CREATE TABLE "UserExam" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examCode" TEXT NOT NULL,
    "examDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserExam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserExam_userId_examDate_idx" ON "UserExam"("userId", "examDate");

-- CreateIndex
CREATE UNIQUE INDEX "UserExam_userId_examCode_key" ON "UserExam"("userId", "examCode");

-- AddForeignKey
ALTER TABLE "UserExam" ADD CONSTRAINT "UserExam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Data migration: legacy single User.examDate becomes the user's CLF-C02 exam.
INSERT INTO "UserExam" ("id", "userId", "examCode", "examDate", "createdAt", "updatedAt")
SELECT
    'cm' || substr(md5(random()::text || u."id" || clock_timestamp()::text), 1, 23),
    u."id",
    'CLF-C02',
    u."examDate",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "User" u
WHERE u."examDate" IS NOT NULL;
