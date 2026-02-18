import bcrypt from 'bcrypt';
import { prisma } from '@hastelecom/db/src/client';
import { json } from '@/lib/http';
import { loginSchema } from '@/lib/validators';
import { setRefreshCookie, signAccessToken, signRefreshToken } from '@/lib/auth';

export async function POST(req: Request) {
  const parsed = loginSchema.safeParse(await req.json());
  if (!parsed.success) return json({ error: parsed.error.flatten() }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    return json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role, email: user.email, name: user.name });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });
  setRefreshCookie(refreshToken);

  return json({ accessToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
}
