import { FormEvent, useState } from 'react'
import { setToken } from '../lib/api'

export default function Login() {
  const [email, setEmail] = useState('operator@has.local')
  const [password, setPassword] = useState('Operator123!')
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const res = await fetch('/crm/api/auth/login', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    if (!res.ok) return
    const data = await res.json()
    setToken(data.access)
    window.location.href = '/crm/dashboard'
  }
  return <form onSubmit={onSubmit} className='p-8 max-w-md mx-auto space-y-3'><h1>Login</h1><input aria-label='email' value={email} onChange={(e)=>setEmail(e.target.value)} className='border p-2 w-full'/><input aria-label='password' type='password' value={password} onChange={(e)=>setPassword(e.target.value)} className='border p-2 w-full'/><button className='bg-black text-white px-3 py-2'>Sign in</button></form>
}
