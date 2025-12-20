-- CreateEnum
CREATE TYPE "StreakStatus" AS ENUM ('UNINITIATED', 'STARTED');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "lastStreakUpgradeDate" INTEGER,
ADD COLUMN     "longestStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "streakCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "streakStatus" "StreakStatus" NOT NULL DEFAULT 'UNINITIATED';
