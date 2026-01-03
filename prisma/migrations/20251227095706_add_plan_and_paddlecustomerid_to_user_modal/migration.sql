/*
  Warnings:

  - A unique constraint covering the columns `[paddleCustomerId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "paddleCustomerId" TEXT,
ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'FREE';

-- CreateIndex
CREATE UNIQUE INDEX "user_paddleCustomerId_key" ON "user"("paddleCustomerId");
