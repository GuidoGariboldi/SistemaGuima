'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  User, Mail, Calendar, Settings, History, Ticket,
  Crown, Edit3, Camera, ChevronRight, X, Eye, EyeOff, Menu,
  Pause, Play, ShieldAlert, Wine, Sparkles, Star, IdCard, Loader2
} from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { api, ApiError } from '@/lib/api'

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
}

const money = (value) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)
const mesAno = (iso) => iso ? new Date(iso).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }) : ''
const fechaCorta = (iso) => iso ? new Date(iso).toLocaleDateString('es-AR') : ''

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { socio, actualizarPerfil } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [showMobileMenu, setShowMobileMenu] = useState(true)
  const [cardLinked, setCardLinked] = useState(false)
  const [showCardForm, setShowCardForm] = useState(false)
  const [hideCardNumber, setHideCardNumber] = useState(true)
  const [hideBalance, setHideBalance] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [nombreEdit, setNombreEdit] = useState('')
  const [apellidoEdit, setApellidoEdit] = useState('')
  const [dniEdit, setDniEdit] = useState('')
  const [perfilError, setPerfilError] = useState('')
  const [guardandoPerfil, setGuardandoPerfil] = useState(false)
  const [tarjeta, setTarjeta] = useState(null)
  const [cardError, setCardError] = useState('')
  const [entradas, setEntradas] = useState([])
  const [movimientos, setMovimientos] = useState([])
  const [productos, setProductos] = useState([])
  const [accionTarjetaLoading, setAccionTarjetaLoading] = useState(false)
  const [accionTarjetaError, setAccionTarjetaError] = useState('')
  const [confirmandoPerdida, setConfirmandoPerdida] = useState(false)

  useEffect(() => {
    if (socio) { setNombreEdit(socio.nombre); setApellidoEdit(socio.apellido); setDniEdit(socio.dni ?? '') }
  }, [socio])

  const guardarPerfil = async () => {
    setPerfilError('')
    if (dniEdit && !/^\d{7,8}$/.test(dniEdit)) return setPerfilError('El DNI debe tener 7 u 8 dígitos, sin puntos.')
    setGuardandoPerfil(true)
    try {
      await actualizarPerfil({ nombre: nombreEdit, apellido: apellidoEdit, dni: dniEdit || undefined })
      setIsEditing(false)
    } catch (error) {
      setPerfilError(error instanceof ApiError ? error.message : 'No se pudo guardar el perfil.')
    } finally {
      setGuardandoPerfil(false)
    }
  }

  const cargarTarjeta = () => {
    api.get('/tarjetas/mia').then((data) => { setTarjeta(data); setCardLinked(true) }).catch(() => { setTarjeta(null); setCardLinked(false) })
    api.get('/tarjetas/mia/movimientos?limit=50').then(setMovimientos).catch(() => setMovimientos([]))
  }

  useEffect(() => {
    if (!isOpen || !socio) return
    cargarTarjeta()
    api.get('/entradas/mias?limit=50').then(setEntradas).catch(() => setEntradas([]))
    api.get('/productos?limit=100').then(setProductos).catch(() => setProductos([]))
  }, [isOpen, socio])

  const vincularTarjeta = async (event) => {
    event.preventDefault()
    setCardError('')
    const cardUid = String(new FormData(event.currentTarget).get('cardNumber') ?? '').trim()
    if (!cardUid) return
    try {
      await api.patch(`/tarjetas/${cardUid}/vincular`, {})
      const data = await api.get(`/tarjetas/mia`)
      setTarjeta(data)
      setCardLinked(true)
      setShowCardForm(false)
    } catch (error) {
      setCardError(error instanceof ApiError ? error.message : 'No se pudo vincular la tarjeta.')
    }
  }

  const pausarTarjeta = async () => {
    setAccionTarjetaError('')
    setAccionTarjetaLoading(true)
    try {
      await api.patch('/tarjetas/mia/pausar', {})
      cargarTarjeta()
    } catch (error) {
      setAccionTarjetaError(error instanceof ApiError ? error.message : 'No se pudo pausar la tarjeta.')
    } finally {
      setAccionTarjetaLoading(false)
    }
  }

  const reactivarTarjeta = async () => {
    setAccionTarjetaError('')
    setAccionTarjetaLoading(true)
    try {
      await api.patch('/tarjetas/mia/reactivar', {})
      cargarTarjeta()
    } catch (error) {
      setAccionTarjetaError(error instanceof ApiError ? error.message : 'No se pudo reactivar la tarjeta.')
    } finally {
      setAccionTarjetaLoading(false)
    }
  }

  const reportarPerdida = async () => {
    setAccionTarjetaError('')
    setAccionTarjetaLoading(true)
    try {
      await api.patch('/tarjetas/mia/reportar-perdida', {})
      setConfirmandoPerdida(false)
      cargarTarjeta()
    } catch (error) {
      setAccionTarjetaError(error instanceof ApiError ? error.message : 'No se pudo dar de baja la tarjeta.')
    } finally {
      setAccionTarjetaLoading(false)
    }
  }

  if (!isOpen || !socio) return null

  const entradasActivas = entradas.filter((e) => e.estado === 'valida')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-2 backdrop-blur-md sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#120d0e]/95 shadow-2xl shadow-red-950/40 glass md:flex-row"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          {/* Sidebar */}
          <div className={`${showMobileMenu ? 'flex' : 'hidden'} shrink-0 flex-col border-b border-white/10 bg-gradient-to-b from-red-950/25 to-transparent p-4 md:flex md:w-72 md:border-b-0 md:border-r md:p-6`}>
            {/* User Avatar */}
            <div className="mb-6 text-center">
              <div className="relative mx-auto inline-block">
                <div className="absolute -inset-3 rounded-full bg-primary/25 blur-2xl" />
                <div className="relative flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-[#ff655f] via-[#e98763] to-[#8bb34c] text-3xl font-bold text-white shadow-[0_0_30px_hsl(var(--primary)/0.4)] ring-4 ring-white/10">
                  {socio.nombre[0]}{socio.apellido[0]}
                </div>
                <button className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.6)] ring-2 ring-[#120d0e] transition hover:bg-primary/90">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h3 className="mt-4 text-xl font-bold">{socio.nombre} {socio.apellido}</h3>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
                <Crown className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold tracking-wide text-primary">Cliente La Bastarda</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1.5">
              {[
                { id: 'profile', label: 'Mi Perfil', icon: User },
                { id: 'card', label: 'Tarjeta La Bastarda', icon: Crown },
                { id: 'history', label: 'Historial', icon: History },
                { id: 'tickets', label: 'Mis Entradas', icon: Ticket },
                { id: 'products', label: 'Barra', icon: Wine },
                { id: 'settings', label: 'Configuración', icon: Settings },
              ].map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setShowMobileMenu(false)
                    }}
                    className={`group relative flex min-h-14 w-full items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 transition-all touch-manipulation active:scale-[0.98] ${
                      isActive
                        ? 'bg-gradient-to-r from-primary/25 to-primary/5 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.35)]'
                        : 'text-foreground/70 hover:bg-white/5 hover:text-foreground'
                    }`}
                  >
                    {isActive && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.8)]" />}
                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${isActive ? 'bg-primary/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="font-medium">{item.label}</span>
                    <ChevronRight className={`ml-auto h-4 w-4 transition-transform ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:translate-x-0.5'}`} />
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className={`${showMobileMenu ? 'hidden' : 'flex'} min-h-0 flex-1 flex-col overflow-y-auto bg-gradient-to-b from-red-950/10 to-transparent p-4 sm:p-6 md:flex`}>
            <button
              type="button"
              onClick={() => setShowMobileMenu(true)}
              className="mb-5 mt-6 inline-flex min-h-11 w-auto items-center gap-3 self-start rounded-xl border border-primary/30 bg-primary/10 px-4 text-left font-semibold text-primary md:hidden"
            >
              <Menu className="size-5 shrink-0" />
              <span>Menú de perfil</span>
            </button>

            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Mi Perfil</h2>
                  <Button variant="outline" size="sm" disabled={guardandoPerfil} onClick={() => (isEditing ? guardarPerfil() : setIsEditing(true))} className="border-primary/50">
                    {guardandoPerfil ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Edit3 className="mr-2 h-4 w-4" />}
                    {isEditing ? 'Guardar' : 'Editar'}
                  </Button>
                </div>
                {perfilError && <p className="mb-4 text-sm text-destructive" role="alert">{perfilError}</p>}

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="h-5 w-5 text-primary" />
                        <span className="text-sm text-muted-foreground">Nombre completo</span>
                      </div>
                      {isEditing ? (
                        <div className="grid grid-cols-2 gap-2">
                          <input value={nombreEdit} onChange={(event) => setNombreEdit(event.target.value)} className="w-full rounded-lg border border-primary/40 bg-background/40 px-3 py-2 font-medium" aria-label="Nombre" placeholder="Nombre" />
                          <input value={apellidoEdit} onChange={(event) => setApellidoEdit(event.target.value)} className="w-full rounded-lg border border-primary/40 bg-background/40 px-3 py-2 font-medium" aria-label="Apellido" placeholder="Apellido" />
                        </div>
                      ) : (
                        <p className="font-medium">{socio.nombre} {socio.apellido}</p>
                      )}
                    </div>

                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="h-5 w-5 text-primary" />
                        <span className="text-sm text-muted-foreground">Email</span>
                      </div>
                      <p className="font-medium">{socio.email}</p>
                    </div>

                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span className="text-sm text-muted-foreground">Fecha de nacimiento</span>
                      </div>
                      <p className="font-medium">{fechaCorta(socio.fecha_nac)}</p>
                    </div>

                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <IdCard className="h-5 w-5 text-primary" />
                        <span className="text-sm text-muted-foreground">DNI</span>
                      </div>
                      {isEditing ? (
                        <input value={dniEdit} onChange={(event) => setDniEdit(event.target.value.replace(/\D/g, ''))} inputMode="numeric" placeholder="Sin puntos, ej: 30123456" className="w-full rounded-lg border border-primary/40 bg-background/40 px-3 py-2 font-medium" aria-label="DNI" />
                      ) : (
                        <p className="font-medium">{socio.dni || <span className="text-muted-foreground">Sin cargar — lo necesitás para comprar entradas</span>}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="glass rounded-xl p-4">
                      <span className="text-sm text-muted-foreground">Miembro desde</span>
                      <p className="font-medium">{mesAno(socio.created_at)}</p>
                    </div>

                    <div className="glass rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm text-muted-foreground">Puntos acumulados</span>
                          <p className="text-2xl font-bold gradient-text">{socio.puntos.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground">Eventos</span>
                          <p className="text-2xl font-bold">{entradas.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'card' && (
              <div>
                <h2 className="mb-2 text-2xl font-bold">Tu Tarjeta La Bastarda</h2>
                <p className="mb-6 text-sm text-muted-foreground">Una única tarjeta para identificarte y consultar tu saldo.</p>

                {!cardLinked ? (
                  <div className="glass rounded-2xl p-6">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <Crown className="size-6" />
                      </div>
                      <div>
                        <h3 className="font-bold">Vinculá tu tarjeta</h3>
                        <p className="text-sm text-muted-foreground">Completá estos pasos para asociarla.</p>
                      </div>
                    </div>

                    <ol className="mb-6 space-y-3 text-sm text-muted-foreground">
                      <li>1. Tené a mano tu tarjeta física.</li>
                      <li>2. Ingresá el número de tarjeta y el email de tu cuenta.</li>
                      <li>3. Confirmá la vinculación para ver tu saldo.</li>
                    </ol>

                    <Button onClick={() => setShowCardForm(true)} className="w-full bg-primary">
                      Vincular Tarjeta
                    </Button>

                    {showCardForm && (
                      <form
                        onSubmit={vincularTarjeta}
                        className="mt-5 space-y-3 border-t border-border pt-5"
                      >
                        <input
                          required
                          name="cardNumber"
                          placeholder="Número de tarjeta (ej: TEOS-0001)"
                          className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3"
                        />
                        {cardError && <p className="text-sm text-destructive" role="alert">{cardError}</p>}
                        <Button type="submit" className="w-full bg-primary">
                          Confirmar vinculación
                        </Button>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="glass rounded-2xl p-6">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-primary">Tarjeta vinculada</p>
                        <p className="mt-2 font-mono text-lg">
                          {hideCardNumber ? `•••• ${tarjeta?.card_uid?.slice(-4) ?? ''}` : tarjeta?.card_uid}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {tarjeta?.estado === 'bloqueada' && (
                          <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-400">Pausada</span>
                        )}
                        <Button variant="outline" size="sm" onClick={() => setHideCardNumber(!hideCardNumber)}>
                          {hideCardNumber ? 'Mostrar' : 'Ocultar'}
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-primary/10 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm text-muted-foreground">Saldo disponible</p>
                          <button
                            type="button"
                            onClick={() => setHideBalance(!hideBalance)}
                            aria-label={hideBalance ? 'Mostrar saldo' : 'Ocultar saldo'}
                            aria-pressed={!hideBalance}
                            className="rounded-full p-2 text-primary transition hover:bg-primary/15"
                          >
                            {hideBalance ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                          </button>
                        </div>
                        <p className="mt-1 text-3xl font-bold tracking-wider text-primary">
                          {hideBalance ? '••••••' : money(tarjeta?.saldo ?? 0)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-muted/30 p-4">
                        <div className="flex items-center gap-2 text-muted-foreground"><Star className="size-4" /><p className="text-sm">Puntos acumulados</p></div>
                        <p className="mt-1 text-3xl font-bold tracking-wider">{socio.puntos.toLocaleString()}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => { onClose(); navigate('/carga') }}
                      disabled={tarjeta?.estado !== 'activa'}
                      className="mt-5 w-full bg-primary disabled:opacity-40"
                    >
                      Cargar saldo
                    </Button>

                    {accionTarjetaError && <p className="mt-3 text-sm text-destructive" role="alert">{accionTarjetaError}</p>}

                    <div className="mt-3 flex gap-3">
                      {tarjeta?.estado === 'activa' ? (
                        <button
                          type="button"
                          disabled={accionTarjetaLoading}
                          onClick={pausarTarjeta}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm transition hover:bg-muted disabled:opacity-50"
                        >
                          <Pause className="size-4" />Pausar tarjeta
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={accionTarjetaLoading}
                          onClick={reactivarTarjeta}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary/40 px-4 py-3 text-sm text-primary transition hover:bg-primary/10 disabled:opacity-50"
                        >
                          <Play className="size-4" />Reactivar tarjeta
                        </button>
                      )}
                    </div>

                    {!confirmandoPerdida ? (
                      <button
                        type="button"
                        onClick={() => setConfirmandoPerdida(true)}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 px-4 py-3 text-sm text-destructive transition hover:bg-destructive/10"
                      >
                        <ShieldAlert className="size-4" />Reporté pérdida o robo
                      </button>
                    ) : (
                      <div className="mt-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                        <p className="text-sm text-foreground">Esta tarjeta va a quedar dada de baja para siempre. El saldo no se pierde, pero vas a tener que vincular una tarjeta nueva para volver a usarlo.</p>
                        <div className="mt-4 flex gap-3">
                          <button type="button" onClick={() => setConfirmandoPerdida(false)} className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-muted">Cancelar</button>
                          <button type="button" disabled={accionTarjetaLoading} onClick={reportarPerdida} className="flex-1 rounded-xl bg-destructive/15 px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/25 disabled:opacity-50">Confirmar baja</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Historial</h2>
                <p className="mb-6 text-sm text-muted-foreground">Movimientos de tu tarjeta y entradas compradas.</p>

                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Movimientos de tarjeta</h3>
                {movimientos.length === 0 ? (
                  <div className="glass rounded-2xl p-6 text-center text-muted-foreground">Todavía no hay movimientos en tu tarjeta.</div>
                ) : (
                  <div className="space-y-3">
                    {movimientos.map((mov) => (
                      <div key={mov.id} className="glass rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mov.tipo === 'carga' || mov.tipo === 'devolucion' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {mov.tipo === 'carga' || mov.tipo === 'devolucion' ? <Play className="h-4 w-4 rotate-90" /> : <Wine className="h-4 w-4" />}
                          </div>
                          <div>
                            <h4 className="font-medium capitalize">{mov.tipo}{mov.medio_pago ? ` · ${mov.medio_pago}` : ''}</h4>
                            <p className="text-sm text-muted-foreground">{fechaCorta(mov.created_at)}</p>
                          </div>
                        </div>
                        <p className={`text-lg font-bold ${mov.tipo === 'carga' || mov.tipo === 'devolucion' ? 'text-primary' : ''}`}>
                          {mov.tipo === 'carga' || mov.tipo === 'devolucion' ? '+' : '-'}{money(mov.monto)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <h3 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Entradas compradas</h3>
                {entradas.length === 0 ? (
                  <div className="glass rounded-2xl p-6 text-center text-muted-foreground">Todavía no compraste ninguna entrada.</div>
                ) : (
                  <div className="space-y-4">
                    {entradas.map((entrada) => (
                      <div key={entrada.id} className="glass rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                            <Ticket className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-bold">{entrada.evento_nombre}</h4>
                            <p className="text-sm text-muted-foreground">{fechaCorta(entrada.evento_fecha)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${entrada.estado === 'valida' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {entrada.tipo_entrada_nombre}
                          </span>
                          <p className="text-lg font-bold mt-1">{money(entrada.precio)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <h2 className="mb-2 text-2xl font-bold">Barra La Bastarda</h2>
                <p className="mb-6 text-sm text-muted-foreground">Lo que vas a encontrar en la barra esta noche.</p>
                {productos.length === 0 ? (
                  <div className="glass rounded-2xl p-6 text-center text-muted-foreground">Todavía no hay productos cargados.</div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {productos.map((producto) => (
                      <div key={producto.id} className="glass flex items-center justify-between gap-3 rounded-xl p-4">
                        <div className="min-w-0">
                          <h4 className="truncate font-medium">{producto.nombre}</h4>
                          <p className="text-xs text-muted-foreground">{producto.categoria}</p>
                        </div>
                        <p className="shrink-0 font-semibold text-primary">{money(producto.precio)}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-muted-foreground">
                  <Sparkles className="mt-0.5 shrink-0 text-primary" size={17} />
                  Todavía no tenemos promociones cargadas — cuando el club defina descuentos o combos, van a aparecer acá.
                </div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Mis Entradas Activas</h2>
                {entradasActivas.length === 0 ? (
                  <div className="glass rounded-2xl p-6 text-center">
                    <Ticket className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h4 className="text-lg font-medium mb-2">No tenés entradas activas</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Comprá tu entrada para el próximo evento
                    </p>
                    <Button className="bg-primary hover:bg-primary/90" onClick={onClose}>
                      Ver Eventos
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entradasActivas.map((entrada) => (
                      <div key={entrada.id} className="glass rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                            <Ticket className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-bold">{entrada.evento_nombre}</h4>
                            <p className="text-sm text-muted-foreground">{entrada.tipo_entrada_nombre} · {fechaCorta(entrada.evento_fecha)}</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold">{money(entrada.precio)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Configuración</h2>
                <div className="space-y-4">
                  <div className="glass rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificaciones por email</h4>
                      <p className="text-sm text-muted-foreground">Recibir novedades sobre eventos</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
                  </div>
                  <div className="glass rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificaciones push</h4>
                      <p className="text-sm text-muted-foreground">Alertas de últimas entradas</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
                  </div>
                  <div className="glass rounded-xl p-4">
                    <h4 className="font-medium mb-2">Cambiar contraseña</h4>
                    <Button variant="outline" size="sm" className="border-primary/50">
                      Actualizar contraseña
                    </Button>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <h4 className="font-medium text-destructive mb-2">Eliminar cuenta</h4>
                    <p className="text-sm text-muted-foreground mb-3">Esta acción es irreversible</p>
                    <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive/10">
                      Eliminar mi cuenta
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}