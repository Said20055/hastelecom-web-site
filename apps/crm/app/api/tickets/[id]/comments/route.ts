import { NextRequest } from 'next/server';
import { prisma } from '@hastelecom/db/src/client';
import { getUserFromRequest } from '@/lib/auth';
import { commentSchema } from '@/lib/validators';
import { json } from '@/lib/http';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getUserFromRequest(req);
  if (!auth) return json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = commentSchema.safeParse(await req.json());
  if (!parsed.success) return json({ error: parsed.error.flatten() }, { status: 400 });

  const ticket = await prisma.ticket.findUnique({ where: { id: params.id } });
  if (!ticket) return json({ error: 'Not found' }, { status: 404 });

  const allowed = auth.role === 'operator' || (auth.role === 'tech' && ticket.assignedToId === auth.sub) || (auth.role === 'user' && ticket.createdById === auth.sub);
  if (!allowed) return json({ error: 'Forbidden' }, { status: 403 });

  const item = await prisma.ticketComment.create({ data: { ticketId: params.id, authorId: auth.sub, text: parsed.data.text } });
  return json({ item }, { status: 201 });
}
