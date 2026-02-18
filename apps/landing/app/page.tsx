import Link from 'next/link';
import { TicketForm } from '@/components/ticket-form';

async function fetchJson(path: string) {
  const base = process.env.CRM_PUBLIC_BASE_URL || 'http://nginx/crm/api/public';
  try {
    const res = await fetch(`${base}${path}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}

export default async function LandingPage() {
  const tariffs = await fetchJson('/tariffs');
  const announcements = await fetchJson('/announcements');
  const featured = tariffs.find((t: any) => t.isFeatured);

  return (
    <div className="mx-auto max-w-6xl space-y-16 p-8">
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-10 text-white">
        <h1 className="text-4xl font-bold">Хас-Телеком — интернет для дома и бизнеса</h1>
        <p className="mt-3 max-w-2xl">Подключаем за 1 день. Стабильная сеть и круглосуточная поддержка.</p>
        <Link href="#connect" className="mt-6 inline-block rounded bg-white px-4 py-2 text-blue-700">Подключить</Link>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Тарифы</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {tariffs.map((item: any) => (
            <article key={item.id} className={`rounded-xl border p-4 ${item.isFeatured ? 'border-blue-500 bg-blue-50' : ''}`}>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p>{item.speedMbps} Мбит/с · {item.price} ₽/мес</p>
              <button className="mt-3 rounded bg-blue-600 px-3 py-2 text-white">Подключить</button>
            </article>
          ))}
        </div>
        {featured && <p className="mt-2 text-sm text-blue-700">Рекомендуемый тариф: {featured.title}</p>}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Объявления</h2>
        <div className="space-y-3">
          {announcements.map((a: any) => (
            <div key={a.id} className="rounded-lg border p-3"><strong>{a.title}</strong><p>{a.body}</p></div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2" id="connect">
        <TicketForm type="connect" title="Подключить интернет" />
        <TicketForm type="support" title="Техподдержка" />
      </section>

      <section>
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Подключение в течение 24 часов.</li>
          <li>Техподдержка 24/7.</li>
          <li>Гарантия возврата в первые 14 дней.</li>
        </ul>
      </section>

      <footer className="border-t pt-6 text-sm text-slate-600">© {new Date().getFullYear()} Хас-Телеком</footer>
    </div>
  );
}

