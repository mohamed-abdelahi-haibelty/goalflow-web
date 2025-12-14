/*
  Warnings:

  - You are about to drop the column `accountId` on the `pomodoro_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `completed` on the `pomodoro_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `elapsed` on the `pomodoro_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `endedAt` on the `pomodoro_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `firstStartedAt` on the `pomodoro_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `pausedAt` on the `pomodoro_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `pomodoro_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `pomodoro_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `pomodoro_sessions` table. All the data in the column will be lost.
  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_settings` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `pomodoro_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('POMODORO', 'SHORT_BREAK', 'LONG_BREAK');

-- CreateEnum
CREATE TYPE "TimerStatus" AS ENUM ('IDLE', 'RUNNING', 'PAUSED');

-- DropForeignKey
ALTER TABLE "columns" DROP CONSTRAINT "columns_projectId_fkey";

-- DropForeignKey
ALTER TABLE "pomodoro_sessions" DROP CONSTRAINT "pomodoro_sessions_accountId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_accountId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_columnId_fkey";

-- DropForeignKey
ALTER TABLE "user_settings" DROP CONSTRAINT "user_settings_accountId_fkey";

-- DropIndex
DROP INDEX "pomodoro_sessions_accountId_completed_endedAt_idx";

-- DropIndex
DROP INDEX "pomodoro_sessions_accountId_idx";

-- DropIndex
DROP INDEX "pomodoro_sessions_projectId_completed_endedAt_idx";

-- AlterTable
ALTER TABLE "pomodoro_sessions" DROP COLUMN "accountId",
DROP COLUMN "completed",
DROP COLUMN "elapsed",
DROP COLUMN "endedAt",
DROP COLUMN "firstStartedAt",
DROP COLUMN "pausedAt",
DROP COLUMN "startedAt",
DROP COLUMN "state",
DROP COLUMN "type",
ADD COLUMN     "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "accounts";

-- DropTable
DROP TABLE "subscriptions";

-- DropTable
DROP TABLE "user_settings";

-- DropEnum
DROP TYPE "SessionState";

-- DropEnum
DROP TYPE "SessionType";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timer_settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workDuration" INTEGER NOT NULL DEFAULT 1500,
    "shortBreakDur" INTEGER NOT NULL DEFAULT 300,
    "longBreakDur" INTEGER NOT NULL DEFAULT 900,
    "roundsBeforeLongBreak" INTEGER NOT NULL DEFAULT 4,
    "soundVolume" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timer_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveTimer" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "mode" "Mode" NOT NULL DEFAULT 'POMODORO',
    "status" "TimerStatus" NOT NULL DEFAULT 'IDLE',
    "startTime" TIMESTAMP(3),
    "pausedWhen" INTEGER,
    "currentDuration" INTEGER NOT NULL DEFAULT 1500,
    "sessionsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActiveTimer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "timer_settings_userId_key" ON "timer_settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveTimer_taskId_key" ON "ActiveTimer"("taskId");

-- CreateIndex
CREATE INDEX "pomodoro_sessions_userId_idx" ON "pomodoro_sessions"("userId");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "columns" ADD CONSTRAINT "columns_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "columns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timer_settings" ADD CONSTRAINT "timer_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveTimer" ADD CONSTRAINT "ActiveTimer_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pomodoro_sessions" ADD CONSTRAINT "pomodoro_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
