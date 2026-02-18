'use client';

import { useState } from 'react';

export function TicketForm({ type, title }: { type: 'connect' | 'support'; title: string }) {
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const res = await fetch('/crm/api/public/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    setMessage(data.item ? 'Заявка отправлена' : 'Ошибка отправки');
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2 rounded-xl border p-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <input name="type" defaultValue={type} readOnly hidden />
      <input name="address" placeholder="Адрес" className="w-full rounded border p-2" required />
      <input name="contactName" placeholder="Имя" className="w-full rounded border p-2" required />
      <input name="phone" placeholder="Телефон" className="w-full rounded border p-2" required />
      <textarea name="description" placeholder="Описание" className="w-full rounded border p-2" required />
      <button className="rounded bg-slate-900 px-4 py-2 text-white">Отправить</button>
      {message && <p className="text-sm text-green-600">{message}</p>}
    </form>
  );
}
