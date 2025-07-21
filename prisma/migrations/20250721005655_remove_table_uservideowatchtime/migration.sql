/*
  Warnings:

  - You are about to drop the `UserVideoWatchtime` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `duration_seconds` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserVideoWatchtime" DROP CONSTRAINT "UserVideoWatchtime_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserVideoWatchtime" DROP CONSTRAINT "UserVideoWatchtime_videoId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "duration_seconds" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UserVideoWatchtime";
