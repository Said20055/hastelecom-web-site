import { NextRequest } from 'next/server';
import { prisma } from '@hastelecom/db/src/client';
import { getUserFromRequest } from '@/lib/auth';
import { patchTicketSchema } from '@/lib/validators';
import { json } from '@/lib/http';

async function canView(role: string, userId: string, ticket: { createdById: string; assignedToId: string | null }) {
  if (role === 'operator') return true;
  if (role === 'tech') return ticket.assignedToId === userId;
  return ticket.createdById === userId;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getUserFromRequest(req);
  if (!auth) return json({ error: 'Unauthorized' }, { status: 401 });

  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: { comments: true, history: true, assignedTo: { select: { id: true, name: true, email: true } }, createdBy: { select: { id: true, name: true, email: true } } }
  });
  if (!ticket) return json({ error: 'Not found' }, { status: 404 });
  if (!(await canView(auth.role, auth.sub, ticket))) return json({ error: 'Forbidden' }, { status: 403 });
  return json({ item: ticket });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getUserFromRequest(req);
  if (!auth) return json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = patchTicketSchema.safeParse(await req.json());
  if (!parsed.success) return json({ error: parsed.error.flatten() }, { status: 400 });

  const ticket = await prisma.ticket.findUnique({ where: { id: params.id } });
  if (!ticket) return json({ error: 'Not found' }, { status: 404 });

  const data = parsed.data;
  if (auth.role === 'operator') {
    const updated = await prisma.ticket.update({ where: { id: params.id }, data: { assignedToId: data.assignedToId, status: data.status, priority: data.priority } });
    await prisma.ticketHistory.create({ data: { ticketId: params.id, actorId: auth.sub, action: 'operator_update', fromStatus: ticket.status, toStatus: data.status ?? ticket.status, meta: data } });
    return json({ item: updated });
  }

  if (auth.role === 'tech' && ticket.assignedToId === auth.sub) {
    const updated = await prisma.ticket.update({ where: { id: params.id }, data: { status: data.status ?? ticket.status } });
    if (data.comment) await prisma.ticketComment.create({ data: { ticketId: params.id, authorId: auth.sub, text: data.comment } });
    await prisma.ticketHistory.create({ data: { ticketId: params.id, actorId: auth.sub, action: 'tech_update', fromStatus: ticket.status, toStatus: data.status ?? ticket.status } });
    return json({ item: updated });
  }

  if (auth.role === 'user' && ticket.createdById === auth.sub && data.status === 'canceled') {
    const updated = await prisma.ticket.update({ where: { id: params.id }, data: { status: 'canceled' } });
    await prisma.ticketHistory.create({ data: { ticketId: params.id, actorId: auth.sub, action: 'user_cancel', fromStatus: ticket.status, toStatus: 'canceled' } });
    return json({ item: updated });
  }

  return json({ error: 'Forbidden' }, { status: 403 });
}
