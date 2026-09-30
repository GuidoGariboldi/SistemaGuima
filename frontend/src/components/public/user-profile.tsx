'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  User, Mail, Calendar, Settings, History, Ticket, 
  Crown, Edit3, Camera, ChevronRight, X, Eye, EyeOff, Menu 
} from 'lucide-react'

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
}

const userData = {
  name: 'Juan',
  lastName: 'Pérez',
  email: 'juan.perez@email.com',
  birthDate: '15/03/1995',
  memberSince: 'Marzo 2024',
  memberNumber: 'La Bastarda-2024-0847',
  membershipLevel: 'VIP',
  points: 2450,
  eventsAttended: 12,
}

const purchaseHistory = [
  { id: 1, event: 'Neon Dreams', date: '15 Nov 2024', type: 'VIP', price: '$12.000' },
  { id: 2, event: 'Electric Pulse', date: '02 Nov 2024', type: 'General', price: '$6.000' },
  { id: 3, event: 'Midnight Rave', date: '20 Oct 2024', type: 'Premium', price: '$25.000' },
  { id: 4, event: 'Bass Nation', date: '05 Oct 2024', type: 'VIP', price: '$12.000' },
]

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState('profile')
  const [showMobileMenu, setShowMobileMenu] = useState(true)
  const [showTeosCard, setShowTeosCard] = useState(false)
  const [cardLinked, setCardLinked] = useState(false)
  const [showCardForm, setShowCardForm] = useState(false)
  const [hideCardNumber, setHideCardNumber] = useState(true)
  const [hideBalance, setHideBalance] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [profileName, setProfileName] = useState(`${userData.name} ${userData.lastName}`)

  if (!isOpen) return null

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
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          {/* Sidebar */}
          <div className={`${showMobileMenu ? 'flex' : 'hidden'} shrink-0 flex-col border-b border-white/10 bg-gradient-to-b from-red-950/25 to-transparent p-4 md:flex md:w-72 md:border-b-0 md:border-r md:p-6`}>
            {/* User Avatar */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-[#ff655f] via-[#e98763] to-[#8bb34c] text-3xl font-bold shadow-lg shadow-red-500/20 ring-4 ring-white/10">
                  {userData.name[0]}{userData.lastName[0]}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h3 className="mt-4 text-xl font-bold">{profileName}</h3>
              <div className="flex items-center justify-center gap-2 mt-2">
<span className="size-2 rounded-full bg-primary" />
                        <span className="text-sm text-primary font-medium">Cliente La Bastarda</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {[
                { id: 'profile', label: 'Mi Perfil', icon: User },
                { id: 'card', label: 'Tarjeta La Bastarda', icon: Crown },
                { id: 'history', label: 'Historial', icon: History },
                { id: 'tickets', label: 'Mis Entradas', icon: Ticket },
                { id: 'settings', label: 'Configuración', icon: Settings },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setShowMobileMenu(false)
                      if (item.id === 'card') setShowTeosCard(true)
                    }}
                    className={`min-h-14 w-full flex items-center gap-3 rounded-2xl px-4 py-3 transition-all touch-manipulation active:scale-[0.98] ${
                      activeTab === item.id
                        ? 'bg-primary/20 text-primary'
                        : 'hover:bg-white/5 text-foreground/70'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className={`${showMobileMenu ? 'hidden' : 'flex'} min-h-0 flex-1 flex-col overflow-y-auto bg-gradient-to-b from-red-950/10 to-transparent p-4 sm:p-6 md:flex`}>
            <button type="button" onClick={() => setShowMobileMenu(true)} className="mb-5 flex min-h-11 w-full items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-4 text-left font-semibold text-primary md:hidden"><span>Menú de perfil</span><Menu className="size-5" /></button>
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Mi Perfil</h2>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} className="border-primary/50"><Edit3 className="mr-2 h-4 w-4" />{isEditing ? 'Guardar' : 'Editar'}</Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="h-5 w-5 text-primary" />
                        <span className="text-sm text-muted-foreground">Nombre completo</span>
                      </div>
                      {isEditing ? <input value={profileName} onChange={(event) => setProfileName(event.target.value)} className="w-full rounded-lg border border-primary/40 bg-background/40 px-3 py-2 font-medium" aria-label="Nombre completo" /> : <p className="font-medium">{profileName}</p>}
                    </div>

                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="h-5 w-5 text-primary" />
                        <span className="text-sm text-muted-foreground">Email</span>
                      </div>
                      <p className="font-medium">{userData.email}</p>
                    </div>

                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span className="text-sm text-muted-foreground">Fecha de nacimiento</span>
                      </div>
                      <p className="font-medium">{userData.birthDate}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="glass rounded-xl p-4">
                      <span className="text-sm text-muted-foreground">Miembro desde</span>
                      <p className="font-medium">{userData.memberSince}</p>
                    </div>

                    <div className="glass rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm text-muted-foreground">Puntos acumulados</span>
                          <p className="text-2xl font-bold gradient-text">{userData.points.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground">Eventos</span>
                          <p className="text-2xl font-bold">{userData.eventsAttended}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'card' && (
              <div>
                <h2 className="mb-2 text-2xl font-bold">Tu Tarjeta La Bastarda</h2><p className="mb-6 text-sm text-muted-foreground">Una única tarjeta para identificarte y consultar tu saldo.</p>
                {!cardLinked ? <div className="glass rounded-2xl p-6"><div className="mb-5 flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary"><Crown className="size-6" /></div><div><h3 className="font-bold">Vinculá tu tarjeta</h3><p className="text-sm text-muted-foreground">Completá estos pasos para asociarla.</p></div></div><ol className="mb-6 space-y-3 text-sm text-muted-foreground"><li>1. Tené a mano tu tarjeta física.</li><li>2. Ingresá el número de tarjeta y el email de tu cuenta.</li><li>3. Confirmá la vinculación para ver tu saldo.</li></ol><Button onClick={() => setShowCardForm(true)} className="w-full bg-primary">Vincular Tarjeta</Button>{showCardForm && <form onSubmit={(event) => { event.preventDefault(); setCardLinked(true); setShowCardForm(false) }} className="mt-5 space-y-3 border-t border-border pt-5"><input required name="cardNumber" inputMode="numeric" placeholder="Número de tarjeta" className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3" /><input required name="email" type="email" placeholder="Correo de tu cuenta" className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3" /><Button type="submit" className="w-full bg-primary">Confirmar vinculación</Button></form>}</div> : <div className="glass rounded-2xl p-6"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs uppercase tracking-widest text-primary">Tarjeta vinculada</p><p className="mt-2 font-mono text-lg">{hideCardNumber ? '•••• •••• •••• 0847' : '5424 4532 8912 0847'}</p></div><Button variant="outline" size="sm" onClick={() => setHideCardNumber(!hideCardNumber)}>{hideCardNumber ? 'Mostrar' : 'Ocultar'}</Button></div><div className="rounded-xl bg-primary/10 p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Saldo disponible</p><button type="button" onClick={() => setHideBalance(!hideBalance)} aria-label={hideBalance ? 'Mostrar saldo' : 'Ocultar saldo'} aria-pressed={!hideBalance} className="rounded-full p-2 text-primary transition hover:bg-primary/15">{hideBalance ? <Eye className="size-5" /> : <EyeOff className="size-5" />}</button></div><p className="mt-1 text-3xl font-bold tracking-wider text-primary">{hideBalance ? '••••••' : '$48.500'}</p></div></div>}
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Historial de Compras</h2>
                <div className="space-y-4">
                  {purchaseHistory.map((purchase) => (
                    <div key={purchase.id} className="glass rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                          <Ticket className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold">{purchase.event}</h4>
                          <p className="text-sm text-muted-foreground">{purchase.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          purchase.type === 'Premium' ? 'bg-amber-500/20 text-amber-500' :
                          purchase.type === 'VIP' ? 'bg-primary/20 text-primary' :
                          'bg-accent/20 text-accent'
                        }`}>
                          {purchase.type}
                        </span>
                        <p className="text-lg font-bold mt-1">{purchase.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Mis Entradas Activas</h2>
                <div className="glass rounded-2xl p-6 text-center">
                  <Ticket className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="text-lg font-medium mb-2">No tenés entradas activas</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprá tu entrada para el próximo evento
                  </p>
                  <Button className="bg-primary hover:bg-primary/90">
                    Ver Eventos
                  </Button>
                </div>
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