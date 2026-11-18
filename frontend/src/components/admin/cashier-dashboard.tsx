'use client'

import { useEffect, useMemo, useState, type ComponentType } from 'react'
import { sileo } from 'sileo'
import { Banknote, Check, CreditCard, Minus, Plus, Search, ShoppingCart, Smartphone, Trash2, TrendingUp, Wallet, X } from 'lucide-react'
import { api, ApiError } from '@/lib/api'
import { decodeJwt } from '@/lib/jwt'

type Producto = { id: string; nombre: string; categoria: string; precio: number; stock: number }
type CartLine = Producto & { cantidad: number }

const money = (value: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)

const MEDIOS_PAGO: [string, string, ComponentType<{ size?: number }>][] = [
  ['Efectivo', 'efectivo', Banknote],
  ['Mercado Pago', 'mercadopago', Smartphone],
  ['Tarjeta', 'tarjeta', CreditCard],
  ['Transferencia', 'transferencia', Wallet],
]

export function CashierDashboard({ topUpPanel, onLogout }: { topUpPanel?: React.ReactNode; onLogout?: () => void }) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todos')
  const [cart, setCart] = useState<CartLine[]>([])
  const [payment, setPayment] = useState<string | null>(null)
  const [caja, setCaja] = useState<{ id: string; nombre: string } | null>(null)
  const [turnoId, setTurnoId] = useState<string | null>(null)
  const [fondoInicial, setFondoInicial] = useState('')
  const [ventasTurno, setVentasTurno] = useState<{ total: number; cantidad: number; items: number }>({ total: 0, cantidad: 0, items: 0 })
  const [cargando, setCargando] = useState(true)
  const [cobrando, setCobrando] = useState(false)

  const email = useMemo(() => {
    const token = localStorage.getItem('teos-token')
    return token ? decodeJwt(token)?.email ?? '' : ''
  }, [])

  useEffect(() => {
    let activo = true
    async function init() {
      try {
        const [prods, cajas] = await Promise.all([
          api.get<Producto[]>('/productos?limit=100'),
          api.get<{ id: string; nombre: string }[]>('/cajas'),
        ])
        if (!activo) return
        setProductos(prods)
        const primeraCaja = cajas[0]
        setCaja(primeraCaja ?? null)
        if (primeraCaja) {
          try {
            const turno = await api.get<{ id: string }>(`/cajas/${primeraCaja.id}/turno-activo`)
            if (activo) setTurnoId(turno.id)
          } catch {
            if (activo) setTurnoId(null)
          }
        }
      } catch (error) {
        sileo.error({ title: error instanceof ApiError ? error.message : 'No se pudo conectar con el servidor' })
      } finally {
        if (activo) setCargando(false)
      }
    }
    init()
    return () => { activo = false }
  }, [])

  const refrescarVentasTurno = async (turno: string) => {
    try {
      const resumen = await api.get<{ total: number; cantidad: number; items: number }>(`/ventas/turno/${turno}/resumen`)
      setVentasTurno(resumen)
    } catch {
      // si falla el resumen no bloqueamos la caja
    }
  }

  useEffect(() => {
    if (turnoId) refrescarVentasTurno(turnoId)
  }, [turnoId])

  const abrirTurno = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!caja) return
    try {
      const turno = await api.post<{ id: string }>(`/cajas/${caja.id}/abrir-turno`, { fondoInicial: Number(fondoInicial) || 0 })
      setTurnoId(turno.id)
      sileo.success({ title: 'Turno abierto' })
    } catch (error) {
      sileo.error({ title: error instanceof ApiError ? error.message : 'No se pudo abrir el turno' })
    }
  }

  const cerrarTurno = async () => {
    if (!turnoId) return
    const declarado = window.prompt('¿Cuánto efectivo contaste en la caja?')
    if (declarado === null) return
    try {
      const resumen = await api.post<{ diferencia: number }>(`/turnos/${turnoId}/cerrar`, { efectivoDeclarado: Number(declarado) || 0 })
      sileo.success({ title: `Turno cerrado. Diferencia: ${money(resumen.diferencia)}` })
      setTurnoId(null)
      setVentasTurno({ total: 0, cantidad: 0, items: 0 })
    } catch (error) {
      sileo.error({ title: error instanceof ApiError ? error.message : 'No se pudo cerrar el turno' })
    }
  }

  const categories = ['Todos', ...Array.from(new Set(productos.map((p) => p.categoria)))]
  const filtered = productos.filter((p) => (category === 'Todos' || p.categoria === category) && `${p.nombre} ${p.categoria}`.toLowerCase().includes(query.toLowerCase()))
  const total = cart.reduce((sum, line) => sum + line.precio * line.cantidad, 0)
  const itemCount = cart.reduce((sum, line) => sum + line.cantidad, 0)

  const add = (producto: Producto) => setCart((current) => {
    const line = current.find((item) => item.id === producto.id)
    if (line) return current.map((item) => item.id === producto.id ? { ...item, cantidad: Math.min(item.cantidad + 1, producto.stock) } : item)
    return [...current, { ...producto, cantidad: 1 }]
  })
  const change = (id: string, amount: number) => setCart((current) => current.flatMap((line) => {
    if (line.id !== id) return [line]
    const cantidad = line.cantidad + amount
    return cantidad > 0 ? [{ ...line, cantidad }] : []
  }))

  const checkout = async () => {
    if (!payment) return sileo.warning({ title: 'Elegí un medio de pago' })
    if (!cart.length) return sileo.warning({ title: 'El carrito está vacío' })
    if (!caja || !turnoId) return sileo.warning({ title: 'Abrí el turno antes de cobrar' })

    setCobrando(true)
    try {
      await api.post('/ventas', {
        cajaId: caja.id,
        turnoId,
        medioPago: payment,
        items: cart.map((line) => ({ productoId: line.id, cantidad: line.cantidad })),
      })
      sileo.success({ title: `Venta cobrada con ${payment}` })
      setCart([])
      setPayment(null)
      const prods = await api.get<Producto[]>('/productos?limit=100')
      setProductos(prods)
      refrescarVentasTurno(turnoId)
    } catch (error) {
      sileo.error({ title: error instanceof ApiError ? error.message : 'No se pudo registrar la venta' })
    } finally {
      setCobrando(false)
    }
  }

  if (cargando) {
    return <main className="grid min-h-screen place-items-center bg-background text-muted-foreground">Cargando caja…</main>
  }

  if (caja && !turnoId) {
    return (
      <main className="grid min-h-screen place-items-center bg-background p-4">
        <form onSubmit={abrirTurno} className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Abrir turno · {caja.nombre}</h2>
          <label className="block space-y-2 text-sm">Fondo inicial
            <input value={fondoInicial} onChange={(e) => setFondoInicial(e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" placeholder="$ 0" className="mt-2 h-12 w-full rounded-xl border border-border bg-secondary/60 px-4 outline-none focus:border-primary" />
          </label>
          <button className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:brightness-110">Abrir turno</button>
          <button type="button" onClick={onLogout} className="h-10 w-full rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground">Cerrar sesión</button>
        </form>
      </main>
    )
  }

  return <div className="min-h-screen bg-background text-foreground"><aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-border/70 bg-card/95 p-7 lg:flex"><div className="font-serif text-3xl tracking-[0.24em]">La Bastarda<span className="text-primary">.</span></div><div className="mt-12"><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">Punto de venta</p><p className="mt-2 text-xs text-muted-foreground">{caja?.nombre ?? 'Caja'}</p></div><nav className="mt-10 space-y-2"><a href="#" className="flex items-center gap-3 rounded-xl bg-primary px-4 py-3 text-sm text-primary-foreground shadow-[0_0_25px_rgba(168,85,247,.25)]"><ShoppingCart size={18}/>Caja</a></nav><div className="mt-auto rounded-2xl border border-border/70 bg-muted/30 p-4"><p className="text-[10px] uppercase tracking-widest text-muted-foreground">Cajero activo</p><p className="mt-2 truncate text-sm font-medium">{email}</p><button onClick={cerrarTurno} className="mt-2 text-xs text-primary hover:underline">Cerrar turno</button></div></aside><main className="min-w-0 lg:pl-72"><header className="flex min-h-24 flex-col justify-between gap-4 border-b border-border/70 bg-background/80 px-5 py-5 backdrop-blur-xl sm:flex-row sm:items-center sm:px-10"><div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p><h1 className="mt-1 font-serif text-2xl">Caja de ventas</h1></div><div className="flex items-center gap-3"><div className="rounded-lg border border-border bg-card px-3 py-2 text-xs"><span className="text-muted-foreground">Caja abierta</span><span className="ml-2 inline-block size-2 rounded-full bg-emerald-400"/></div><button onClick={onLogout} className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:border-primary hover:text-foreground">Cerrar sesión</button></div></header><div className="mx-auto max-w-[1500px] space-y-7 p-5 sm:p-10">{topUpPanel}<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Stat icon={TrendingUp} label="Ventas del turno" value={money(ventasTurno.total)} caption="desde que abriste el turno"/><Stat icon={ShoppingCart} label="Operaciones" value={String(ventasTurno.cantidad)} caption="ventas registradas"/><Stat icon={Wallet} label="Ticket promedio" value={money(ventasTurno.cantidad ? ventasTurno.total / ventasTurno.cantidad : 0)} caption="por venta"/><Stat icon={PackageIcon} label="Productos vendidos" value={String(ventasTurno.items)} caption="unidades en este turno"/></div><div className="grid items-start gap-7 xl:grid-cols-[1fr_410px]"><section className="space-y-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">Catálogo / barra</p><h2 className="mt-2 text-3xl font-semibold">Productos</h2></div><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar producto..." className="h-11 w-full rounded-xl border border-border bg-card pl-9 pr-4 text-sm outline-none focus:border-primary sm:w-64"/></div></div><div className="flex gap-2 overflow-x-auto pb-1">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs transition ${category === item ? 'bg-primary text-primary-foreground' : 'border border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'}`}>{item}</button>)}</div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((producto) => <ProductCard key={producto.id} producto={producto} onAdd={() => add(producto)}/>)}</div></section><aside className="sticky top-5 overflow-hidden rounded-2xl border border-primary/25 bg-card shadow-[0_0_35px_rgba(168,85,247,.08)]"><div className="flex items-center justify-between border-b border-border/70 bg-primary/5 p-5"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Orden actual</p><h2 className="mt-1 text-xl font-semibold">Carrito <span className="text-sm font-normal text-muted-foreground">({itemCount})</span></h2></div><ShoppingCart className="text-primary" size={22}/></div><div className="max-h-[360px] min-h-40 space-y-3 overflow-y-auto p-5">{cart.length ? cart.map((line) => <div key={line.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 p-3"><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{line.nombre}</p><p className="mt-1 text-xs text-primary">{money(line.precio)} · {money(line.precio * line.cantidad)}</p></div><div className="flex items-center gap-2"><button aria-label={`Restar ${line.nombre}`} onClick={() => change(line.id, -1)} className="flex size-7 items-center justify-center rounded-md border border-border hover:border-primary"><Minus size={13}/></button><span className="w-4 text-center text-sm">{line.cantidad}</span><button aria-label={`Sumar ${line.nombre}`} onClick={() => change(line.id, 1)} className="flex size-7 items-center justify-center rounded-md border border-border hover:border-primary"><Plus size={13}/></button></div><button aria-label={`Eliminar ${line.nombre}`} onClick={() => setCart((current) => current.filter((item) => item.id !== line.id))} className="text-muted-foreground hover:text-destructive"><Trash2 size={15}/></button></div>) : <div className="flex h-36 flex-col items-center justify-center text-center"><ShoppingCart size={28} className="text-muted-foreground/40"/><p className="mt-3 text-sm text-muted-foreground">Tu carrito está vacío</p><p className="mt-1 text-xs text-muted-foreground/70">Agregá productos para comenzar</p></div>}</div><div className="border-t border-border/70 p-5"><div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>{money(total)}</span></div><div className="mt-3 flex justify-between text-lg font-semibold"><span>Total</span><span className="text-primary">{money(total)}</span></div><p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Medio de pago</p><div className="mt-3 grid grid-cols-2 gap-2">{MEDIOS_PAGO.map(([label, valor, Icon]) => <button key={valor} onClick={() => setPayment(valor)} className={`flex items-center gap-2 rounded-lg border p-3 text-xs transition ${payment === valor ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}><Icon size={15}/>{label}</button>)}</div><button onClick={checkout} disabled={!cart.length || cobrando} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-medium text-primary-foreground transition hover:shadow-[0_0_25px_rgba(168,85,247,.35)] disabled:cursor-not-allowed disabled:opacity-40"><Check size={17}/>{cobrando ? 'Cobrando…' : `Cobrar ${total ? money(total) : ''}`}</button></div></aside></div></div></main></div>
}

function Stat({ icon: Icon, label, value, caption }: { icon: ComponentType<{ size?: number; className?: string }>; label: string; value: string; caption: string }) { return <div className="rounded-2xl border border-border/70 bg-card p-4"><div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">{label}</p><Icon size={16} className="text-primary"/></div><p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p><p className="mt-2 text-[11px] text-primary">{caption}</p></div> }
function ProductCard({ producto, onAdd }: { producto: Producto; onAdd: () => void }) { const available = producto.stock > 0; return <article className={`rounded-2xl border bg-card p-4 transition ${available ? 'border-border/70 hover:-translate-y-1 hover:border-primary/50' : 'border-border/40 opacity-60'}`}><div className="flex items-start justify-between gap-3"><div><span className="text-[10px] uppercase tracking-widest text-primary">{producto.categoria}</span><h3 className="mt-2 font-medium">{producto.nombre}</h3></div><span className={`rounded-full px-2 py-1 text-[10px] ${available ? producto.stock < 10 ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400' : 'bg-destructive/10 text-destructive'}`}>{available ? `${producto.stock} en stock` : 'Sin stock'}</span></div><div className="mt-6 flex items-center justify-between"><p className="text-lg font-semibold">{money(producto.precio)}</p><button disabled={!available} onClick={onAdd} className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"><Plus size={15}/>Agregar</button></div></article> }
function PackageIcon({ size, className }: { size?: number; className?: string }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/></svg> }
