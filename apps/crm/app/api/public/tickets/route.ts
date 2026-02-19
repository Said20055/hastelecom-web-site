import { NextRequest } from 'next/server';
import { prisma } from '@hastelecom/db/src/client';
import { checkRateLimit } from '@/lib/rate-limit';
import { createTicketSchema } from '@/lib/validators';
import { json } from '@/lib/http';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  if (!checkRateLimit(ip, 20)) return json({ error: 'Too many requests' }, { status: 429 });

  const parsed = createTicketSchema.safeParse(await req.json());
  if (!parsed.success) return json({ error: parsed.error.flatten() }, { status: 400 });

  let guest = await prisma.user.findUnique({ where: { email: 'guest@has.local' } });
  if (!guest) {
    guest = await prisma.user.create({ data: { email: 'guest@has.local', name: 'Guest User', passwordHash: 'no-login', role: 'guest' } });
  }

  const item = await prisma.ticket.create({
    data: { ...parsed.data, createdById: guest.id, status: 'new', priority: 'medium' }
  });

  await prisma.ticketHistory.create({ data: { ticketId: item.id, actorId: guest.id, action: 'public_created', toStatus: 'new', meta: { ip } } });
  return json({ item }, { status: 201 });
}
