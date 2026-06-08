/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../lib/api'
import type { User } from '../types'

type AuthValue = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('restaurant_user')
    return saved ? JSON.parse(saved) as User : null
  })
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('restaurant_token')))

  useEffect(() => {
    const verify = async () => {
      if (!localStorage.getItem('restaurant_token')) return setLoading(false)
      try {
        const { data } = await api.get<User>('/user')
        setUser(data)
        localStorage.setItem('restaurant_user', JSON.stringify(data))
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    void verify()
    const expired = () => setUser(null)
    window.addEventListener('auth:expired', expired)
    return () => window.removeEventListener('auth:expired', expired)
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await api.post<{ access_token: string; user: User }>('/login', { email, password })
    localStorage.setItem('restaurant_token', data.access_token)
    localStorage.setItem('restaurant_user', JSON.stringify(data.user))
    setUser(data.user)
  }

  const logout = async () => {
    try { await api.post('/logout') } finally {
      localStorage.removeItem('restaurant_token')
      localStorage.removeItem('restaurant_user')
      setUser(null)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
