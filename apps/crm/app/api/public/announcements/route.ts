import { NextRequest } from 'next/server';
import { prisma } from '@hastelecom/db/src/client';
import { checkRateLimit } from '@/lib/rate-limit';
import { json } from '@/lib/http';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  if (!checkRateLimit(ip, 60)) return json({ error: 'Too many requests' }, { status: 429 });

  const now = new Date();
  const items = await prisma.announcement.findMany({
    where: {
      isActive: true,
      startsAt: { lte: now },
      OR: [{ endsAt: null }, { endsAt: { gte: now } }]
    },
    orderBy: { startsAt: 'desc' }
  });
  return json({ items });
}
