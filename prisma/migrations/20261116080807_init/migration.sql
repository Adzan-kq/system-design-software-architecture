-- CreateEnum
CREATE TYPE "ModuleStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MilestoneType" AS ENUM ('CAREER', 'LEARNING', 'PROJECT', 'CERTIFICATION', 'MILESTONE');

-- CreateTable
CREATE TABLE "Pillar" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pillar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL DEFAULT '',
    "status" "ModuleStatus" NOT NULL DEFAULT 'PLANNED',
    "order" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "completedAt" TIMESTAMP(3),
    "pillarId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JourneyMilestone" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "MilestoneType" NOT NULL,
    "summary" TEXT NOT NULL,
    "reflection" TEXT,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "linkLabel" TEXT,
    "linkUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JourneyMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pillar_slug_key" ON "Pillar"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Pillar_order_key" ON "Pillar"("order");

-- CreateIndex
CREATE INDEX "Module_pillarId_order_idx" ON "Module"("pillarId", "order");

-- CreateIndex
CREATE INDEX "Module_status_idx" ON "Module"("status");

-- CreateIndex
CREATE INDEX "Module_updatedAt_idx" ON "Module"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Module_pillarId_slug_key" ON "Module"("pillarId", "slug");

-- CreateIndex
CREATE INDEX "JourneyMilestone_startDate_idx" ON "JourneyMilestone"("startDate");

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_pillarId_fkey" FOREIGN KEY ("pillarId") REFERENCES "Pillar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
