import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import { Badge, Card } from '../components/ui'

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [filter, setFilter] = useState('')
  useEffect(() => { apiFetch('/tickets').then(r=>r.json()).then(setTickets) }, [])
  const shown = tickets.filter((t) => t.status.includes(filter))
  return <Card><h2>Tickets</h2><input aria-label='filter' className='border p-1' value={filter} onChange={(e)=>setFilter(e.target.value)} /><table><tbody>{shown.map((t)=><tr key={t.id}><td>{t.address}</td><td><Badge>{t.status}</Badge></td><td><Badge>{t.priority}</Badge></td></tr>)}</tbody></table></Card>
}
