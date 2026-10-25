-- CreateTable
CREATE TABLE "GuestProbe" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionsCount" INTEGER NOT NULL DEFAULT 0,
    "convertedUserId" TEXT,

    CONSTRAINT "GuestProbe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuestProbe_convertedUserId_key" ON "GuestProbe"("convertedUserId");

-- CreateIndex
CREATE INDEX "GuestProbe_createdAt_idx" ON "GuestProbe"("createdAt");
