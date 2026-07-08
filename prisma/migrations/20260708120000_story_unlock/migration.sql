-- CreateTable
CREATE TABLE "StoryUnlock" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoryUnlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StoryUnlock_userId_postId_key" ON "StoryUnlock"("userId", "postId");

-- CreateIndex
CREATE INDEX "StoryUnlock_userId_idx" ON "StoryUnlock"("userId");
