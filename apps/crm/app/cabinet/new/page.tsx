'use client';

import { useState } from 'react';

export default function NewTicketPage() {
  const [form, setForm] = useState({ type: 'connect', address: '', contactName: '', phone: '', description: '' });
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/crm/api/public/tickets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setMessage(JSON.stringify(await res.json()));
  };

  return (
    <form className="space-y-2" onSubmit={submit}>
      <h1 className="text-2xl font-bold">Новая заявка</h1>
      <input className="w-full rounded border p-2" placeholder="Адрес" onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
      <input className="w-full rounded border p-2" placeholder="Имя" onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))} />
      <input className="w-full rounded border p-2" placeholder="Телефон" onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
      <textarea className="w-full rounded border p-2" placeholder="Описание" onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
      <button className="rounded bg-blue-600 px-4 py-2 text-white">Создать</button>
      {message && <pre>{message}</pre>}
    </form>
  );
}
