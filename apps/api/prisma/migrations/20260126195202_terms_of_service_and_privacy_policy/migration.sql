/*
  Warnings:

  - Added the required column `privacyAcceptedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `privacyAcceptedVersion` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termsAcceptedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termsAcceptedVersion` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "privacyAcceptedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "privacyAcceptedVersion" TEXT NOT NULL,
ADD COLUMN     "termsAcceptedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "termsAcceptedVersion" TEXT NOT NULL;
