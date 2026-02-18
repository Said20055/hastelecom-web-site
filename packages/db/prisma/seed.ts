import bcrypt from 'bcrypt';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function ensureUser(email: string, name: string, password: string, role: Role) {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.upsert({
    where: { email },
    update: { name, passwordHash, role },
    create: { email, name, passwordHash, role }
  });
}

async function main() {
  await ensureUser('operator@has.local', 'Main Operator', 'Operator123!', 'operator');
  await ensureUser('tech@has.local', 'Main Technician', 'Tech123!', 'tech');
  await ensureUser('guest@has.local', 'Guest User', 'Guest123!', 'guest');

  await prisma.tariff.createMany({
    data: [
      { title: 'Домашний 100', speedMbps: 100, price: 600, type: 'home', features: ['Wi-Fi роутер', 'Безлимит'], isFeatured: false, isActive: true },
      { title: 'Турбо 300', speedMbps: 300, price: 900, type: 'home', features: ['Приоритетная поддержка', 'Статический IP'], isFeatured: true, isActive: true },
      { title: 'Бизнес 500', speedMbps: 500, price: 2500, type: 'business', features: ['SLA 99.9%', 'Личный менеджер'], isFeatured: false, isActive: true }
    ],
    skipDuplicates: true
  });

  const now = new Date();
  await prisma.announcement.createMany({
    data: [
      {
        title: 'Плановые работы',
        body: '18 февраля c 02:00 до 04:00 возможны кратковременные перерывы.',
        level: 'warn',
        startsAt: new Date(now.getTime() - 24 * 3600 * 1000),
        endsAt: new Date(now.getTime() + 7 * 24 * 3600 * 1000),
        isActive: true,
        placement: 'top'
      },
      {
        title: 'Подключение за 1 день',
        body: 'Оставьте заявку и подключим интернет в течение 24 часов.',
        level: 'info',
        startsAt: now,
        endsAt: null,
        isActive: true,
        placement: 'homepage'
      }
    ],
    skipDuplicates: true
  });
}

main().finally(async () => prisma.$disconnect());
