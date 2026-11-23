-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PATIENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "ConsultationStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('PATIENT', 'DOCTOR', 'SYSTEM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PATIENT',
    "email" TEXT,
    "fullName" TEXT,
    "avatarUrl" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialist" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Specialist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorAgent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specialistId" TEXT NOT NULL,
    "description" TEXT,
    "systemPrompt" TEXT NOT NULL,
    "personality" JSONB,
    "avatarUrl" TEXT,
    "modelName" TEXT NOT NULL DEFAULT 'gpt-4o-mini',
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "promptVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT,
    "title" TEXT,
    "status" "ConsultationStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorReview" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DoctorReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TriageEvent" (
    "id" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "specialtySlug" TEXT,
    "urgency" TEXT NOT NULL,
    "reason" TEXT,
    "needsClarification" BOOLEAN NOT NULL DEFAULT false,
    "modelVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TriageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Specialist_slug_key" ON "Specialist"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Specialist_name_key" ON "Specialist"("name");

-- CreateIndex
CREATE INDEX "Consultation_patientId_createdAt_idx" ON "Consultation"("patientId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_consultationId_createdAt_idx" ON "Message"("consultationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorReview_consultationId_key" ON "DoctorReview"("consultationId");

-- CreateIndex
CREATE INDEX "DoctorReview_doctorId_idx" ON "DoctorReview"("doctorId");

-- AddForeignKey
ALTER TABLE "DoctorAgent" ADD CONSTRAINT "DoctorAgent_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "Specialist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "DoctorAgent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorReview" ADD CONSTRAINT "DoctorReview_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorReview" ADD CONSTRAINT "DoctorReview_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "DoctorAgent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorReview" ADD CONSTRAINT "DoctorReview_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TriageEvent" ADD CONSTRAINT "TriageEvent_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
