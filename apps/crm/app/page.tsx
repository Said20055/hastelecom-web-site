import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">CRM Хас-Телеком</h1>
      <Link className="text-blue-600 underline" href="/login">Войти</Link>
    </div>
  );
}
