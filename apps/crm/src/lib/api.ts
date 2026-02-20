let accessToken = ''
export const setToken = (token: string) => (accessToken = token)

export async function apiFetch(path: string, options: RequestInit = {}) {
  const exec = async () => fetch(`/crm/api${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', Authorization: accessToken ? `Bearer ${accessToken}` : '', ...(options.headers || {}) },
  })
  let response = await exec()
  if (response.status === 401) {
    const refreshed = await fetch('/crm/api/auth/refresh', { method: 'POST', credentials: 'include' })
    if (refreshed.ok) {
      const data = await refreshed.json()
      setToken(data.access)
      response = await exec()
    } else {
      await fetch('/crm/api/auth/logout', { method: 'POST', credentials: 'include' })
      window.location.href = '/crm/login'
    }
  }
  return response
}
