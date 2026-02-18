import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex gap-4">
        <Link href="/operator/tickets" className="underline">Оператор</Link>
        <Link href="/tech/tickets" className="underline">Техник</Link>
        <Link href="/cabinet/tickets" className="underline">Кабинет</Link>
      </div>
    </div>
  );
}
