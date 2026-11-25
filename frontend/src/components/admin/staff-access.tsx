'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CashierDashboard } from '@/components/admin/cashier-dashboard'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { ControlAcceso } from '@/components/admin/control-acceso'
import { setToken } from '@/lib/api'
import { decodeJwt } from '@/lib/jwt'

type StaffRole = 'admin' | 'caja' | 'seguridad'

function tokenValidoParaRol(role: StaffRole): boolean {
  const token = localStorage.getItem('teos-token')
  if (!token) return false
  const payload = decodeJwt(token)
  if (!payload) return false
  const vigente = typeof payload.exp === 'number' ? payload.exp * 1000 > Date.now() : true
  return payload.rol === role && vigente
}

// Todo el mundo inicia sesión desde el modal del Home — no hay pantallas de
// login separadas por rol. Si no hay sesión válida para este rol, mandamos
// al Home para que entre ahí; el modal ya sabe a dónde redirigir según el
// rol que devuelva /auth/login.
function useStaffSession(role: StaffRole) {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!tokenValidoParaRol(role)) navigate('/', { replace: true })
    else setReady(true)
  }, [role, navigate])
  return {
    ready,
    logout: () => {
      setToken(null)
      navigate('/', { replace: true })
    },
  }
}

export function CashierAccess() {
  const { ready, logout } = useStaffSession('caja')
  if (!ready) return <main className="grid min-h-screen place-items-center bg-background text-muted-foreground">Verificando acceso…</main>
  return <CashierDashboard onLogout={logout} />
}

export function AdminAccess() { return <StaffGate role="admin"><AdminDashboard /></StaffGate> }
export function SeguridadAccess() { return <StaffGate role="seguridad"><ControlAcceso /></StaffGate> }

export function StaffGate({ role, children }: { role: StaffRole; children: React.ReactNode }) {
  const { ready } = useStaffSession(role)
  if (!ready) return <main className="grid min-h-screen place-items-center bg-background text-muted-foreground">Verificando acceso…</main>
  return <>{children}</>
}
