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
  fecha_nac?: string | null
  created_at?: string
  dni?: string | null
  bloqueado?: boolean
  motivo_bloqueo?: string | null
  bloqueado_hasta?: string | null
}

interface AuthResponse {
  accessToken: string
  user: Socio
}

type Rol = 'admin' | 'caja' | 'seguridad' | 'socio'

interface LoginUnificadoResponse {
  accessToken: string
  user: { id: string; email: string; rol: Rol }
}

interface AuthContextValue {
  socio: Socio | null
  loading: boolean
  // Login único: sirve para socios, admin y caja. Devuelve el rol para
  // que quien lo llama (el modal del home) decida a dónde navegar.
  loginUnificado: (email: string, password: string) => Promise<Rol>
  // Usado por la vuelta del login con Google: ya tenemos el JWT (vino por
  // query param tras el redirect), solo falta guardarlo y cargar el perfil.
  loginConToken: (token: string) => Promise<void>
  register: (data: {
    nombre: string
    apellido: string
    email: string
    password: string
    fechaNac: string
    dni: string
  }) => Promise<void>
  actualizarPerfil: (data: { nombre?: string; apellido?: string; dni?: string }) => Promise<void>
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

  const loginUnificado = async (email: string, password: string): Promise<Rol> => {
    const result = await api.post<LoginUnificadoResponse>('/auth/login', { email, password })
    setToken(result.accessToken)
    if (result.user.rol === 'socio') {
      const perfil = await api.get<Socio>('/socios/me')
      setSocio(perfil)
    } else {
      setSocio(null)
    }
    return result.user.rol
  }

  const loginConToken = async (token: string) => {
    setToken(token)
    const perfil = await api.get<Socio>('/socios/me')
    setSocio(perfil)
  }

  const register = async (data: {
    nombre: string
    apellido: string
    email: string
    password: string
    fechaNac: string
    dni: string
  }) => {
    const result = await api.post<AuthResponse>('/socios/registro', data)
    setToken(result.accessToken)
    setSocio(result.user)
  }

  const actualizarPerfil = async (data: { nombre?: string; apellido?: string; dni?: string }) => {
    const actualizado = await api.patch<Socio>('/socios/me', data)
    setSocio(actualizado)
  }

  const logout = () => {
    setToken(null)
    setSocio(null)
  }

  return (
    <AuthContext.Provider value={{ socio, loading, loginUnificado, loginConToken, register, actualizarPerfil, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
