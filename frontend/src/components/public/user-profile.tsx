'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  User, Mail, Calendar, Settings, History, Ticket, 
  Crown, Edit3, Camera, ChevronRight, X 
} from 'lucide-react'
import { TarjetaCard } from './tarjeta-card'

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
  memberNumber: 'TEOS-2024-0847',
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
  const [showTeosCard, setShowTeosCard] = useState(false)

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl glass rounded-3xl overflow-hidden max-h-[90vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Sidebar */}
          <div className="md:w-72 p-6 border-b md:border-b-0 md:border-r border-white/10">
            {/* User Avatar */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold">
                  {userData.name[0]}{userData.lastName[0]}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h3 className="text-xl font-bold mt-4">{userData.name} {userData.lastName}</h3>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Crown className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary font-medium">Miembro {userData.membershipLevel}</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {[
                { id: 'profile', label: 'Mi Perfil', icon: User },
                { id: 'card', label: 'Tarjeta TEOS', icon: Crown },
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
                      if (item.id === 'card') setShowTeosCard(true)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
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
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Mi Perfil</h2>
                  <Button variant="outline" size="sm" className="border-primary/50">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="h-5 w-5 text-primary" />
                        <span className="text-sm text-muted-foreground">Nombre completo</span>
                      </div>
                      <p className="font-medium">{userData.name} {userData.lastName}</p>
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
                      <div className="flex items-center gap-3 mb-2">
                        <Crown className="h-5 w-5 text-primary" />
                        <span className="text-sm text-muted-foreground">Número de socio</span>
                      </div>
                      <p className="font-medium font-mono">{userData.memberNumber}</p>
                    </div>

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
                <h2 className="text-2xl font-bold mb-6">Tu Tarjeta TEOS</h2>
                <TarjetaCard userData={userData} />
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