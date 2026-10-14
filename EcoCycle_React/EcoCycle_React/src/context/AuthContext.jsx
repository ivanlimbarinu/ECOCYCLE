// src/context/AuthContext.jsx — versione finale compatibile con router
import { createContext, useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { apiLogin } from '../config/api'

const AuthContext = createContext()

export function AuthProvider() {           // <-- niente children, usa Outlet
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eco_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  async function login(username, password) {
    setLoading(true)
    try {
      const data = await apiLogin(username, password)
      setUser(data.user)
      localStorage.setItem('eco_user',  JSON.stringify(data.user))
      localStorage.setItem('eco_token', data.token)
      return null
    } catch (err) {
      return err.message
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('eco_user')
    localStorage.removeItem('eco_token')
    window.location.href = '/auth/login'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      <Outlet />
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }