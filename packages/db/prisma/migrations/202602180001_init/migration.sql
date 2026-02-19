-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'operator', 'tech', 'guest');
CREATE TYPE "TicketType" AS ENUM ('connect', 'support', 'internal');
CREATE TYPE "TicketStatus" AS ENUM ('new', 'in_progress', 'waiting', 'done', 'closed', 'canceled');
CREATE TYPE "TicketPriority" AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE "TariffType" AS ENUM ('home', 'business');
CREATE TYPE "AnnouncementLevel" AS ENUM ('info', 'warn', 'critical');
CREATE TYPE "AnnouncementPlacement" AS ENUM ('top', 'homepage');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'user',
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Ticket" (
  "id" TEXT NOT NULL,
  "type" "TicketType" NOT NULL,
  "address" TEXT NOT NULL,
  "contactName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" "TicketStatus" NOT NULL DEFAULT 'new',
  "priority" "TicketPriority" NOT NULL DEFAULT 'medium',
  "createdById" TEXT NOT NULL,
  "assignedToId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TicketComment" (
  "id" TEXT NOT NULL,
  "ticketId" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TicketComment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TicketHistory" (
  "id" TEXT NOT NULL,
  "ticketId" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "fromStatus" "TicketStatus",
  "toStatus" "TicketStatus",
  "meta" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TicketHistory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Tariff" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "speedMbps" INTEGER NOT NULL,
  "price" INTEGER NOT NULL,
  "type" "TariffType" NOT NULL,
  "features" JSONB NOT NULL,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "Tariff_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Announcement" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "level" "AnnouncementLevel" NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3),
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "placement" "AnnouncementPlacement" NOT NULL,
  CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TicketComment" ADD CONSTRAINT "TicketComment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TicketComment" ADD CONSTRAINT "TicketComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TicketHistory" ADD CONSTRAINT "TicketHistory_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TicketHistory" ADD CONSTRAINT "TicketHistory_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
