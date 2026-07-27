-- CreateEnum
CREATE TYPE "StatSource" AS ENUM ('MANUAL', 'PROJECTS', 'TECHNOLOGIES', 'CERTIFICATES');

-- AlterTable
ALTER TABLE "Stat" ADD COLUMN     "overrideEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "source" "StatSource" NOT NULL DEFAULT 'MANUAL';

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "experienceVisible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
