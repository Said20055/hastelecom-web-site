import { NextRequest } from 'next/server';
import { prisma } from '@hastelecom/db/src/client';
import { getUserFromRequest } from '@/lib/auth';
import { json } from '@/lib/http';

export async function GET(req: NextRequest) {
  const auth = getUserFromRequest(req);
  if (!auth || auth.role !== 'operator') return json({ error: 'Forbidden' }, { status: 403 });

  const techs = await prisma.user.findMany({ where: { role: 'tech' }, select: { id: true, email: true, name: true, role: true } });
  return json({ items: techs });
}
