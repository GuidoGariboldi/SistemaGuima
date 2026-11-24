'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CreditCard, Loader2, ScanLine, ShieldCheck } from 'lucide-react'
import { api, ApiError } from '@/lib/api'

const money = (value: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)

type Tarjeta = { card_uid: string; saldo: number; nivel: string; estado: string; socio_nombre: string | null; socio_apellido: string | null; socio_email: string | null }

export function CardScannerTerminal() {
  const [cardUid, setCardUid] = useState('')
  const [tarjeta, setTarjeta] = useState<Tarjeta | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [monto, setMonto] = useState('')
  const [cargando, setCargando] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // La mayoría de los lectores NFC/RFID USB se comportan como un teclado:
  // "tipean" el código de la tarjeta y mandan Enter solos. Por eso alcanza
  // con tener el input siempre enfocado, sin necesidad de driver propio.
  useEffect(() => { inputRef.current?.focus() }, [tarjeta])

  const buscar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!cardUid.trim()) return
    setError('')
    setLoading(true)
    try {
      const data = await api.get<Tarjeta>(`/tarjetas/${cardUid.trim()}`)
      setTarjeta(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo buscar la tarjeta.')
    } finally {
      setLoading(false)
    }
  }

  const otraTarjeta = () => { setTarjeta(null); setCardUid(''); setMonto(''); setError('') }

  const cargarEfectivo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!tarjeta) return
    const numericMonto = Number(monto)
    if (!numericMonto || numericMonto < 1) return
    setCargando(true)
    setError('')
    try {
      const actualizada = await api.patch<Tarjeta>(`/tarjetas/${tarjeta.card_uid}/cargar`, { monto: numericMonto, medioPago: 'efectivo' })
      setTarjeta(actualizada)
      setMonto('')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo cargar el saldo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-4 py-10">
        {!tarjeta ? (
          <>
            <div className="flex size-24 items-center justify-center rounded-[2rem] border border-border/80 bg-card shadow-2xl">
              <ScanLine size={44} className="text-primary" />
            </div>
            <h1 className="mt-8 text-center text-3xl font-semibold tracking-tight">Buscar tarjeta</h1>
            <p className="mt-3 max-w-md text-center text-sm text-muted-foreground">Escaneá el código con el lector o escribilo a mano.</p>

            <form onSubmit={buscar} className="mt-8 w-full max-w-sm">
              <input
                ref={inputRef}
                value={cardUid}
                onChange={(e) => setCardUid(e.target.value.toUpperCase())}
                placeholder="LB-XXXXXX"
                autoFocus
                className="h-14 w-full rounded-2xl border border-border bg-card px-5 text-center font-mono text-lg uppercase tracking-widest outline-none focus:border-primary"
              />
              {error && <p className="mt-3 text-center text-sm text-destructive" role="alert">{error}</p>}
              <button disabled={loading || !cardUid.trim()} type="submit" className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
                {loading ? <Loader2 className="size-5 animate-spin" /> : <ScanLine size={18} />}
                {loading ? 'Buscando…' : 'Buscar'}
              </button>
            </form>

            <div className="mt-10 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck size={14} className="text-primary" /> El saldo siempre se consulta en vivo, nunca queda cacheado.</div>
          </>
        ) : (
          <div className="w-full max-w-md">
            <div className="rounded-[2rem] border border-primary/30 bg-card/95 p-5 shadow-2xl shadow-primary/15">
              <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
                <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{tarjeta.card_uid}</p><p className="mt-1 text-xs text-muted-foreground">{tarjeta.socio_email ? `${tarjeta.socio_nombre} ${tarjeta.socio_apellido}` : 'Sin asignar'}</p></div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${tarjeta.estado === 'activa' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>{tarjeta.estado}</span>
              </div>
              <div className="relative mb-4 min-h-32 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/80 via-primary/35 to-background p-4 text-primary-foreground shadow-lg">
                <div className="flex items-start justify-between"><span className="text-xs font-bold tracking-[0.25em]">La Bastarda</span><CreditCard size={19} className="opacity-80" /></div>
                <p className="mt-8 text-2xl font-bold">{money(tarjeta.saldo)}</p>
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-3 text-sm"><span className="text-muted-foreground">Nivel</span><span className="font-medium">{tarjeta.nivel}</span></div>
            </div>

            {tarjeta.estado === 'activa' ? (
              <form onSubmit={cargarEfectivo} className="mt-5 rounded-2xl border border-border bg-card p-4">
                <p className="text-xs font-medium text-muted-foreground">Cargar saldo en efectivo</p>
                <div className="mt-2 flex gap-2">
                  <input value={monto} onChange={(e) => setMonto(e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" placeholder="$ 0" className="h-12 flex-1 rounded-xl border border-border bg-background px-4 outline-none focus:border-primary" />
                  <button disabled={cargando || !monto} type="submit" className="rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-40">{cargando ? <Loader2 className="size-4 animate-spin" /> : 'Cargar'}</button>
                </div>
              </form>
            ) : (
              <p className="mt-5 rounded-2xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">Esta tarjeta no está activa — no se le puede cargar saldo.</p>
            )}

            {error && <p className="mt-3 text-center text-sm text-destructive" role="alert">{error}</p>}
            <button onClick={otraTarjeta} className="mt-5 w-full rounded-2xl border border-border px-4 py-3 text-sm text-muted-foreground hover:text-foreground">Buscar otra tarjeta</button>
          </div>
        )}
      </section>
    </main>
  )
}
