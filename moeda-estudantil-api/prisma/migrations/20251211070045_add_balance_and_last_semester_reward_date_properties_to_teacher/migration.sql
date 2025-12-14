-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastSemesterRewardAt" TIMESTAMP(3);
