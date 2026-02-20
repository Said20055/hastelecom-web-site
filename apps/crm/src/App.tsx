import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import TicketsPage from './pages/TicketsPage'

export default function App() {
  return <BrowserRouter basename='/crm'><Routes>
    <Route path='/login' element={<Login />} />
    <Route path='/dashboard' element={<div>Dashboard</div>} />
    <Route path='/operator/tickets' element={<TicketsPage />} />
    <Route path='/operator/tickets/:id' element={<div>Operator Ticket</div>} />
    <Route path='/tech/tickets' element={<TicketsPage />} />
    <Route path='/tech/tickets/:id' element={<div>Tech Ticket</div>} />
    <Route path='/cabinet/tickets' element={<TicketsPage />} />
    <Route path='/cabinet/new' element={<div>New Ticket</div>} />
    <Route path='*' element={<Navigate to='/login' replace />} />
  </Routes></BrowserRouter>
}
