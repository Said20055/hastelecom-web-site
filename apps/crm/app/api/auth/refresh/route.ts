import { cookies } from 'next/headers';
import { prisma } from '@hastelecom/db/src/client';
import { json } from '@/lib/http';
import { signAccessToken, verifyToken } from '@/lib/auth';

export async function POST() {
  const token = cookies().get('refreshToken')?.value;
  if (!token) return json({ error: 'No refresh token' }, { status: 401 });

  const payload = verifyToken<{ sub: string; role: 'user' | 'operator' | 'tech' | 'guest' }>(token);
  if (!payload) return json({ error: 'Invalid refresh token' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) return json({ error: 'User not found' }, { status: 404 });

  const accessToken = signAccessToken({ sub: user.id, role: user.role, email: user.email, name: user.name });
  return json({ accessToken });
}
