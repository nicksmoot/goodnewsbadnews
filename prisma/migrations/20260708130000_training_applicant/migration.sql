-- CreateTable
CREATE TABLE "TrainingApplicant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "experience" TEXT NOT NULL DEFAULT 'New to this',
    "interest" TEXT NOT NULL DEFAULT 'Reporting',
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingApplicant_pkey" PRIMARY KEY ("id")
);
