/*
  Warnings:

  - You are about to drop the column `learningLevel` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userLearningLanguageId,wordId]` on the table `UserWord` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userLearningLanguageId` to the `LearningSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userLearningLanguageId` to the `UserWord` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserWord_userId_wordId_key";

-- AlterTable
ALTER TABLE "LearningSession" ADD COLUMN     "userLearningLanguageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "learningLevel",
ADD COLUMN     "activeLearningLanguageId" TEXT;

-- AlterTable
ALTER TABLE "UserWord" ADD COLUMN     "userLearningLanguageId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UserLearningLanguage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "level" "LanguageLevel" NOT NULL DEFAULT 'A1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLearningLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserLearningLanguage_userId_idx" ON "UserLearningLanguage"("userId");

-- CreateIndex
CREATE INDEX "UserLearningLanguage_languageId_idx" ON "UserLearningLanguage"("languageId");

-- CreateIndex
CREATE INDEX "UserLearningLanguage_userId_level_idx" ON "UserLearningLanguage"("userId", "level");

-- CreateIndex
CREATE UNIQUE INDEX "UserLearningLanguage_userId_languageId_key" ON "UserLearningLanguage"("userId", "languageId");

-- CreateIndex
CREATE INDEX "LearningSession_userLearningLanguageId_startedAt_idx" ON "LearningSession"("userLearningLanguageId", "startedAt");

-- CreateIndex
CREATE INDEX "User_activeLearningLanguageId_idx" ON "User"("activeLearningLanguageId");

-- CreateIndex
CREATE INDEX "UserWord_userLearningLanguageId_status_idx" ON "UserWord"("userLearningLanguageId", "status");

-- CreateIndex
CREATE INDEX "UserWord_userLearningLanguageId_nextReviewAt_idx" ON "UserWord"("userLearningLanguageId", "nextReviewAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserWord_userLearningLanguageId_wordId_key" ON "UserWord"("userLearningLanguageId", "wordId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeLearningLanguageId_fkey" FOREIGN KEY ("activeLearningLanguageId") REFERENCES "UserLearningLanguage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLearningLanguage" ADD CONSTRAINT "UserLearningLanguage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLearningLanguage" ADD CONSTRAINT "UserLearningLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWord" ADD CONSTRAINT "UserWord_userLearningLanguageId_fkey" FOREIGN KEY ("userLearningLanguageId") REFERENCES "UserLearningLanguage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningSession" ADD CONSTRAINT "LearningSession_userLearningLanguageId_fkey" FOREIGN KEY ("userLearningLanguageId") REFERENCES "UserLearningLanguage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
