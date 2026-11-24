'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Check, IdCard, LogOut, Loader2, ShieldAlert, X } from 'lucide-react'
import { api, ApiError, setToken } from '@/lib/api'

const fechaCorta = (iso?: string) => iso ? new Date(iso).toLocaleDateString('es-AR') : ''

function calcularEdad(fechaNac?: string | null) {
  if (!fechaNac) return null
  const nacimiento = new Date(fechaNac)
  const hoy = new Date()
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const todaviaNoCumplio = hoy.getMonth() < nacimiento.getMonth() || (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate())
  if (todaviaNoCumplio) edad--
  return edad
}

type Resultado = {
  socio: { id: string; nombre: string; apellido: string; email: string; fecha_nac: string | null; dni: string; bloqueado: boolean; motivo_bloqueo: string | null; bloqueado_hasta: string | null }
  entrada: { id: string; estado: string; used_at: string | null; created_at: string; tipo_entrada_nombre: string } | null
}

export function ControlAcceso() {
  const navigate = useNavigate()
  const [eventos, setEventos] = useState<any[]>([])
  const [eventoId, setEventoId] = useState('')
  const [dni, setDni] = useState('')
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [marcando, setMarcando] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    api.get<any[]>('/eventos?limit=100').then((data) => {
      setEventos(data)
      if (data.length > 0) setEventoId(data[0].id)
    }).catch(() => setEventos([]))
  }, [])

  useEffect(() => { inputRef.current?.focus() }, [resultado])

  const buscar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!dni.trim() || !eventoId) return
    setError('')
    setLoading(true)
    try {
      const data = await api.get<Resultado>(`/socios/buscar-por-dni/${dni.trim()}?eventoId=${eventoId}`)
      setResultado(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo buscar ese DNI.')
    } finally {
      setLoading(false)
    }
  }

  const otraPersona = () => { setResultado(null); setDni(''); setError('') }

  const marcarIngreso = async () => {
    if (!resultado?.entrada) return
    setMarcando(true)
    try {
      await api.patch(`/entradas/${resultado.entrada.id}/usar`, {})
      setResultado({ ...resultado, entrada: { ...resultado.entrada, estado: 'usada', used_at: new Date().toISOString() } })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo marcar el ingreso.')
    } finally {
      setMarcando(false)
    }
  }

  const edad = resultado ? calcularEdad(resultado.socio.fecha_nac) : null

  return (
    <main className="min-h-screen bg-background text-foreground">
      <button onClick={() => { setToken(null); navigate('/loginseguridad', { replace: true }) }} className="fixed right-4 top-4 flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground"><LogOut size={14} />Salir</button>
      <section className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-4 py-10">
        <h1 className="text-center text-3xl font-semibold tracking-tight">Control de acceso</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Pedí el DNI y escaneá o escribilo acá.</p>

        <label className="mt-6 flex w-full max-w-sm flex-col gap-2 text-xs font-medium">
          <span className="text-muted-foreground">Evento de esta noche</span>
          <select value={eventoId} onChange={(e) => { setEventoId(e.target.value); otraPersona() }} className="h-12 rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary">
            {eventos.length === 0 && <option value="">Sin eventos cargados</option>}
            {eventos.map((evento) => <option key={evento.id} value={evento.id}>{evento.nombre} · {fechaCorta(evento.fecha)}</option>)}
          </select>
        </label>

        {!resultado ? (
          <form onSubmit={buscar} className="mt-6 w-full max-w-sm">
            <div className="relative">
              <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                ref={inputRef}
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                inputMode="numeric"
                placeholder="DNI sin puntos"
                autoFocus
                className="h-14 w-full rounded-2xl border border-border bg-card pl-12 pr-4 text-center font-mono text-lg tracking-widest outline-none focus:border-primary"
              />
            </div>
            {error && <p className="mt-3 text-center text-sm text-destructive" role="alert">{error}</p>}
            <button disabled={loading || !dni.trim() || !eventoId} type="submit" className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
              {loading ? <Loader2 className="size-5 animate-spin" /> : <IdCard size={18} />}
              {loading ? 'Buscando…' : 'Buscar'}
            </button>
          </form>
        ) : (
          <div className="mt-6 w-full max-w-sm">
            {resultado.socio.bloqueado && (
              <div className="mb-4 flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/15 p-4">
                <ShieldAlert className="mt-0.5 shrink-0 text-destructive" size={22} />
                <div><p className="font-semibold text-destructive">Socio bloqueado</p><p className="mt-1 text-sm text-destructive/90">{resultado.socio.motivo_bloqueo}</p>{resultado.socio.bloqueado_hasta && <p className="mt-1 text-xs text-destructive/80">Hasta {fechaCorta(resultado.socio.bloqueado_hasta)}</p>}</div>
              </div>
            )}

            <div className="rounded-2xl border border-border/70 bg-card p-5">
              <h2 className="text-xl font-semibold">{resultado.socio.nombre} {resultado.socio.apellido}</h2>
              <p className="mt-1 font-mono text-xs text-muted-foreground">DNI {resultado.socio.dni}</p>

              <div className="mt-4 flex items-center gap-2 text-sm">
                {edad === null ? (
                  <span className="flex items-center gap-1.5 text-muted-foreground"><AlertTriangle size={15} /> Sin fecha de nacimiento cargada — verificá la edad con el DNI físico</span>
                ) : (
                  <span className="flex items-center gap-1.5"><Check size={15} className="text-primary" /> {edad} años</span>
                )}
              </div>

              <div className="mt-4 border-t border-border/60 pt-4">
                {!resultado.entrada ? (
                  <p className="flex items-center gap-2 text-sm text-destructive"><X size={16} /> No tiene entrada para este evento</p>
                ) : resultado.entrada.estado === 'usada' ? (
                  <p className="flex items-center gap-2 text-sm text-amber-400"><AlertTriangle size={16} /> Entrada {resultado.entrada.tipo_entrada_nombre} — ya ingresó{resultado.entrada.used_at ? ` (${fechaCorta(resultado.entrada.used_at)})` : ''}</p>
                ) : (
                  <p className="flex items-center gap-2 text-sm text-primary"><Check size={16} /> Entrada {resultado.entrada.tipo_entrada_nombre} válida</p>
                )}
              </div>
            </div>

            {resultado.entrada?.estado === 'valida' && (
              <button disabled={marcando} onClick={marcarIngreso} className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
                {marcando ? <Loader2 className="size-5 animate-spin" /> : <Check size={18} />}
                Marcar ingreso
              </button>
            )}

            {error && <p className="mt-3 text-center text-sm text-destructive" role="alert">{error}</p>}
            <button onClick={otraPersona} className="mt-4 w-full rounded-2xl border border-border px-4 py-3 text-sm text-muted-foreground hover:text-foreground">Buscar otra persona</button>
          </div>
        )}
      </section>
    </main>
  )
}
