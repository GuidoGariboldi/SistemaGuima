import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Check, Loader2, X } from 'lucide-react'
import { api, ApiError } from '@/lib/api'
import { useAuth } from '@/context/auth-context'

const money = (value) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)

export default function CargaResultado() {
  const [searchParams] = useSearchParams()
  const { socio, loading } = useAuth()
  const navigate = useNavigate()
  const [estado, setEstado] = useState('cargando')
  const [tarjeta, setTarjeta] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (loading) return
    if (!socio) { setEstado('sin-sesion'); return }

    const paymentId = searchParams.get('payment_id') ?? searchParams.get('collection_id')
    if (!paymentId) { setEstado('sin-pago'); return }

    api
      .post('/pagos/confirmar', { paymentId })
      .then((data) => {
        setTarjeta(data.tarjeta)
        setEstado(data.estado === 'approved' ? 'aprobado' : data.estado)
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'No se pudo confirmar el pago.')
        setEstado('error')
      })
  }, [searchParams, socio, loading])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-4 text-center text-foreground">
      {estado === 'cargando' && (
        <>
          <Loader2 className="size-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Confirmando tu pago con Mercado Pago…</p>
        </>
      )}

      {estado === 'aprobado' && (
        <div className="mx-auto max-w-md rounded-3xl border border-primary/20 bg-card p-8 sm:p-12">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Check size={40} />
          </div>
          <h2 className="mt-7 text-3xl font-semibold">¡Listo, ya tenés saldo!</h2>
          {tarjeta && <p className="mt-3 text-sm text-muted-foreground">Nuevo saldo: <strong className="text-foreground">{money(tarjeta.saldo)}</strong></p>}
          <button onClick={() => navigate('/')} className="mt-8 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Volver al inicio</button>
        </div>
      )}

      {(estado === 'pending' || estado === 'in_process') && (
        <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 sm:p-12">
          <h2 className="text-2xl font-semibold">Tu pago está pendiente</h2>
          <p className="mt-3 text-sm text-muted-foreground">Mercado Pago todavía está procesando el pago. Cuando se apruebe, el saldo se acredita solo.</p>
          <button onClick={() => navigate('/')} className="mt-8 w-full rounded-xl border border-border px-4 py-3 text-sm hover:bg-muted">Volver al inicio</button>
        </div>
      )}

      {(estado === 'rejected' || estado === 'error' || estado === 'sin-pago') && (
        <div className="mx-auto max-w-md rounded-3xl border border-destructive/30 bg-card p-8 sm:p-12">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <X size={40} />
          </div>
          <h2 className="mt-7 text-2xl font-semibold">No se pudo acreditar el pago</h2>
          <p className="mt-3 text-sm text-muted-foreground">{error || 'El pago no fue aprobado por Mercado Pago.'}</p>
          <button onClick={() => navigate('/carga')} className="mt-8 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Volver a intentar</button>
        </div>
      )}

      {estado === 'sin-sesion' && (
        <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 sm:p-12">
          <h2 className="text-2xl font-semibold">Iniciá sesión para ver tu saldo</h2>
          <p className="mt-3 text-sm text-muted-foreground">Entrá a tu cuenta para que confirmemos la carga y veas tu nuevo saldo.</p>
          <button onClick={() => navigate('/')} className="mt-8 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Ir al inicio</button>
        </div>
      )}
    </main>
  )
}
