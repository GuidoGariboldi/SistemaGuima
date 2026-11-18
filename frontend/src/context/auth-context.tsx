import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, setToken } from '@/lib/api'

interface Socio {
  id: string
  nombre: string
  apellido: string
  email: string
  member_number: string
  nivel: string
  puntos: number
}

interface AuthResponse {
  accessToken: string
  user: Socio
}

interface AuthContextValue {
  socio: Socio | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    nombre: string
    apellido: string
    email: string
    password: string
    fechaNac: string
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [socio, setSocio] = useState<Socio | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // No borramos el token si falla: puede ser perfectamente un token de
    // staff (admin/caja), que vive en el mismo almacenamiento pero no es
    // válido para /socios/me. Acá solo nos importa si HAY un socio o no.
    api
      .get<Socio>('/socios/me')
      .then((data) => setSocio(data))
      .catch(() => setSocio(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const result = await api.post<AuthResponse>('/socios/login', { email, password })
    setToken(result.accessToken)
    setSocio(result.user)
  }

  const register = async (data: {
    nombre: string
    apellido: string
    email: string
    password: string
    fechaNac: string
  }) => {
    const result = await api.post<AuthResponse>('/socios/registro', data)
    setToken(result.accessToken)
    setSocio(result.user)
  }

  const logout = () => {
    setToken(null)
    setSocio(null)
  }

  return (
    <AuthContext.Provider value={{ socio, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
