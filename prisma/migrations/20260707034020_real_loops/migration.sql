-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "cat" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "hood" TEXT NOT NULL,
    "cross" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '',
    "photo" TEXT NOT NULL DEFAULT '',
    "by" TEXT NOT NULL DEFAULT 'Resident',
    "city" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "wf" TEXT NOT NULL DEFAULT 'New',
    "status" TEXT NOT NULL DEFAULT 'Submitted',
    "scanLevel" TEXT NOT NULL DEFAULT 'clean',
    "scanMsg" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigestSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "preference" TEXT NOT NULL DEFAULT 'All Signals',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DigestSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerInquiry" (
    "id" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "interest" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Submission_city_wf_idx" ON "Submission"("city", "wf");

-- CreateIndex
CREATE INDEX "Submission_userId_idx" ON "Submission"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DigestSubscriber_email_key" ON "DigestSubscriber"("email");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
