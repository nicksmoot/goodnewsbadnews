-- AlterTable
ALTER TABLE "Submission" ADD COLUMN "stripeSessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Submission_stripeSessionId_key" ON "Submission"("stripeSessionId");
