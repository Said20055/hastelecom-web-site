import bcrypt from 'bcrypt';
import { prisma } from '@hastelecom/db/src/client';
import { json } from '@/lib/http';
import { registerSchema } from '@/lib/validators';

export async function POST(req: Request) {
  const parsed = registerSchema.safeParse(await req.json());
  if (!parsed.success) return json({ error: parsed.error.flatten() }, { status: 400 });

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return json({ error: 'Email already used' }, { status: 409 });

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await prisma.user.create({
    data: { email: parsed.data.email, passwordHash, name: parsed.data.name, role: 'user' },
    select: { id: true, email: true, name: true, role: true, createdAt: true }
  });
  return json({ user }, { status: 201 });
}
