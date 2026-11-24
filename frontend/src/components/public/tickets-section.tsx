'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, Calendar, Check, IdCard, Loader2, ShieldCheck, Ticket, UserCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { api, ApiError } from '@/lib/api'

const money = (value) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)
const fecha = (iso) => iso ? new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }) : ''

export function TicketsSection() {
  const { socio } = useAuth()
  const navigate = useNavigate()
  const [eventos, setEventos] = useState<any[]>([])
  const [eventoId, setEventoId] = useState('')
  const [tiposEntrada, setTiposEntrada] = useState<any[]>([])
  const [comprando, setComprando] = useState('')
  const [error, setError] = useState('')
  const [comprada, setComprada] = useState<any>(null)
  const [confirmando, setConfirmando] = useState<any>(null)

  useEffect(() => {
    api.get<any[]>('/eventos?limit=20').then((data) => {
      setEventos(data)
      if (data.length > 0) setEventoId(data[0].id)
    }).catch(() => setEventos([]))
  }, [])

  useEffect(() => {
    if (!eventoId) { setTiposEntrada([]); return }
    api.get<any>(`/eventos/${eventoId}`).then((data) => setTiposEntrada(data.tiposEntrada ?? [])).catch(() => setTiposEntrada([]))
  }, [eventoId])

  const confirmarCompra = async () => {
    if (!confirmando) return
    setError('')
    setComprando(confirmando.id)
    try {
      const entrada = await api.post('/entradas', { tipoEntradaId: confirmando.id, medioPago: 'saldo' })
      setComprada(entrada)
      setConfirmando(null)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo comprar la entrada.')
    } finally {
      setComprando('')
    }
  }

  const eventoSeleccionado = eventos.find((e) => e.id === eventoId)

  return <section id="entradas" className="relative py-16 sm:py-24"><div className="container mx-auto px-4">
    <div className="mx-auto max-w-3xl text-center">
      <span className="mb-4 inline-block rounded-full border border-primary/30 px-4 py-2 text-sm font-medium text-primary">Entradas</span>
      <h2 className="mb-4 text-4xl font-bold md:text-5xl">Conseguí tu <span className="gradient-text">entrada</span></h2>
      <p className="text-muted-foreground">Comprá con el saldo de tu tarjeta La Bastarda y tu entrada queda lista al instante.</p>
    </div>

    {comprada ? (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-12 max-w-md glass rounded-3xl p-8 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary"><Check size={32} /></div>
        <h3 className="mt-5 text-2xl font-bold">¡Entrada confirmada!</h3>
        <p className="mt-2 text-sm text-muted-foreground">{money(comprada.precio)} descontados de tu saldo.</p>
        <div className="mt-6 space-y-3 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-left text-sm text-muted-foreground">
          <p className="flex gap-2"><IdCard className="mt-0.5 shrink-0 text-primary" size={17} />Llevá tu DNI — en la puerta te lo escanean a vos, no a esta pantalla.</p>
          <p className="flex gap-2"><UserCheck className="mt-0.5 shrink-0 text-primary" size={17} />Es personal e intransferible: solo entra el titular de la entrada.</p>
        </div>
        <Button onClick={() => setComprada(null)} className="mt-6 w-full bg-primary">Volver</Button>
      </motion.div>
    ) : eventos.length === 0 ? (
      <p className="mt-12 text-center text-muted-foreground">Todavía no hay eventos con entradas disponibles.</p>
    ) : (
      <div className="mx-auto mt-12 max-w-4xl">
        <div className="mx-auto mb-8 flex max-w-md flex-col gap-2 text-sm font-medium">
          <span className="flex items-center gap-2 text-muted-foreground"><Calendar size={15} />Elegí el evento</span>
          <select value={eventoId} onChange={(e) => setEventoId(e.target.value)} className="h-12 rounded-xl border border-border bg-card px-3 outline-none focus:border-primary">
            {eventos.map((evento) => <option key={evento.id} value={evento.id}>{evento.nombre} · {fecha(evento.fecha)}</option>)}
          </select>
        </div>

        {!socio ? (
          <p className="text-center text-sm text-muted-foreground">Iniciá sesión con tu cuenta La Bastarda para comprar entradas.</p>
        ) : tiposEntrada.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">Este evento todavía no tiene tipos de entrada cargados.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {tiposEntrada.map((tipo) => {
              const disponibles = tipo.cupo - tipo.vendidas
              return (
                <motion.div key={tipo.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-6">
                  <div className="flex items-center justify-between"><div className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary"><Ticket /></div><span className="text-2xl font-bold gradient-text">{money(tipo.precio)}</span></div>
                  <h3 className="mt-5 text-xl font-bold">{tipo.nombre}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{disponibles > 0 ? `${disponibles} disponibles` : 'Sin cupo'}</p>
                  {tipo.beneficios?.length > 0 && <ul className="mt-4 space-y-2">{tipo.beneficios.map((b) => <li key={b} className="flex gap-2 text-sm"><Check className="size-4 shrink-0 text-primary" />{b}</li>)}</ul>}
                  <Button disabled={disponibles <= 0} onClick={() => { setError(''); setConfirmando(tipo) }} className="mt-6 w-full bg-primary text-primary-foreground neon-glow hover:bg-primary/90">
                    {disponibles <= 0 ? 'Sin cupo' : 'Comprar con mi saldo'}
                  </Button>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    )}

    <div className="mx-auto mt-12 max-w-2xl glass rounded-3xl border border-primary/25 p-6 text-center">
      <AlertTriangle className="mx-auto size-8 text-primary" />
      <h3 className="mt-3 text-lg font-bold">Edad mínima según la noche</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Cada evento tiene su propia edad mínima. Si no la cumplís, no ingresás aunque hayas pagado la entrada — no hay devoluciones por eso.</p>
    </div>

    {confirmando && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass relative w-full max-w-md rounded-3xl p-6 sm:p-8">
          <button onClick={() => setConfirmando(null)} className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/10" aria-label="Cerrar"><X className="h-5 w-5" /></button>
          <h3 className="text-2xl font-bold">Confirmá tu compra</h3>
          <div className="mt-5 rounded-2xl border border-border bg-background/40 p-5">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Evento</span><span className="font-medium">{eventoSeleccionado?.nombre}</span></div>
            <div className="mt-2 flex justify-between text-sm"><span className="text-muted-foreground">Entrada</span><span className="font-medium">{confirmando.nombre}</span></div>
            <div className="my-4 h-px bg-border" />
            <div className="flex justify-between"><span className="font-medium">Se va a descontar de tu saldo</span><strong className="text-xl text-primary">{money(confirmando.precio)}</strong></div>
          </div>

          <div className="mt-5 space-y-3 text-sm text-muted-foreground">
            <p className="flex gap-2"><UserCheck className="mt-0.5 shrink-0 text-primary" size={17} />La entrada es personal: queda a tu nombre y no se puede transferir a otra persona.</p>
            <p className="flex gap-2"><IdCard className="mt-0.5 shrink-0 text-primary" size={17} />En la puerta te escanean el DNI — no hace falta mostrar nada más.</p>
            <p className="flex gap-2"><ShieldCheck className="mt-0.5 shrink-0 text-primary" size={17} />Si todo está en regla (entrada válida, edad, sin bloqueos), pasás directo.</p>
          </div>

          {error && (
            <div className="mt-4">
              <p className="text-sm text-destructive" role="alert">{error}</p>
              {error.toLowerCase().includes('saldo') && (
                <button onClick={() => { setConfirmando(null); navigate('/carga') }} className="mt-1 text-sm text-primary hover:underline">Cargar saldo</button>
              )}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button onClick={() => { setConfirmando(null); setError('') }} className="flex-1 rounded-xl border border-border px-4 py-3 text-sm hover:bg-muted">Cancelar</button>
            <button disabled={!!comprando} onClick={confirmarCompra} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
              {comprando ? <Loader2 size={16} className="animate-spin" /> : null}
              {comprando ? 'Comprando…' : 'Confirmar compra'}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </div></section>
}
