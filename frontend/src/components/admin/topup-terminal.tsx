'use client'

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, CircleDollarSign, CreditCard, Delete, ExternalLink, Loader2, ShieldCheck, Sparkles } from 'lucide-react'
import { api, ApiError } from '@/lib/api'
import { useAuth } from '@/context/auth-context'

const quickAmounts = [5000, 10000, 20000, 30000]
const money = (value: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)
const POLL_MS = 3000

type Step = 'amount' | 'review' | 'esperando' | 'exito'

export function TopupTerminal() {
  const { socio, loading } = useAuth()
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [step, setStep] = useState<Step>('amount')
  const [error, setError] = useState('')
  const [externalReference, setExternalReference] = useState('')
  const [nuevoSaldo, setNuevoSaldo] = useState<number | null>(null)
  const [verificando, setVerificando] = useState(false)
  const pollRef = useRef<number | null>(null)
  const numericAmount = Number(amount) || 0

  const detenerPolling = () => {
    if (pollRef.current) {
      window.clearInterval(pollRef.current)
      pollRef.current = null
    }
  }
  useEffect(() => detenerPolling, [])

  const append = (digit: string) => setAmount((value) => (value.length >= 7 ? value : `${value}${digit}`.replace(/^0+(?=\d)/, '')))
  const removeLast = () => setAmount((value) => value.slice(0, -1))
  const beginPayment = () => { if (numericAmount >= 1000) setStep('review') }

  const chequearPago = async (ref: string) => {
    setVerificando(true)
    try {
      const resultado = await api.post<{ estado: string; tarjeta: { saldo: number } | null }>('/pagos/verificar', { externalReference: ref })
      if (resultado.estado === 'approved' && resultado.tarjeta) {
        detenerPolling()
        setNuevoSaldo(resultado.tarjeta.saldo)
        setStep('exito')
      }
    } catch (err) {
      // Un fallo puntual de red no corta el polling, solo lo intentamos de nuevo en el próximo tick.
      console.error('Error verificando el pago:', err)
    } finally {
      setVerificando(false)
    }
  }

  // Mercado Pago no tiene a dónde redirigir de vuelta en desarrollo local
  // (no hay dominio público), así que el checkout se abre en otra pestaña
  // y esta se queda preguntando — contra la API real de MP, nunca
  // confiando en nada que diga el navegador — si ya se aprobó.
  const pagarConMercadoPago = async () => {
    setError('')
    try {
      const result = await api.post<{ initPoint: string; externalReference: string }>('/pagos/cargar-saldo', { monto: numericAmount })
      if (!result.initPoint) throw new Error('Mercado Pago no devolvió un link de pago.')
      window.open(result.initPoint, '_blank', 'noopener,noreferrer')
      setExternalReference(result.externalReference)
      setStep('esperando')
      pollRef.current = window.setInterval(() => chequearPago(result.externalReference), POLL_MS)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo iniciar el pago. Probá de nuevo.')
    }
  }

  const cancelar = () => {
    detenerPolling()
    setStep('amount')
    setAmount('')
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </main>
    )
  }

  if (!socio) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center text-foreground">
        <h2 className="text-2xl font-semibold">Necesitás iniciar sesión</h2>
        <p className="max-w-sm text-sm text-muted-foreground">Para cargar saldo primero tenés que entrar con tu cuenta La Bastarda.</p>
      </main>
    )
  }

  if (step === 'exito') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-4 text-center text-foreground">
        <div className="mx-auto w-full max-w-md rounded-3xl border border-primary/20 bg-card p-8 sm:p-12">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary/15 text-primary"><Check size={40} /></div>
          <h2 className="mt-7 text-3xl font-semibold">¡Listo, ya tenés saldo!</h2>
          {nuevoSaldo !== null && <p className="mt-3 text-sm text-muted-foreground">Nuevo saldo: <strong className="text-foreground">{money(nuevoSaldo)}</strong></p>}
          <button onClick={() => navigate('/')} className="mt-8 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Volver al inicio</button>
        </div>
      </main>
    )
  }

  if (step === 'esperando') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-4 text-center text-foreground">
        <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-8 sm:p-12">
          <ExternalLink className="mx-auto size-10 text-primary" />
          <h2 className="mt-5 text-2xl font-semibold">Pagá en la otra pestaña</h2>
          <p className="mt-3 text-sm text-muted-foreground">Se abrió Mercado Pago en una pestaña nueva. Cuando termines de pagar, volvé acá — lo vamos a detectar solos.</p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"><Loader2 className="size-4 animate-spin text-primary" />Esperando confirmación…</div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button onClick={cancelar} className="flex-1 rounded-xl border border-border px-4 py-3 text-sm hover:bg-muted">Cancelar</button>
            <button disabled={verificando} onClick={() => chequearPago(externalReference)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">{verificando ? <Loader2 size={16} className="animate-spin" /> : null}Ya pagué, verificar</button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-6xl min-w-0 px-4 py-6 sm:px-10 sm:py-8 lg:py-12">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm text-primary">Carga de saldo</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Poné saldo en tu La Bastarda Card</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">Elegí cuánto querés cargar y pagá con Mercado Pago. El saldo se acredita apenas confirma el pago.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">{step === 'amount' ? '1' : '2'}</span>
            <span>Proceso seguro</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-2xl sm:p-8">
            {step === 'amount' ? (
              <AmountPicker amount={amount} numericAmount={numericAmount} append={append} removeLast={removeLast} onReset={() => setAmount('')} onContinue={beginPayment} />
            ) : (
              <Review amount={numericAmount} error={error} onContinue={pagarConMercadoPago} onBack={() => setStep('amount')} />
            )}
          </div>
          <aside className="space-y-4">
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary"><CircleDollarSign size={24} /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Saldo a cargar</p>
                  <p className="text-2xl font-semibold">{money(numericAmount)}</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-border/70 bg-card p-6">
              <div className="flex items-center gap-2 text-primary"><Sparkles size={16} /><p className="text-sm font-medium">Tips para cargar</p></div>
              <ul className="mt-4 space-y-3 text-xs leading-relaxed text-muted-foreground">
                <li>• Mínimo de carga: $1.000</li>
                <li>• Mercado Pago se abre en una pestaña nueva</li>
                <li>• El saldo se acredita en tu tarjeta vinculada apenas pagás</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

function AmountPicker({ amount, numericAmount, append, removeLast, onReset, onContinue }: { amount: string; numericAmount: number; append: (digit: string) => void; removeLast: () => void; onReset: () => void; onContinue: () => void }) {
  return <><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-primary">Paso 1</p><h3 className="mt-2 text-xl font-semibold">Elegí el monto</h3></div><span className="rounded-full bg-muted px-3 py-1 text-[11px] text-muted-foreground">Touch friendly</span></div><div className="mt-8 rounded-2xl border border-border bg-background/60 p-5 text-center"><p className="text-xs text-muted-foreground">Monto a cargar</p><p className="mt-2 text-4xl font-semibold tracking-tight">{numericAmount ? money(numericAmount) : '$ 0'}</p></div><div className="mt-5 grid grid-cols-4 gap-2">{quickAmounts.map((value) => <button key={value} onClick={() => append(String(value))} className="rounded-xl border border-border bg-muted/40 py-3 text-xs font-medium transition hover:border-primary hover:bg-primary/10">+{money(value)}</button>)}</div><div className="mx-auto mt-5 grid max-w-sm grid-cols-3 gap-3">{['1','2','3','4','5','6','7','8','9','00','0'].map((digit) => <button key={digit} onClick={() => append(digit)} className="h-14 rounded-2xl border border-border bg-muted/30 text-lg font-medium transition active:scale-95 hover:border-primary hover:bg-primary/10">{digit}</button>)}<button onClick={removeLast} aria-label="Borrar último número" className="flex h-14 items-center justify-center rounded-2xl border border-border bg-muted/30 transition hover:border-primary hover:bg-primary/10"><Delete size={20}/></button></div><div className="mt-5 flex gap-3"><button onClick={onReset} className="flex-1 rounded-xl border border-border px-4 py-3 text-sm transition hover:bg-muted">Limpiar</button><button disabled={numericAmount < 1000} onClick={onContinue} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">Continuar<ChevronRight size={17}/></button></div></>
}

function Review({ amount, error, onContinue, onBack }: { amount: number; error: string; onContinue: () => void; onBack: () => void }) {
  return <><p className="text-xs uppercase tracking-[0.2em] text-primary">Paso 2</p><h3 className="mt-2 text-xl font-semibold">Revisá tu carga</h3><div className="mt-8 rounded-2xl border border-border bg-muted/30 p-6"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Carga La Bastarda Card</span><span>{money(amount)}</span></div><div className="my-5 h-px bg-border"/><div className="flex justify-between"><span className="font-medium">Total a pagar</span><strong className="text-2xl text-primary">{money(amount)}</strong></div></div><div className="mt-5 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-muted-foreground"><ShieldCheck className="mt-0.5 shrink-0 text-primary" size={17}/>Mercado Pago se va a abrir en una pestaña nueva para completar el pago de forma segura.</div>{error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}<div className="mt-8 flex gap-3"><button onClick={onBack} className="flex-1 rounded-xl border border-border px-4 py-3 text-sm hover:bg-muted">Atrás</button><button onClick={onContinue} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Pagar con Mercado Pago<ExternalLink size={16}/></button></div></>
}

export function TopupIcon() { return <CreditCard size={18} /> }
