-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "faceString" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendances" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TEXT,
    "temperature" TEXT,
    "status" TEXT,
    "location" TEXT,
    "time" TEXT,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "Attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRule" (
    "id" SERIAL NOT NULL,
    "earlyMinute" TEXT,
    "lateMinute" TEXT,
    "offDutyTime" TEXT,
    "onDutyTime" TEXT,

    CONSTRAINT "AttendanceRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Attendances" ADD CONSTRAINT "Attendances_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "Users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
