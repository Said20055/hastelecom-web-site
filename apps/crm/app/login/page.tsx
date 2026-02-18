'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('operator@has.local');
  const [password, setPassword] = useState('Operator123!');
  const [result, setResult] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/crm/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    setResult(JSON.stringify(data));
  };

  return (
    <div className="mx-auto max-w-md rounded-xl border bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold">Вход в CRM</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full rounded border p-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded border p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="rounded bg-blue-600 px-4 py-2 text-white" type="submit">Войти</button>
      </form>
      {result && <pre className="mt-4 overflow-x-auto text-xs">{result}</pre>}
    </div>
  );
}
