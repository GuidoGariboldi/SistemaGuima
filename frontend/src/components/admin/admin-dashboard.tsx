'use client'

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { ArrowUpRight, BarChart3, Calendar, ChevronRight, CreditCard, Download, FileText, Home, Menu, Package, Plus, Search, Settings, ShieldCheck, ShoppingBag, Ticket, Trash2, UserCog, Users, X } from 'lucide-react'
import { sileo } from 'sileo'
import { api, ApiError } from '@/lib/api'
import { exportarReportePDF } from '@/lib/pdf'

const money = (value: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)
const fechaCorta = (iso?: string) => iso ? new Date(iso).toLocaleDateString('es-AR') : ''
const fechaHora = (iso?: string) => iso ? new Date(iso).toLocaleString('es-AR') : ''

type Section = 'Resumen' | 'Estadísticas' | 'Informes' | 'Eventos' | 'Entradas' | 'Bar & productos' | 'Usuarios' | 'Tarjetas' | 'Personal' | 'Configuración'
const nav: { label: Section; icon: typeof Home; hint: string }[] = [
  { label: 'Resumen', icon: Home, hint: 'Vista general' }, { label: 'Estadísticas', icon: BarChart3, hint: 'Métricas y análisis' }, { label: 'Informes', icon: FileText, hint: 'Cierres de caja y reportes' }, { label: 'Eventos', icon: Calendar, hint: 'Agenda y shows' }, { label: 'Entradas', icon: Ticket, hint: 'Tipos y ventas' }, { label: 'Bar & productos', icon: ShoppingBag, hint: 'Carta y stock' }, { label: 'Usuarios', icon: Users, hint: 'Comunidad La Bastarda' }, { label: 'Tarjetas', icon: CreditCard, hint: 'Tarjetas La Bastarda' }, { label: 'Personal', icon: UserCog, hint: 'Cuentas de staff' },
]
const titles: Record<Section, string> = { Resumen: 'Resumen general', Estadísticas: 'Estadísticas', Informes: 'Informes', Eventos: 'Eventos', Entradas: 'Entradas y ventas', 'Bar & productos': 'Bar & productos', Usuarios: 'Usuarios', Tarjetas: 'Tarjetas', Personal: 'Personal', Configuración: 'Configuración' }

export function AdminDashboard() {
  const [section, setSection] = useState<Section>('Resumen')
  const [openMenu, setOpenMenu] = useState(false)
  const [query, setQuery] = useState('')
  const flash = (text: string) => { sileo.success({ title: text }) }
  const go = (next: Section) => { setSection(next); setOpenMenu(false); setQuery(''); if (next !== 'Resumen') sileo.info({ title: titles[next] }) }
  return <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
    <aside className={`fixed inset-y-0 left-0 z-50 flex max-h-dvh w-72 flex-col overflow-y-auto border-r border-border/70 bg-card/95 backdrop-blur-xl transition-transform lg:translate-x-0 ${openMenu ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="sticky top-0 z-10 flex h-24 shrink-0 items-center justify-between border-b border-border/70 bg-card/95 px-7 backdrop-blur-xl"><a href="/" className="font-serif text-3xl tracking-[0.24em] text-foreground">La Bastarda<span className="text-primary">.</span></a><button aria-label="Cerrar menú" className="lg:hidden" onClick={() => setOpenMenu(false)}><X size={20}/></button></div>
      <div className="px-7 pt-8"><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">Control room</p><p className="mt-2 text-xs text-muted-foreground">Administración del club</p></div>
      <nav className="space-y-1.5 p-5 pt-8" aria-label="Navegación administrativa">{nav.map(({ label, icon: Icon, hint }) => <button key={label} onClick={() => go(label)} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all ${section === label ? 'bg-primary text-primary-foreground shadow-[0_0_24px_rgba(168,85,247,0.28)]' : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'}`}><span className={`flex size-9 items-center justify-center rounded-lg ${section === label ? 'bg-primary-foreground/15' : 'bg-muted/60 group-hover:bg-primary/10'}`}><Icon size={17}/></span><span className="flex-1"><span className="block text-sm font-medium">{label}</span><span className={`block text-[10px] ${section === label ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{hint}</span></span>{section === label && <ChevronRight size={15}/>}</button>)}</nav>
      <div className="mt-auto space-y-4 border-t border-border/70 p-5"><button onClick={() => go('Configuración')} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${section === 'Configuración' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted'}`}><Settings size={18}/>Configuración</button><div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3"><div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold">AD</div><div className="min-w-0"><p className="truncate text-xs font-medium">Admin La Bastarda</p><p className="text-[10px] text-muted-foreground">Super administrador</p></div></div></div>
    </aside>
    {openMenu && <button aria-label="Cerrar menú" className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden" onClick={() => setOpenMenu(false)}/>}<main className="min-w-0 lg:pl-72"><header className="sticky top-0 z-30 flex min-h-20 items-center justify-between gap-3 border-b border-border/70 bg-background/80 px-4 py-4 backdrop-blur-xl sm:min-h-24 sm:px-10"><div className="flex min-w-0 items-center gap-2 sm:gap-4"><button aria-label="Abrir menú" className="shrink-0 rounded-lg p-2 hover:bg-muted lg:hidden" onClick={() => setOpenMenu(true)}><Menu size={22}/></button><div className="min-w-0"><p className="truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-[10px] sm:tracking-[0.22em]">Miércoles, 16 de septiembre de 2026</p><h1 className="mt-1 truncate font-serif text-xl sm:text-2xl">Buen día, Admin.</h1></div></div><div className="flex shrink-0 items-center gap-2 sm:gap-3"><div className="relative hidden md:block"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar..." className="h-10 w-52 rounded-lg border border-border bg-card pl-9 pr-3 text-xs outline-none transition focus:border-primary"/></div><a href="/" className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-2.5 text-xs text-muted-foreground transition hover:border-primary hover:text-foreground sm:px-3"><ArrowUpRight size={14}/><span className="hidden sm:inline">Ver sitio</span></a></div></header><div className="mx-auto w-full max-w-[1500px] min-w-0 space-y-6 overflow-hidden p-3 sm:space-y-8 sm:p-10">{section === 'Resumen' ? <Summary onGo={go}/> : section === 'Estadísticas' ? <Statistics/> : section === 'Informes' ? <InformesManager/> : section === 'Configuración' ? <Config onFlash={flash}/> : section === 'Eventos' ? <EventosManager/> : section === 'Bar & productos' ? <ProductosManager/> : section === 'Usuarios' ? <UsuariosList/> : section === 'Tarjetas' ? <TarjetasManager/> : section === 'Personal' ? <PersonalManager/> : <EntradasManager/>}</div></main></div>
}

function StatCard({ label, value, caption }: { label: string; value: string; caption: string }) { return <div className="group relative min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-card p-4 sm:p-5 transition hover:-translate-y-1 hover:border-primary/40"><div className="absolute -right-5 -top-5 size-20 rounded-full bg-primary/10 blur-2xl"/><div className="relative"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p><p className="mt-2 text-[11px] text-primary">{caption}</p></div></div> }

const relativo = (iso?: string) => {
  if (!iso) return ''
  const minutos = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (minutos < 60) return `Hace ${minutos} min`
  const horas = Math.round(minutos / 60)
  if (horas < 24) return `Hace ${horas} h`
  return `Hace ${Math.round(horas / 24)} d`
}

function Statistics() {
  const [medioPago, setMedioPago] = useState<any[]>([])
  const [ranking, setRanking] = useState<any[]>([])
  const [aforo, setAforo] = useState<any[]>([])
  const [saldoTarjetas, setSaldoTarjetas] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<any[]>('/reportes/ventas-por-medio-pago').catch(() => []),
      api.get<any[]>('/reportes/ranking-productos?limite=5').catch(() => []),
      api.get<any[]>('/reportes/aforo-eventos').catch(() => []),
      api.get<any>('/reportes/saldo-tarjetas').catch(() => null),
    ]).then(([m, r, a, s]) => { setMedioPago(m); setRanking(r); setAforo(a); setSaldoTarjetas(s) }).finally(() => setLoading(false))
  }, [])

  const totalVentas = medioPago.reduce((sum, m) => sum + m.total, 0)
  const metodoFavorito = [...medioPago].sort((a, b) => b.total - a.total)[0]
  const productoEstrella = ranking[0]
  const maxMedio = Math.max(1, ...medioPago.map((m) => m.total))

  if (loading) return <div className="p-12 text-center text-sm text-muted-foreground">Cargando…</div>

  return <div className="space-y-8">
    <div><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">Centro de control / análisis</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Estadísticas<span className="text-primary">.</span></h2><p className="mt-3 text-sm text-muted-foreground">Reportes reales, sacados directo de la base de datos.</p></div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Ingresos totales" value={money(totalVentas)} caption="Ventas de bar completadas"/>
      <StatCard label="Saldo total en tarjetas" value={saldoTarjetas ? money(saldoTarjetas.saldoTotal) : '—'} caption={saldoTarjetas ? `${saldoTarjetas.tarjetasConSaldo} tarjetas con saldo` : 'Sin datos'}/>
      <StatCard label="Producto estrella" value={productoEstrella?.nombre ?? 'Sin ventas todavía'} caption={productoEstrella ? `${productoEstrella.cantidad_vendida} unidades vendidas` : ''}/>
      <StatCard label="Método favorito" value={metodoFavorito?.medio_pago ?? 'Sin datos'} caption={metodoFavorito ? money(metodoFavorito.total) : ''}/>
    </div>

    <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
      <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
        <h3 className="font-medium">Ventas por medio de pago</h3>
        <p className="mt-1 text-xs text-muted-foreground">Total facturado en ventas de bar completadas</p>
        {medioPago.length === 0 ? <p className="mt-8 text-center text-sm text-muted-foreground">Todavía no hay ventas registradas.</p> : (
          <div className="mt-6 space-y-4">
            {medioPago.map((m) => (
              <div key={m.medio_pago}>
                <div className="flex justify-between text-xs"><span className="capitalize text-muted-foreground">{m.medio_pago}</span><span className="font-medium">{money(m.total)} · {m.cantidad} ventas</span></div>
                <div className="mt-1.5 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(m.total / maxMedio) * 100}%` }}/></div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
        <h3 className="font-medium">Ranking de productos</h3>
        <p className="mt-1 text-xs text-muted-foreground">Más vendidos</p>
        {ranking.length === 0 ? <p className="mt-8 text-center text-sm text-muted-foreground">Sin ventas todavía.</p> : (
          <div className="mt-5 space-y-3">
            {ranking.map((p, i) => (
              <div key={p.producto_id ?? i} className="flex items-center justify-between text-sm"><span className="truncate">{i + 1}. {p.nombre}</span><span className="shrink-0 text-primary">{p.cantidad_vendida}u</span></div>
            ))}
          </div>
        )}
      </div>
    </div>

    <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
      <h3 className="font-medium">Aforo por evento</h3>
      <p className="mt-1 text-xs text-muted-foreground">Entradas vendidas sobre el cupo de cada tipo</p>
      {aforo.length === 0 ? <p className="mt-8 text-center text-sm text-muted-foreground">Todavía no hay tipos de entrada cargados.</p> : (
        <div className="mt-5 space-y-4">
          {aforo.map((t) => (
            <div key={t.tipo_entrada_id}>
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">{t.evento_nombre} · {t.tipo_nombre}</span><span className="font-medium">{t.vendidas}/{t.cupo} · {t.porcentaje_ocupado}%</span></div>
              <div className="mt-1.5 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, t.porcentaje_ocupado)}%` }}/></div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
}

type CierreCaja = {
  id: string; numero: number; caja_nombre: string; abierto_at: string; cerrado_at: string
  fondo_inicial: number; total_ventas: number; cantidad_ventas: number
  total_efectivo: number; total_mp: number; total_tarjeta: number; total_transferencia: number; total_saldo: number
  efectivo_declarado: number | null; diferencia: number | null
}

function ReportCard({ title, subtitle, onExport, disabled, children }: { title: string; subtitle?: string; onExport: () => void; disabled?: boolean; children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
    <div className="flex items-center justify-between gap-3 border-b border-border/70 p-5">
      <div><h3 className="font-medium">{title}</h3>{subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}</div>
      <button onClick={onExport} disabled={disabled} className="flex shrink-0 items-center gap-2 rounded-lg border border-primary/40 px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"><Download size={14}/>PDF</button>
    </div>
    {children}
  </div>
}

function InformesManager() {
  const [cierres, setCierres] = useState<CierreCaja[]>([])
  const [ranking, setRanking] = useState<any[]>([])
  const [medioPago, setMedioPago] = useState<any[]>([])
  const [aforo, setAforo] = useState<any[]>([])
  const [rutas, setRutas] = useState<any[]>([])
  const [saldoTarjetas, setSaldoTarjetas] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<CierreCaja[]>('/reportes/cierres-caja').catch(() => []),
      api.get<any[]>('/reportes/ranking-productos?limite=15').catch(() => []),
      api.get<any[]>('/reportes/ventas-por-medio-pago').catch(() => []),
      api.get<any[]>('/reportes/aforo-eventos').catch(() => []),
      api.get<any[]>('/reportes/ocupacion-rutas').catch(() => []),
      api.get<any>('/reportes/saldo-tarjetas').catch(() => null),
    ]).then(([c, r, m, a, ru, s]) => { setCierres(c); setRanking(r); setMedioPago(m); setAforo(a); setRutas(ru); setSaldoTarjetas(s) }).finally(() => setLoading(false))
  }, [])

  const exportarCierres = () => exportarReportePDF({
    titulo: 'Cierres de caja (Z)',
    columnas: ['Fecha', 'Caja', 'Turno', 'Ventas', 'Cant.', 'Efectivo', 'Saldo', 'Declarado', 'Diferencia'],
    filas: cierres.map((c) => [fechaHora(c.cerrado_at), c.caja_nombre, `#${c.numero}`, money(c.total_ventas), String(c.cantidad_ventas), money(c.total_efectivo), money(c.total_saldo), money(c.efectivo_declarado ?? 0), money(c.diferencia ?? 0)]),
    nombreArchivo: 'cierres-de-caja',
  })
  const exportarRanking = () => exportarReportePDF({
    titulo: 'Ranking de productos',
    columnas: ['Producto', 'Unidades vendidas', 'Total facturado'],
    filas: ranking.map((p) => [p.nombre, String(p.cantidad_vendida), money(p.total_facturado)]),
    nombreArchivo: 'ranking-productos',
  })
  const exportarMedioPago = () => exportarReportePDF({
    titulo: 'Ventas por medio de pago',
    columnas: ['Medio de pago', 'Cantidad', 'Total'],
    filas: medioPago.map((m) => [m.medio_pago, String(m.cantidad), money(m.total)]),
    nombreArchivo: 'ventas-por-medio-de-pago',
  })
  const exportarAforo = () => exportarReportePDF({
    titulo: 'Aforo por evento',
    columnas: ['Evento', 'Tipo', 'Vendidas', 'Cupo', '% ocupado'],
    filas: aforo.map((a) => [a.evento_nombre, a.tipo_nombre, String(a.vendidas), String(a.cupo), `${a.porcentaje_ocupado}%`]),
    nombreArchivo: 'aforo-eventos',
  })
  const exportarRutas = () => exportarReportePDF({
    titulo: 'Ocupación de rutas',
    columnas: ['Ruta', 'Reservados', 'Asientos', '% ocupado'],
    filas: rutas.map((r) => [`${r.origen} → ${r.destino}`, String(r.reservados), String(r.asientos), `${r.porcentaje_ocupado}%`]),
    nombreArchivo: 'ocupacion-rutas',
  })

  if (loading) return <div className="p-12 text-center text-sm text-muted-foreground">Cargando…</div>

  return <div className="space-y-8">
    <div><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">Centro de control / informes</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Informes<span className="text-primary">.</span></h2><p className="mt-3 text-sm text-muted-foreground">Cierres de caja y reportes reales, exportables en PDF.</p></div>

    <div className="grid gap-3 sm:grid-cols-2">
      <StatCard label="Saldo total en tarjetas" value={saldoTarjetas ? money(saldoTarjetas.saldoTotal) : '—'} caption={saldoTarjetas ? `${saldoTarjetas.tarjetasConSaldo} tarjetas con saldo` : 'Sin datos'}/>
      <StatCard label="Turnos cerrados" value={String(cierres.length)} caption="Historial completo"/>
    </div>

    <ReportCard title="Cierres de caja (cierre Z)" subtitle="Un renglón por cada turno cerrado, con el desglose de cómo entró la plata." onExport={exportarCierres} disabled={!cierres.length}>
      {cierres.length === 0 ? <div className="p-8 text-center text-sm text-muted-foreground">Todavía no se cerró ningún turno.</div> : (
        <div className="divide-y divide-border/60">{cierres.map((c) => <div key={c.id} className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-medium">{c.caja_nombre} · Turno #{c.numero}</h4><span className="text-xs text-muted-foreground">{fechaHora(c.cerrado_at)}</span></div>
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted-foreground sm:grid-cols-4">
            <span>Fondo inicial: <strong className="text-foreground">{money(c.fondo_inicial)}</strong></span>
            <span>Ventas: <strong className="text-foreground">{money(c.total_ventas)} ({c.cantidad_ventas})</strong></span>
            <span>Efectivo: <strong className="text-foreground">{money(c.total_efectivo)}</strong></span>
            <span>Saldo (tarjeta): <strong className="text-foreground">{money(c.total_saldo)}</strong></span>
            <span>Declarado: <strong className="text-foreground">{money(c.efectivo_declarado ?? 0)}</strong></span>
            <span className={c.diferencia && c.diferencia !== 0 ? 'text-destructive' : ''}>Diferencia: <strong>{money(c.diferencia ?? 0)}</strong></span>
          </div>
        </div>)}</div>
      )}
    </ReportCard>

    <div className="grid gap-4 lg:grid-cols-2">
      <ReportCard title="Ranking de productos" onExport={exportarRanking} disabled={!ranking.length}>
        {ranking.length === 0 ? <div className="p-8 text-center text-sm text-muted-foreground">Sin ventas todavía.</div> : <div className="divide-y divide-border/60">{ranking.map((p, i) => <div key={p.producto_id ?? i} className="flex items-center justify-between p-4 text-sm"><span className="truncate">{i + 1}. {p.nombre}</span><span className="shrink-0 text-primary">{p.cantidad_vendida}u · {money(p.total_facturado)}</span></div>)}</div>}
      </ReportCard>

      <ReportCard title="Ventas por medio de pago" onExport={exportarMedioPago} disabled={!medioPago.length}>
        {medioPago.length === 0 ? <div className="p-8 text-center text-sm text-muted-foreground">Sin ventas todavía.</div> : <div className="divide-y divide-border/60">{medioPago.map((m) => <div key={m.medio_pago} className="flex items-center justify-between p-4 text-sm"><span className="capitalize">{m.medio_pago}</span><span className="text-primary">{m.cantidad} ventas · {money(m.total)}</span></div>)}</div>}
      </ReportCard>
    </div>

    <ReportCard title="Aforo por evento" subtitle="Entradas vendidas sobre el cupo de cada tipo." onExport={exportarAforo} disabled={!aforo.length}>
      {aforo.length === 0 ? <div className="p-8 text-center text-sm text-muted-foreground">Todavía no hay tipos de entrada cargados.</div> : <div className="divide-y divide-border/60">{aforo.map((a) => <div key={a.tipo_entrada_id} className="flex items-center justify-between p-4 text-sm"><span>{a.evento_nombre} · {a.tipo_nombre}</span><span className="text-primary">{a.vendidas}/{a.cupo} · {a.porcentaje_ocupado}%</span></div>)}</div>}
    </ReportCard>

    {rutas.length > 0 && (
      <ReportCard title="Ocupación de rutas" onExport={exportarRutas}>
        <div className="divide-y divide-border/60">{rutas.map((r) => <div key={r.id} className="flex items-center justify-between p-4 text-sm"><span>{r.origen} → {r.destino}</span><span className="text-primary">{r.reservados}/{r.asientos} · {r.porcentaje_ocupado}%</span></div>)}</div>
      </ReportCard>
    )}
  </div>
}

function Summary({ onGo }: { onGo: (s: Section) => void }) {
  const [ventasMes, setVentasMes] = useState<any[]>([])
  const [aforo, setAforo] = useState<any[]>([])
  const [socios, setSocios] = useState<any[]>([])
  const [eventos, setEventos] = useState<any[]>([])
  const [ventasRecientes, setVentasRecientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const desde = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)
    Promise.all([
      api.get<any[]>(`/reportes/ventas-por-medio-pago?desde=${desde}`).catch(() => []),
      api.get<any[]>('/reportes/aforo-eventos').catch(() => []),
      api.get<any[]>('/socios?limit=100').catch(() => []),
      api.get<any[]>('/eventos?limit=100').catch(() => []),
      api.get<any[]>('/ventas?limit=5').catch(() => []),
    ]).then(([v, a, s, e, r]) => { setVentasMes(v); setAforo(a); setSocios(s); setEventos(e); setVentasRecientes(r) }).finally(() => setLoading(false))
  }, [])

  const ingresosMes = ventasMes.reduce((sum, v) => sum + v.total, 0)
  const entradasVendidas = aforo.reduce((sum, t) => sum + t.vendidas, 0)
  const ocupacionPromedio = aforo.length ? aforo.reduce((sum, t) => sum + t.porcentaje_ocupado, 0) / aforo.length : 0
  const hoy = new Date(new Date().toDateString())
  const proximoEvento = [...eventos].filter((e) => new Date(e.fecha) >= hoy).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())[0]

  if (loading) return <div className="p-12 text-center text-sm text-muted-foreground">Cargando…</div>

  return <>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">Centro de control / overview</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Resumen general<span className="text-primary">.</span></h2><p className="mt-3 text-sm text-muted-foreground">Todo lo que está pasando en La Bastarda, en una sola vista.</p></div>
      <button onClick={() => onGo('Eventos')} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium sm:w-fit text-primary-foreground shadow-[0_0_22px_rgba(168,85,247,0.3)] transition hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(168,85,247,0.5)]"><Plus size={17}/>Nuevo evento</button>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Ingresos del mes" value={money(ingresosMes)} caption="Ventas de bar completadas"/>
      <StatCard label="Entradas vendidas" value={String(entradasVendidas)} caption="En eventos activos"/>
      <StatCard label="Ocupación promedio" value={`${ocupacionPromedio.toFixed(1)}%`} caption="Entre tipos de entrada"/>
      <StatCard label="Socios registrados" value={String(socios.length)} caption="Cuentas creadas"/>
    </div>

    <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 sm:p-8">
        <div className="absolute -right-20 -top-24 size-72 rounded-full bg-primary/10 blur-3xl"/>
        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">Próximo evento</p>
          {proximoEvento ? <>
            <h3 className="mt-3 font-serif text-4xl">{proximoEvento.nombre}</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{fechaCorta(proximoEvento.fecha)}{proximoEvento.hora ? ` · ${proximoEvento.hora.slice(0, 5)}` : ''}{proximoEvento.dj ? ` · ${proximoEvento.dj}` : ''}</p>
          </> : <h3 className="mt-3 font-serif text-2xl">No hay eventos próximos cargados.</h3>}
          <div className="mt-7 flex flex-wrap gap-3">{(['Eventos', 'Entradas', 'Bar & productos', 'Usuarios'] as Section[]).map((item) => <button key={item} onClick={() => onGo(item)} className="flex items-center gap-2 rounded-lg border border-border bg-background/40 px-3.5 py-2.5 text-xs transition hover:border-primary hover:text-primary">{item}<ChevronRight size={13}/></button>)}</div>
        </div>
      </div>
      <div className="rounded-2xl border border-border/70 bg-card p-6">
        <div className="flex items-center justify-between"><p className="text-sm font-medium">Ventas recientes</p><span className="text-[10px] uppercase tracking-widest text-primary">Real</span></div>
        {ventasRecientes.length === 0 ? <p className="py-8 text-center text-xs text-muted-foreground">Todavía no hay ventas registradas.</p> : ventasRecientes.map((venta, i) => <div key={venta.id} className="flex items-center gap-3 border-b border-border/60 py-4 last:border-0"><span className={`size-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-muted-foreground/40'}`}/><div className="flex-1"><p className="text-xs capitalize">Venta · {venta.medio_pago} · {money(venta.total)}</p><p className="mt-1 text-[10px] text-muted-foreground">{relativo(venta.created_at)}</p></div></div>)}
      </div>
    </div>
  </>
}

function Config({ onFlash }: { onFlash: (s: string) => void }) { return <><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">Sistema / preferencias</p><h2 className="mt-3 text-4xl font-semibold">Configuración<span className="text-primary">.</span></h2><div className="mt-8 max-w-2xl overflow-hidden rounded-2xl border border-border/70 bg-card p-6 sm:p-8"><h3 className="text-lg font-medium">Preferencias del club</h3>{['Notificaciones de ventas','Alertas de capacidad','Modo mantenimiento'].map((item) => <label key={item} className="flex items-center justify-between border-b border-border/60 py-5 text-sm"><span>{item}<span className="mt-1 block text-xs text-muted-foreground">Controlá los avisos de esta categoría.</span></span><input type="checkbox" defaultChecked={item !== 'Modo mantenimiento'} onChange={() => onFlash(`${item} actualizado`)} className="size-4 accent-primary"/></label>)}<button onClick={() => onFlash('Configuración guardada')} className="mt-7 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:shadow-[0_0_22px_rgba(168,85,247,0.35)]">Guardar cambios</button></div></> }

type Evento = { id: string; nombre: string; dj: string | null; fecha: string; hora: string | null; categoria: string | null; destacado: boolean; imagen_url: string | null }

function EventosManager() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  const cargar = () => { api.get<Evento[]>('/eventos?limit=100').then(setEventos).catch(() => setEventos([])).finally(() => setLoading(false)) }
  useEffect(cargar, [])

  const elegirImagen = (event: ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0]
    setPreview(archivo ? URL.createObjectURL(archivo) : null)
  }

  const cerrarModal = () => { setModalOpen(false); setPreview(null) }

  const crear = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setGuardando(true)
    try {
      let imagenUrl: string | undefined
      const archivo = form.get('imagen')
      if (archivo instanceof File && archivo.size > 0) {
        const subida = new FormData()
        subida.append('imagen', archivo)
        const resultado = await api.upload<{ imagenUrl: string }>('/eventos/upload-imagen', subida)
        imagenUrl = resultado.imagenUrl
      }
      await api.post('/eventos', {
        nombre: String(form.get('nombre')),
        dj: String(form.get('dj') || '') || undefined,
        fecha: String(form.get('fecha')),
        hora: String(form.get('hora') || '') || undefined,
        categoria: String(form.get('categoria') || '') || undefined,
        destacado: form.get('destacado') === 'on',
        imagenUrl,
      })
      sileo.success({ title: 'Evento creado' })
      cerrarModal()
      cargar()
    } catch (error) {
      sileo.error({ title: error instanceof ApiError ? error.message : 'No se pudo crear el evento' })
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (id: string) => {
    try {
      await api.delete(`/eventos/${id}`)
      sileo.warning({ title: 'Evento eliminado' })
      cargar()
    } catch (error) {
      sileo.error({ title: error instanceof ApiError ? error.message : 'No se pudo eliminar' })
    }
  }

  return <>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">Gestión La Bastarda / Eventos</p><h2 className="mt-3 text-4xl font-semibold tracking-tight">Eventos<span className="text-primary">.</span></h2><p className="mt-3 text-sm text-muted-foreground">Agenda real, conectada al backend.</p></div>
      <button onClick={() => setModalOpen(true)} className="flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-[0_0_22px_rgba(168,85,247,0.25)] transition hover:scale-[1.02]"><Plus size={17}/>Nuevo evento</button>
    </div>
    <div className="mt-6 overflow-hidden rounded-2xl border border-border/70 bg-card">
      <div className="flex items-center justify-between border-b border-border/70 p-5"><h3 className="font-medium">Listado de eventos</h3><span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-medium text-primary">{eventos.length} ACTIVOS</span></div>
      {loading ? <div className="p-12 text-center text-sm text-muted-foreground">Cargando…</div> : eventos.length ? <div className="divide-y divide-border/60">{eventos.map((evento) => <div key={evento.id} className="group flex items-center justify-between gap-4 p-5 transition hover:bg-muted/30"><div className="flex min-w-0 items-center gap-4">{evento.imagen_url ? <img src={evento.imagen_url} alt="" className="size-10 shrink-0 rounded-xl object-cover"/> : <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Calendar size={18}/></span>}<div className="min-w-0"><h4 className="truncate text-sm font-medium">{evento.nombre}{evento.destacado && <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary">DESTACADO</span>}</h4><p className="mt-1 truncate text-xs text-muted-foreground">{fechaCorta(evento.fecha)}{evento.hora ? ` · ${evento.hora.slice(0, 5)}` : ''}{evento.dj ? ` · ${evento.dj}` : ''}{evento.categoria ? ` · ${evento.categoria}` : ''}</p></div></div><button aria-label={`Eliminar ${evento.nombre}`} onClick={() => eliminar(evento.id)} className="rounded-lg p-2 text-muted-foreground opacity-60 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"><Trash2 size={16}/></button></div>)}</div> : <div className="p-12 text-center text-sm text-muted-foreground">No hay eventos cargados todavía.</div>}
    </div>
    {modalOpen && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/75 p-5 backdrop-blur-md" role="dialog" aria-modal="true">
      <form onSubmit={crear} className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-primary/30 bg-card shadow-[0_0_60px_rgba(168,85,247,0.2)]">
        <div className="border-b border-border/70 bg-primary/5 p-6"><div className="flex justify-between"><h2 className="font-serif text-3xl">Crear evento</h2><button type="button" aria-label="Cerrar" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={cerrarModal}><X size={20}/></button></div></div>
        <div className="space-y-4 p-6">
          <label className="block text-xs font-medium">Imagen del evento
            {preview ? (
              <div className="relative mt-2 overflow-hidden rounded-lg border border-border"><img src={preview} alt="Vista previa" className="h-40 w-full object-cover"/><button type="button" onClick={() => { setPreview(null); const input = document.getElementById('imagen-evento-input') as HTMLInputElement; if (input) input.value = '' }} className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-foreground hover:bg-background"><X size={14}/></button></div>
            ) : (
              <div className="mt-2 flex h-32 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">PNG o JPEG, hasta 5MB</div>
            )}
            <input id="imagen-evento-input" name="imagen" type="file" accept="image/png,image/jpeg" onChange={elegirImagen} className="mt-2 w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-xs file:font-medium file:text-primary hover:file:bg-primary/20"/>
          </label>
          <label className="block text-xs font-medium">Nombre<input name="nombre" required className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"/></label>
          <label className="block text-xs font-medium">DJ<input name="dj" className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"/></label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-xs font-medium">Fecha<input name="fecha" type="date" required className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"/></label>
            <label className="block text-xs font-medium">Hora<input name="hora" type="time" className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"/></label>
          </div>
          <label className="block text-xs font-medium">Categoría<input name="categoria" placeholder="Techno, House..." className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"/></label>
          <label className="flex items-center gap-2 text-sm"><input name="destacado" type="checkbox" className="size-4 accent-primary"/>Destacado</label>
        </div>
        <div className="flex justify-end gap-3 border-t border-border/70 bg-muted/20 p-6"><button type="button" onClick={cerrarModal} className="rounded-lg border border-border px-4 py-2.5 text-sm hover:bg-muted">Cancelar</button><button type="submit" disabled={guardando} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60">{guardando ? 'Creando…' : 'Crear evento'}</button></div>
      </form>
    </div>}
  </>
}

type ProductoAdmin = { id: string; nombre: string; categoria: string; precio: number; stock: number }

function ProductosManager() {
  const [productos, setProductos] = useState<ProductoAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const cargar = () => { api.get<ProductoAdmin[]>('/productos?limit=100').then(setProductos).catch(() => setProductos([])).finally(() => setLoading(false)) }
  useEffect(cargar, [])

  const crear = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      await api.post('/productos', {
        nombre: String(form.get('nombre')),
        categoria: String(form.get('categoria')),
        precio: Number(form.get('precio')),
        stock: Number(form.get('stock') || 0),
      })
      sileo.success({ title: 'Producto creado' })
      setModalOpen(false)
      cargar()
    } catch (error) {
      sileo.error({ title: error instanceof ApiError ? error.message : 'No se pudo crear el producto' })
    }
  }

  const eliminar = async (id: string) => {
    try {
      await api.delete(`/productos/${id}`)
      sileo.warning({ title: 'Producto dado de baja' })
      cargar()
    } catch (error) {
      sileo.error({ title: error instanceof ApiError ? error.message : 'No se pudo eliminar' })
    }
  }

  return <>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">Gestión La Bastarda / Bar & productos</p><h2 className="mt-3 text-4xl font-semibold tracking-tight">Bar & productos<span className="text-primary">.</span></h2><p className="mt-3 text-sm text-muted-foreground">Carta y stock real del bar.</p></div>
      <button onClick={() => setModalOpen(true)} className="flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-[0_0_22px_rgba(168,85,247,0.25)] transition hover:scale-[1.02]"><Plus size={17}/>Nuevo producto</button>
    </div>
    <div className="mt-6 overflow-hidden rounded-2xl border border-border/70 bg-card">
      <div className="flex items-center justify-between border-b border-border/70 p-5"><h3 className="font-medium">Listado de productos</h3><span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-medium text-primary">{productos.length} ACTIVOS</span></div>
      {loading ? <div className="p-12 text-center text-sm text-muted-foreground">Cargando…</div> : productos.length ? <div className="divide-y divide-border/60">{productos.map((producto) => <div key={producto.id} className="group flex items-center justify-between gap-4 p-5 transition hover:bg-muted/30"><div className="flex min-w-0 items-center gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Package size={18}/></span><div className="min-w-0"><h4 className="truncate text-sm font-medium">{producto.nombre}</h4><p className="mt-1 truncate text-xs text-muted-foreground">{producto.categoria} · Stock: {producto.stock}</p></div></div><div className="flex items-center gap-4"><span className="text-sm font-medium text-primary">{money(producto.precio)}</span><button aria-label={`Eliminar ${producto.nombre}`} onClick={() => eliminar(producto.id)} className="rounded-lg p-2 text-muted-foreground opacity-60 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"><Trash2 size={16}/></button></div></div>)}</div> : <div className="p-12 text-center text-sm text-muted-foreground">No hay productos cargados todavía.</div>}
    </div>
    {modalOpen && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/75 p-5 backdrop-blur-md" role="dialog" aria-modal="true">
      <form onSubmit={crear} className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-primary/30 bg-card shadow-[0_0_60px_rgba(168,85,247,0.2)]">
        <div className="border-b border-border/70 bg-primary/5 p-6"><div className="flex justify-between"><h2 className="font-serif text-3xl">Crear producto</h2><button type="button" aria-label="Cerrar" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => setModalOpen(false)}><X size={20}/></button></div></div>
        <div className="space-y-4 p-6">
          <label className="block text-xs font-medium">Nombre<input name="nombre" required className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"/></label>
          <label className="block text-xs font-medium">Categoría<input name="categoria" required placeholder="Tragos, Cervezas..." className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"/></label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-xs font-medium">Precio<input name="precio" type="number" min="0" required className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"/></label>
            <label className="block text-xs font-medium">Stock<input name="stock" type="number" min="0" className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"/></label>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-border/70 bg-muted/20 p-6"><button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-border px-4 py-2.5 text-sm hover:bg-muted">Cancelar</button><button type="submit" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Crear producto</button></div>
      </form>
    </div>}
  </>
}

type SocioAdmin = { id: string; nombre: string; apellido: string; email: string; dni: string | null; bloqueado: boolean; motivo_bloqueo: string | null; member_number: string; nivel: string; puntos: number }

function UsuariosList() {
  const [socios, setSocios] = useState<SocioAdmin[]>([])
  const [loading, setLoading] = useState(true)

  const cargar = () => { api.get<SocioAdmin[]>('/socios?limit=100').then(setSocios).catch(() => setSocios([])).finally(() => setLoading(false)) }
  useEffect(cargar, [])

  const bloquear = async (socio: SocioAdmin) => {
    const motivo = window.prompt(`¿Por qué bloqueás a ${socio.nombre} ${socio.apellido}?`)
    if (!motivo) return
    try {
      await api.patch(`/socios/${socio.id}/bloquear`, { motivo })
      sileo.warning({ title: `${socio.nombre} ${socio.apellido} bloqueado` })
      cargar()
    } catch (error) {
      sileo.error({ title: error instanceof ApiError ? error.message : 'No se pudo bloquear' })
    }
  }

  const desbloquear = async (socio: SocioAdmin) => {
    try {
      await api.patch(`/socios/${socio.id}/desbloquear`, {})
      sileo.success({ title: `${socio.nombre} ${socio.apellido} desbloqueado` })
      cargar()
    } catch (error) {
      sileo.error({ title: error instanceof ApiError ? error.message : 'No se pudo desbloquear' })
    }
  }

  return <>
    <div><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">Gestión La Bastarda / Usuarios</p><h2 className="mt-3 text-4xl font-semibold tracking-tight">Usuarios<span className="text-primary">.</span></h2><p className="mt-3 text-sm text-muted-foreground">Socios registrados desde el sitio — el alta la hace cada persona al registrarse.</p></div>
    <div className="mt-6 overflow-hidden rounded-2xl border border-border/70 bg-card">
      <div className="flex items-center justify-between border-b border-border/70 p-5"><h3 className="font-medium">Listado de socios</h3><span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-medium text-primary">{socios.length} REGISTRADOS</span></div>
      {loading ? <div className="p-12 text-center text-sm text-muted-foreground">Cargando…</div> : socios.length ? <div className="divide-y divide-border/60">{socios.map((socio) => <div key={socio.id} className="flex items-center justify-between gap-4 p-5"><div className="flex min-w-0 items-center gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Users size={18}/></span><div className="min-w-0"><h4 className="truncate text-sm font-medium">{socio.nombre} {socio.apellido}{socio.bloqueado && <span className="ml-2 rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-medium text-destructive">BLOQUEADO</span>}</h4><p className="mt-1 truncate text-xs text-muted-foreground">{socio.email} · {socio.dni ? `DNI ${socio.dni}` : 'sin DNI'} · {socio.member_number} · {socio.nivel}{socio.bloqueado && socio.motivo_bloqueo ? ` · ${socio.motivo_bloqueo}` : ''}</p></div></div><div className="flex items-center gap-3"><span className="text-sm font-medium text-primary">{socio.puntos} pts</span>{socio.bloqueado ? <button onClick={() => desbloquear(socio)} className="rounded-lg border border-primary/40 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10">Desbloquear</button> : <button onClick={() => bloquear(socio)} className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10">Bloquear</button>}</div></div>)}</div> : <div className="p-12 text-center text-sm text-muted-foreground">Todavía no hay socios registrados.</div>}
    </div>
  </>
}

type TarjetaAdmin = { id: string; card_uid: string; saldo: number; nivel: string; estado: string; socio_nombre: string | null; socio_apellido: string | null; socio_email: string | null }

function TarjetasManager() {
  const [tarjetas, setTarjetas] = useState<TarjetaAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [generando, setGenerando] = useState(false)

  const cargar = () => { api.get<TarjetaAdmin[]>('/tarjetas?limit=100').then(setTarjetas).catch(() => setTarjetas([])).finally(() => setLoading(false)) }
  useEffect(cargar, [])

  const sinAsignar = tarjetas.filter((t) => !t.socio_email).length

  const generarLote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const cantidad = Number(form.get('cantidad') || 0)
    if (cantidad < 1) return
    setGenerando(true)
    try {
      const creadas = await api.post<TarjetaAdmin[]>('/tarjetas/lote', { cantidad })
      sileo.success({ title: `${creadas.length} tarjetas generadas` })
      setModalOpen(false)
      cargar()
    } catch (error) {
      sileo.error({ title: error instanceof ApiError ? error.message : 'No se pudo generar el lote' })
    } finally {
      setGenerando(false)
    }
  }

  return <>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">Gestión La Bastarda / Tarjetas</p><h2 className="mt-3 text-4xl font-semibold tracking-tight">Tarjetas<span className="text-primary">.</span></h2><p className="mt-3 text-sm text-muted-foreground">Generá tarjetas en lote para imprimir y que los socios las vinculen desde su perfil.</p></div>
      <button onClick={() => setModalOpen(true)} className="flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-[0_0_22px_rgba(168,85,247,0.25)] transition hover:scale-[1.02]"><Plus size={17}/>Generar lote</button>
    </div>
    <div className="grid gap-3 sm:grid-cols-3">
      <StatCard label="Tarjetas totales" value={String(tarjetas.length)} caption="En el sistema"/>
      <StatCard label="Sin asignar" value={String(sinAsignar)} caption="Listas para vincular"/>
      <StatCard label="Vinculadas" value={String(tarjetas.length - sinAsignar)} caption="Con un socio activo"/>
    </div>
    <div className="mt-6 overflow-hidden rounded-2xl border border-border/70 bg-card">
      <div className="flex items-center justify-between border-b border-border/70 p-5"><h3 className="font-medium">Listado de tarjetas</h3><span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-medium text-primary">{tarjetas.length} EN SISTEMA</span></div>
      {loading ? <div className="p-12 text-center text-sm text-muted-foreground">Cargando…</div> : tarjetas.length ? <div className="divide-y divide-border/60">{tarjetas.map((tarjeta) => <div key={tarjeta.id} className="flex items-center justify-between gap-4 p-5"><div className="flex min-w-0 items-center gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><CreditCard size={18}/></span><div className="min-w-0"><h4 className="truncate font-mono text-sm font-medium">{tarjeta.card_uid}</h4><p className="mt-1 truncate text-xs text-muted-foreground">{tarjeta.socio_email ? `${tarjeta.socio_nombre} ${tarjeta.socio_apellido} · ${tarjeta.socio_email}` : 'Sin asignar'}</p></div></div><span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-medium ${tarjeta.socio_email ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{tarjeta.socio_email ? money(tarjeta.saldo) : 'Disponible'}</span></div>)}</div> : <div className="p-12 text-center text-sm text-muted-foreground">No hay tarjetas generadas todavía.</div>}
    </div>
    {modalOpen && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/75 p-5 backdrop-blur-md" role="dialog" aria-modal="true">
      <form onSubmit={generarLote} className="w-full max-w-md overflow-y-auto rounded-2xl border border-primary/30 bg-card shadow-[0_0_60px_rgba(168,85,247,0.2)]">
        <div className="border-b border-border/70 bg-primary/5 p-6"><div className="flex justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">Nuevo lote</p><h2 className="mt-2 font-serif text-3xl">Generar tarjetas</h2></div><button type="button" aria-label="Cerrar" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => setModalOpen(false)}><X size={20}/></button></div></div>
        <div className="space-y-4 p-6">
          <label className="block text-xs font-medium">Cantidad de tarjetas<input name="cantidad" type="number" min="1" max="200" defaultValue={20} required className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"/></label>
          <p className="text-xs text-muted-foreground">Cada tarjeta se crea sin asignar, con un código único listo para imprimir (ej. LB-7KQ9PX). El socio la vincula a su cuenta desde "Mi Perfil → Tarjeta La Bastarda".</p>
        </div>
        <div className="flex justify-end gap-3 border-t border-border/70 bg-muted/20 p-6"><button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-border px-4 py-2.5 text-sm hover:bg-muted">Cancelar</button><button type="submit" disabled={generando} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:shadow-[0_0_18px_rgba(168,85,247,0.35)] disabled:opacity-60">{generando ? 'Generando…' : 'Generar lote'}</button></div>
      </form>
    </div>}
  </>
}

type StaffAdmin = { id: string; nombre: string; apellido: string; email: string; rol: 'admin' | 'caja' | 'seguridad'; activo: boolean; created_at: string }

const ROL_LABEL: Record<StaffAdmin['rol'], string> = { admin: 'Administrador', caja: 'Caja', seguridad: 'Seguridad' }

function PersonalManager() {
  const [staff, setStaff] = useState<StaffAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const cargar = () => { api.get<StaffAdmin[]>('/staff').then(setStaff).catch(() => setStaff([])).finally(() => setLoading(false)) }
  useEffect(cargar, [])

  const crear = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setGuardando(true)
    try {
      await api.post('/staff', {
        nombre: String(form.get('nombre')),
        apellido: String(form.get('apellido')),
        email: String(form.get('email')),
        password: String(form.get('password')),
        rol: String(form.get('rol')),
      })
      sileo.success({ title: 'Cuenta de staff creada' })
      setModalOpen(false)
      cargar()
    } catch (error) {
      sileo.error({ title: error instanceof ApiError ? error.message : 'No se pudo crear la cuenta' })
    } finally {
      setGuardando(false)
    }
  }

  const toggleActivo = async (persona: StaffAdmin) => {
    try {
      await api.patch(`/staff/${persona.id}/activo`, { activo: !persona.activo })
      sileo.success({ title: persona.activo ? 'Cuenta desactivada' : 'Cuenta reactivada' })
      cargar()
    } catch (error) {
      sileo.error({ title: error instanceof ApiError ? error.message : 'No se pudo actualizar' })
    }
  }

  return <>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">Gestión La Bastarda / Personal</p><h2 className="mt-3 text-4xl font-semibold tracking-tight">Personal<span className="text-primary">.</span></h2><p className="mt-3 text-sm text-muted-foreground">Cuentas de admin, caja y seguridad. Cada una entra por su propio login y va directo a su panel.</p></div>
      <button onClick={() => setModalOpen(true)} className="flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-[0_0_22px_rgba(168,85,247,0.25)] transition hover:scale-[1.02]"><Plus size={17}/>Nueva cuenta</button>
    </div>
    <div className="mt-6 overflow-hidden rounded-2xl border border-border/70 bg-card">
      <div className="flex items-center justify-between border-b border-border/70 p-5"><h3 className="font-medium">Listado de personal</h3><span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-medium text-primary">{staff.length} CUENTAS</span></div>
      {loading ? <div className="p-12 text-center text-sm text-muted-foreground">Cargando…</div> : staff.length ? <div className="divide-y divide-border/60">{staff.map((persona) => <div key={persona.id} className="flex items-center justify-between gap-4 p-5"><div className="flex min-w-0 items-center gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">{persona.rol === 'seguridad' ? <ShieldCheck size={18}/> : <UserCog size={18}/>}</span><div className="min-w-0"><h4 className="truncate text-sm font-medium">{persona.nombre} {persona.apellido}{!persona.activo && <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">INACTIVA</span>}</h4><p className="mt-1 truncate text-xs text-muted-foreground">{persona.email} · {ROL_LABEL[persona.rol]}</p></div></div><button onClick={() => toggleActivo(persona)} className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium ${persona.activo ? 'border-destructive/30 text-destructive hover:bg-destructive/10' : 'border-primary/40 text-primary hover:bg-primary/10'}`}>{persona.activo ? 'Desactivar' : 'Reactivar'}</button></div>)}</div> : <div className="p-12 text-center text-sm text-muted-foreground">Todavía no hay cuentas de staff cargadas.</div>}
    </div>
    {modalOpen && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/75 p-5 backdrop-blur-md" role="dialog" aria-modal="true">
      <form onSubmit={crear} className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-primary/30 bg-card shadow-[0_0_60px_rgba(168,85,247,0.2)]">
        <div className="border-b border-border/70 bg-primary/5 p-6"><div className="flex justify-between"><h2 className="font-serif text-3xl">Nueva cuenta de staff</h2><button type="button" aria-label="Cerrar" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => setModalOpen(false)}><X size={20}/></button></div></div>
        <div className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-xs font-medium">Nombre<input name="nombre" required className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"/></label>
            <label className="block text-xs font-medium">Apellido<input name="apellido" required className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"/></label>
          </div>
          <label className="block text-xs font-medium">Email<input name="email" type="email" required className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"/></label>
          <label className="block text-xs font-medium">Contraseña<input name="password" type="password" minLength={8} required placeholder="Mínimo 8 caracteres" className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"/></label>
          <label className="block text-xs font-medium">Rol<select name="rol" required className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"><option value="">Elegí un rol</option><option value="seguridad">Seguridad (control de acceso)</option><option value="caja">Caja (ventas y cobros)</option><option value="admin">Administrador (todo)</option></select></label>
        </div>
        <div className="flex justify-end gap-3 border-t border-border/70 bg-muted/20 p-6"><button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-border px-4 py-2.5 text-sm hover:bg-muted">Cancelar</button><button type="submit" disabled={guardando} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60">{guardando ? 'Creando…' : 'Crear cuenta'}</button></div>
      </form>
    </div>}
  </>
}

function EntradasManager() {
  const [eventos, setEventos] = useState<any[]>([])
  const [eventoId, setEventoId] = useState('')
  const [tiposEntrada, setTiposEntrada] = useState<any[]>([])
  const [vendidas, setVendidas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    api.get<any[]>('/eventos?limit=100').then((data) => {
      setEventos(data)
      if (data.length > 0) setEventoId(data[0].id)
    }).catch(() => setEventos([])).finally(() => setLoading(false))
  }, [])

  const cargarDetalle = () => {
    if (!eventoId) { setTiposEntrada([]); setVendidas([]); return }
    api.get<any>(`/eventos/${eventoId}`).then((data) => setTiposEntrada(data.tiposEntrada ?? [])).catch(() => setTiposEntrada([]))
    api.get<any[]>(`/entradas/evento/${eventoId}?limit=100`).then(setVendidas).catch(() => setVendidas([]))
  }
  useEffect(cargarDetalle, [eventoId])

  const crearTipo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const beneficios = String(form.get('beneficios') || '').split(',').map((b) => b.trim()).filter(Boolean)
    try {
      await api.post(`/eventos/${eventoId}/tipos-entrada`, {
        nombre: String(form.get('nombre')),
        precio: Number(form.get('precio')),
        cupo: Number(form.get('cupo')),
        beneficios: beneficios.length ? beneficios : undefined,
      })
      sileo.success({ title: 'Tipo de entrada creado' })
      setModalOpen(false)
      cargarDetalle()
    } catch (error) {
      sileo.error({ title: error instanceof ApiError ? error.message : 'No se pudo crear el tipo de entrada' })
    }
  }

  const totalRecaudado = vendidas.reduce((sum, v) => sum + v.precio, 0)

  return <>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">Gestión La Bastarda / Entradas</p><h2 className="mt-3 text-4xl font-semibold tracking-tight">Entradas y ventas<span className="text-primary">.</span></h2><p className="mt-3 text-sm text-muted-foreground">Creá los tipos de entrada de cada evento y mirá quién ya compró.</p></div>
      {eventoId && <button onClick={() => setModalOpen(true)} className="flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-[0_0_22px_rgba(168,85,247,0.25)] transition hover:scale-[1.02]"><Plus size={17}/>Nuevo tipo de entrada</button>}
    </div>

    {loading ? <div className="p-12 text-center text-sm text-muted-foreground">Cargando…</div> : eventos.length === 0 ? (
      <div className="rounded-2xl border border-border/70 bg-card p-12 text-center text-sm text-muted-foreground">Todavía no hay eventos cargados — creá uno primero en "Eventos".</div>
    ) : <>
      <label className="flex max-w-md flex-col gap-2 text-xs font-medium"><span className="text-muted-foreground">Evento</span><select value={eventoId} onChange={(e) => setEventoId(e.target.value)} className="h-11 rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary">{eventos.map((evento) => <option key={evento.id} value={evento.id}>{evento.nombre} · {fechaCorta(evento.fecha)}</option>)}</select></label>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Tipos de entrada" value={String(tiposEntrada.length)} caption="Para este evento"/>
        <StatCard label="Entradas vendidas" value={String(vendidas.length)} caption="Operaciones confirmadas"/>
        <StatCard label="Recaudado" value={money(totalRecaudado)} caption="Total de este evento"/>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
        <div className="border-b border-border/70 p-5"><h3 className="font-medium">Tipos de entrada</h3></div>
        {tiposEntrada.length === 0 ? <div className="p-8 text-center text-sm text-muted-foreground">Este evento todavía no tiene tipos de entrada. Creá el primero.</div> : (
          <div className="divide-y divide-border/60">{tiposEntrada.map((tipo) => <div key={tipo.id} className="flex items-center justify-between gap-4 p-5"><div className="flex min-w-0 items-center gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Ticket size={18}/></span><div className="min-w-0"><h4 className="truncate text-sm font-medium">{tipo.nombre}</h4><p className="mt-1 truncate text-xs text-muted-foreground">{tipo.vendidas}/{tipo.cupo} vendidas{tipo.beneficios?.length ? ` · ${tipo.beneficios.join(', ')}` : ''}</p></div></div><span className="shrink-0 text-sm font-medium text-primary">{money(tipo.precio)}</span></div>)}</div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
        <div className="flex items-center justify-between border-b border-border/70 p-5"><h3 className="font-medium">Quién compró</h3><span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-medium text-primary">{vendidas.length} VENTAS</span></div>
        {vendidas.length === 0 ? <div className="p-8 text-center text-sm text-muted-foreground">Todavía no se vendió ninguna entrada para este evento.</div> : (
          <div className="divide-y divide-border/60">{vendidas.map((v) => <div key={v.id} className="flex items-center justify-between gap-4 p-5"><div className="min-w-0"><h4 className="truncate text-sm font-medium">{v.socio_nombre} {v.socio_apellido}</h4><p className="mt-1 truncate text-xs text-muted-foreground">{v.socio_email} · {v.tipo_entrada_nombre} · {fechaCorta(v.created_at)}</p></div><span className="shrink-0 text-sm font-medium text-primary">{money(v.precio)}</span></div>)}</div>
        )}
      </div>
    </>}

    {modalOpen && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/75 p-5 backdrop-blur-md" role="dialog" aria-modal="true">
      <form onSubmit={crearTipo} className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-primary/30 bg-card shadow-[0_0_60px_rgba(168,85,247,0.2)]">
        <div className="border-b border-border/70 bg-primary/5 p-6"><div className="flex justify-between"><h2 className="font-serif text-3xl">Nuevo tipo de entrada</h2><button type="button" aria-label="Cerrar" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => setModalOpen(false)}><X size={20}/></button></div></div>
        <div className="space-y-4 p-6">
          <label className="block text-xs font-medium">Nombre<input name="nombre" required placeholder="General, VIP..." className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"/></label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-xs font-medium">Precio<input name="precio" type="number" min="0" required className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"/></label>
            <label className="block text-xs font-medium">Cupo<input name="cupo" type="number" min="1" required className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"/></label>
          </div>
          <label className="block text-xs font-medium">Beneficios (separados por coma)<input name="beneficios" placeholder="Acceso VIP, Mesa reservada..." className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"/></label>
        </div>
        <div className="flex justify-end gap-3 border-t border-border/70 bg-muted/20 p-6"><button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-border px-4 py-2.5 text-sm hover:bg-muted">Cancelar</button><button type="submit" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Crear tipo de entrada</button></div>
      </form>
    </div>}
  </>
}