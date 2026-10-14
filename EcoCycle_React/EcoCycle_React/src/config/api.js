export const API_BASE = '/api'

const MOCK_USERS = [
  { id: 1, name: 'Admin', username: 'admin', password: 'admin123', email: 'admin@ecocycle.com', role: 'Admin' }
]

export async function apiLogin(username, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      signal: AbortSignal.timeout(4000),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Credenziali non valide')
    return data
  } catch (err) {
    if (err.name === 'TimeoutError' || err.message.includes('fetch')) {
      // Backend non disponibile — usa mock
      const u = MOCK_USERS.find(u => u.username === username && u.password === password)
      if (!u) throw new Error('Credenziali non valide')
      const { password: _, ...safe } = u
      return { success: true, token: 'mock-token', user: safe }
    }
    throw err
  }
}

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('eco_token')
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Errore ${res.status}`)
  }
  return res.json()
}