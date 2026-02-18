import { NextRequest } from 'next/server';
import { prisma } from '@hastelecom/db/src/client';
import { createTicketSchema } from '@/lib/validators';
import { getUserFromRequest } from '@/lib/auth';
import { json } from '@/lib/http';

async function ensureGuestId() {
  let guest = await prisma.user.findUnique({ where: { email: 'guest@has.local' } });
  if (!guest) {
    guest = await prisma.user.create({ data: { email: 'guest@has.local', name: 'Guest User', passwordHash: 'no-login', role: 'guest' } });
  }
  return guest.id;
}

export async function POST(req: NextRequest) {
  const parsed = createTicketSchema.safeParse(await req.json());
  if (!parsed.success) return json({ error: parsed.error.flatten() }, { status: 400 });

  const auth = getUserFromRequest(req);
  const createdById = auth?.sub ?? (await ensureGuestId());

  const ticket = await prisma.ticket.create({
    data: {
      ...parsed.data,
      createdById,
      status: 'new',
      priority: 'medium'
    }
  });

  await prisma.ticketHistory.create({ data: { ticketId: ticket.id, actorId: createdById, action: 'created', toStatus: 'new' } });
  return json({ item: ticket }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const auth = getUserFromRequest(req);
  if (!auth) return json({ error: 'Unauthorized' }, { status: 401 });

  const where =
    auth.role === 'operator' ? {} : auth.role === 'tech' ? { assignedToId: auth.sub } : { createdById: auth.sub };

  const items = await prisma.ticket.findMany({
    where,
    include: { createdBy: { select: { id: true, email: true, name: true, role: true } }, assignedTo: { select: { id: true, email: true, name: true, role: true } } },
    orderBy: { createdAt: 'desc' }
  });
  return json({ items });
}
