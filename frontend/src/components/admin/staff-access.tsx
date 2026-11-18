'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LockKeyhole, ArrowRight, CreditCard, WalletCards } from 'lucide-react'
import { CashierDashboard } from '@/components/admin/cashier-dashboard'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { api, ApiError, setToken } from '@/lib/api'
import { decodeJwt } from '@/lib/jwt'

type StaffRole = 'admin' | 'caja'

function tokenValidoParaRol(role: StaffRole): boolean {
  const token = localStorage.getItem('teos-token')
  if (!token) return false
  const payload = decodeJwt(token)
  if (!payload) return false
  const vigente = typeof payload.exp === 'number' ? payload.exp * 1000 > Date.now() : true
  return payload.rol === role && vigente
}

function useStaffSession(role: StaffRole) {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!tokenValidoParaRol(role)) navigate(`/login${role}`, { replace: true })
    else setReady(true)
  }, [role, navigate])
  return {
    ready,
    logout: () => {
      setToken(null)
      navigate(`/login${role}`, { replace: true })
    },
  }
}

function StaffLogin({ role }: { role: StaffRole }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isAdmin = role === 'admin'

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await api.post<{ accessToken: string; user: { rol: string } }>('/auth/login', {
        email: email.trim(),
        password,
      })
      if (result.user.rol !== role) {
        setError('Esa cuenta no tiene acceso a esta sección.')
        return
      }
      setToken(result.accessToken)
      navigate(`/${role}`, { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background p-4 sm:p-6">
      <section className="w-full max-w-md rounded-3xl border border-primary/20 bg-card/80 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-primary/15 text-primary"><LockKeyhole className="size-7" /></div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary">La Bastarda Control</p>
          <h1 className="mt-3 text-3xl font-bold text-foreground">{isAdmin ? 'Acceso administrador' : 'Acceso a caja'}</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Ingresá tus credenciales para continuar.</p>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <label className="block space-y-2"><span className="text-sm font-medium">Email</span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={isAdmin ? 'admin@teos.com' : 'caja@teos.com'} className="h-14 w-full rounded-xl border border-border bg-secondary/60 px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30" /></label>
          <label className="block space-y-2"><span className="text-sm font-medium">Contraseña</span><input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" className="h-14 w-full rounded-xl border border-border bg-secondary/60 px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30" /></label>
          {error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <button disabled={loading} className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-60">{loading ? 'Ingresando…' : 'Ingresar'} <ArrowRight className="size-5" /></button>
        </form>
      </section>
    </main>
  )
}

export function CashierAccess() {
  const { ready, logout } = useStaffSession('caja')
  const [cardId, setCardId] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  if (!ready) return <main className="grid min-h-screen place-items-center bg-background text-muted-foreground">Verificando acceso…</main>

  const topUp = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')
    if (!cardId.trim() || Number(amount) <= 0) return setMessage('Completá la tarjeta y un monto válido.')
    setLoading(true)
    try {
      await api.post(`/tarjetas/${cardId.trim()}/cargar`, { monto: Number(amount), medioPago: 'efectivo' })
      setMessage(`Carga de $${Number(amount).toLocaleString('es-AR')} acreditada en ${cardId}.`)
      setAmount('')
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : 'No se pudo cargar el saldo.')
    } finally {
      setLoading(false)
    }
  }

  const topUpPanel = (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-lg shadow-primary/5 sm:p-7">
      <div className="mb-6"><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Operación empleados</p><h2 className="mt-1 text-2xl font-bold">Cargar saldo a tarjeta</h2><p className="mt-1 text-sm text-muted-foreground">Cargá saldo desde caja y entregá el comprobante al cliente.</p></div>
      <form onSubmit={topUp} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end"><label className="min-w-0 space-y-2"><span className="text-sm font-medium">Número de tarjeta</span><input value={cardId} onChange={(event) => setCardId(event.target.value)} placeholder="TEOS-2048" className="h-12 w-full rounded-xl border border-border bg-secondary/60 px-4 outline-none focus:border-primary" /></label><label className="min-w-0 space-y-2"><span className="text-sm font-medium">Monto</span><input value={amount} onChange={(event) => setAmount(event.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" placeholder="$ 0" className="h-12 w-full rounded-xl border border-border bg-secondary/60 px-4 outline-none focus:border-primary" /></label><button disabled={loading} className="h-12 rounded-xl bg-primary px-6 font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60">{loading ? 'Cargando…' : 'Confirmar carga'}</button></form>
      {message && <p className="mt-4 rounded-xl border border-primary/20 bg-primary/10 p-3 text-sm text-primary">{message}</p>}
    </section>
  )

  return <div className="relative"><CashierDashboard topUpPanel={topUpPanel} onLogout={logout} /></div>
}

export function AdminAccess() { return <StaffGate role="admin"><AdminDashboard /></StaffGate> }
export { StaffLogin }
export function LoginIcon({ role }: { role: StaffRole }) { return role === 'admin' ? <WalletCards className="size-5" /> : <CreditCard className="size-5" /> }
export function StaffLoginPage({ role }: { role: StaffRole }) { return <StaffLogin role={role} /> }

export function StaffGate({ role, children }: { role: StaffRole; children: React.ReactNode }) {
  const { ready } = useStaffSession(role)
  if (!ready) return <main className="grid min-h-screen place-items-center bg-background text-muted-foreground">Verificando acceso…</main>
  return <>{children}</>
}
