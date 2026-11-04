-- CreateEnum
CREATE TYPE "MinigameStatus" AS ENUM ('PLAYED', 'COMPLETED');

-- CreateTable
CREATE TABLE "MinigameResult" (
    "userId" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "status" "MinigameStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MinigameResult_pkey" PRIMARY KEY ("userId","resultId")
);

-- AddForeignKey
ALTER TABLE "MinigameResult" ADD CONSTRAINT "MinigameResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
