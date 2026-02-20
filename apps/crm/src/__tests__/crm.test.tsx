import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../pages/Login'
import TicketsPage from '../pages/TicketsPage'
import { apiFetch, setToken } from '../lib/api'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

describe('crm ui', () => {
  it('login form renders and allows typing', async () => {
    ;(fetch as any).mockResolvedValueOnce({ ok: true, json: async () => ({ access: 'a' }) })
    render(<MemoryRouter><Login /></MemoryRouter>)
    fireEvent.change(screen.getByLabelText('email'), { target: { value: 'operator@has.local' } })
    fireEvent.change(screen.getByLabelText('password'), { target: { value: 'Operator123!' } })
    fireEvent.click(screen.getByText('Sign in'))
    await waitFor(() => expect(fetch).toHaveBeenCalled())
  })

  it('renders tickets table and filter', async () => {
    ;(fetch as any).mockResolvedValue({ status: 200, ok: true, json: async () => ([{ id: 1, address: 'A', status: 'new', priority: 'high' }]) })
    render(<TicketsPage />)
    expect(await screen.findByText('A')).toBeTruthy()
    fireEvent.change(screen.getByLabelText('filter'), { target: { value: 'done' } })
    expect(screen.queryByText('A')).toBeNull()
  })

  it('handles 401 with refresh', async () => {
    setToken('bad')
    ;(fetch as any)
      .mockResolvedValueOnce({ status: 401, ok: false, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access: 'new' }) })
      .mockResolvedValueOnce({ status: 200, ok: true, json: async () => ({}) })
    const res = await apiFetch('/tickets')
    expect(res.status).toBe(200)
  })
})
