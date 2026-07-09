-- One-time local GPS verification per user.
ALTER TABLE "User" ADD COLUMN "verifiedCity" TEXT;
ALTER TABLE "User" ADD COLUMN "locationVerifiedAt" TIMESTAMP(3);
