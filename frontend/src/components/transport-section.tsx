'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Bus, MapPin, Clock, Users, Calendar, ArrowRight } from 'lucide-react'

const routes = [
  {
    id: 1,
    origin: 'Córdoba Capital',
    destination: 'TEOS Club',
    time: '23:00',
    returnTime: '05:00',
    price: '$3.500',
    seats: 12,
    available: 8,
    type: 'Combi',
  },
  {
    id: 2,
    origin: 'Villa María',
    destination: 'TEOS Club',
    time: '22:00',
    returnTime: '05:30',
    price: '$5.000',
    seats: 20,
    available: 5,
    type: 'Micro',
  },
  {
    id: 3,
    origin: 'Río Cuarto',
    destination: 'TEOS Club',
    time: '21:30',
    returnTime: '06:00',
    price: '$6.500',
    seats: 20,
    available: 15,
    type: 'Micro',
  },
  {
    id: 4,
    origin: 'San Francisco',
    destination: 'TEOS Club',
    time: '22:30',
    returnTime: '05:00',
    price: '$4.500',
    seats: 15,
    available: 10,
    type: 'Combi',
  },
  {
    id: 5,
    origin: 'Alta Gracia',
    destination: 'TEOS Club',
    time: '23:30',
    returnTime: '05:00',
    price: '$2.500',
    seats: 12,
    available: 3,
    type: 'Combi',
  },
]

export function TransportSection() {
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null)

  return (
    <section id="traslado" className="py-24 relative">
      <div className="absolute bottom-0 left-1/4 w-1/3 h-1/2 bg-electric/5 blur-[150px] rounded-full" />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary border border-primary/30 mb-4">
            Traslado
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Viajá <span className="gradient-text">seguro</span> con nosotros
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Servicio de transporte desde diferentes ciudades. Ida y vuelta incluida para que solo te preocupes por pasarla bien.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map Simulation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-6 h-[500px] relative overflow-hidden"
          >
            {/* Simulated Map Background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
              {/* Grid lines to simulate map */}
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Map Points */}
            <div className="relative h-full">
              {/* TEOS Location (Center) */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/30 animate-ping absolute inset-0" />
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center neon-glow relative">
                    <span className="text-xs font-bold text-primary-foreground">TEOS</span>
                  </div>
                </div>
              </motion.div>

              {/* Route points */}
              {routes.map((route, index) => {
                const positions = [
                  { top: '15%', left: '20%' },
                  { top: '30%', left: '75%' },
                  { top: '70%', left: '80%' },
                  { top: '80%', left: '25%' },
                  { top: '25%', left: '45%' },
                ]
                return (
                  <motion.div
                    key={route.id}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    style={positions[index]}
                    className={`absolute cursor-pointer transition-all ${
                      selectedRoute === route.id ? 'z-10' : ''
                    }`}
                    onClick={() => setSelectedRoute(route.id)}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      selectedRoute === route.id
                        ? 'bg-primary scale-125 neon-glow'
                        : 'glass hover:bg-primary/50'
                    }`}>
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap font-medium">
                      {route.origin}
                    </span>
                  </motion.div>
                )
              })}

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {routes.map((route, index) => {
                  const positions = [
                    { x: '20%', y: '15%' },
                    { x: '75%', y: '30%' },
                    { x: '80%', y: '70%' },
                    { x: '25%', y: '80%' },
                    { x: '45%', y: '25%' },
                  ]
                  return (
                    <motion.line
                      key={route.id}
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: selectedRoute === route.id ? 1 : 0.3 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                      x1={positions[index].x}
                      y1={positions[index].y}
                      x2="50%"
                      y2="50%"
                      stroke={selectedRoute === route.id ? '#a855f7' : '#ffffff'}
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  )
                })}
              </svg>
            </div>
          </motion.div>

          {/* Routes List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {routes.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedRoute(route.id)}
                className={`glass rounded-2xl p-5 cursor-pointer transition-all ${
                  selectedRoute === route.id
                    ? 'ring-2 ring-primary neon-glow'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      route.type === 'Micro' ? 'bg-accent/20' : 'bg-primary/20'
                    }`}>
                      <Bus className={`h-6 w-6 ${
                        route.type === 'Micro' ? 'text-accent' : 'text-primary'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{route.origin}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="font-bold text-primary">{route.destination}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Salida {route.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {route.available} lugares
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold gradient-text">{route.price}</div>
                    <span className="text-xs text-muted-foreground">ida y vuelta</span>
                  </div>
                </div>

                {selectedRoute === route.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Regreso: </span>
                        <span className="font-medium">{route.returnTime}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Tipo: </span>
                        <span className="font-medium">{route.type}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Capacidad: </span>
                        <span className="font-medium">{route.seats} personas</span>
                      </div>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 neon-glow">
                      Reservar Lugar
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}