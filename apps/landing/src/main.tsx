import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function App(){
  const [tariffs,setTariffs]=useState<any[]>([])
  const [ann,setAnn]=useState<any[]>([])
  const [form,setForm]=useState({address:'',contactName:'',phone:'',description:''})
  useEffect(()=>{fetch('/crm/api/public/tariffs').then(r=>r.json()).then(setTariffs);fetch('/crm/api/public/announcements').then(r=>r.json()).then(setAnn)},[])
  const submit=async(e:any)=>{e.preventDefault();await fetch('/crm/api/public/tickets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});alert('Отправлено')}
  return <div className='p-8 space-y-8'><section><h1 className='text-3xl font-bold'>Хас-Телеком</h1><p>Быстрый интернет для дома и бизнеса</p></section><section><h2>Tariffs</h2>{tariffs.map(t=><div key={t.id}>{t.title} - {t.speedMbps} Mbps</div>)}</section><section><h2>Announcements</h2>{ann.map(a=><div key={a.id}>{a.title}</div>)}</section><section><h2>FAQ</h2><p>Частые вопросы и ответы.</p></section><section><h2>CTA</h2><form onSubmit={submit} className='space-y-2'><input placeholder='Адрес' onChange={e=>setForm({...form,address:e.target.value})} className='border block'/><input placeholder='Имя' onChange={e=>setForm({...form,contactName:e.target.value})} className='border block'/><input placeholder='Телефон' onChange={e=>setForm({...form,phone:e.target.value})} className='border block'/><textarea placeholder='Описание' onChange={e=>setForm({...form,description:e.target.value})} className='border block'/><button className='bg-black text-white px-3 py-2'>Отправить</button></form></section><footer>© Хас-Телеком</footer></div>
}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)
