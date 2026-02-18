import { NextRequest } from 'next/server';
import { prisma } from '@hastelecom/db/src/client';
import { getUserFromRequest } from '@/lib/auth';
import { json } from '@/lib/http';

export async function GET(req: NextRequest) {
  const auth = getUserFromRequest(req);
  if (!auth || auth.role !== 'operator') return json({ error: 'Forbidden' }, { status: 403 });
  const items = await prisma.tariff.findMany({ orderBy: { price: 'asc' } });
  return json({ items });
}

export async function POST(req: NextRequest) {
  const auth = getUserFromRequest(req);
  if (!auth || auth.role !== 'operator') return json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json();
  const item = await prisma.tariff.create({ data: body });
  return json({ item }, { status: 201 });
}
