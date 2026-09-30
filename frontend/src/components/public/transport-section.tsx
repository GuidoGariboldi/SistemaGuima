'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Bus, MapPin, Clock, Users, Calendar, ArrowRight } from 'lucide-react'

const routes = [
  {
    id: 1,
    origin: 'Córdoba Capital',
    destination: 'La Bastarda Club',
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
    destination: 'La Bastarda Club',
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
    destination: 'La Bastarda Club',
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
    destination: 'La Bastarda Club',
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
    destination: 'La Bastarda Club',
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
            className="glass rounded-3xl p-4 sm:p-6 h-[500px] relative overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10"
          >
            {/* Simulated Map Background */}
            <div className="absolute inset-0 opacity-80">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.16),transparent_32%),linear-gradient(135deg,hsl(var(--primary)/0.1),transparent_45%,hsl(var(--accent)/0.14))]" />
              <div className="absolute -left-20 top-20 h-56 w-[130%] rotate-[18deg] border-y border-primary/10 bg-primary/[0.03]" />
              <div className="absolute -right-20 bottom-24 h-40 w-[130%] -rotate-[24deg] border-y border-accent/10 bg-accent/[0.03]" />
              {/* Neon map surface */}
              <svg className="h-full w-full" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-label="Mapa estilizado de rutas hacia La Bastarda Club">
                <defs>
                  <pattern id="map-grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M 42 0 L 0 0 0 42" fill="none" stroke="hsl(var(--primary) / 0.12)" strokeWidth="1" /></pattern>
                </defs>
                <rect width="800" height="500" fill="url(#map-grid)" />
                <path d="M-40 130 C140 80 190 210 340 180 S560 75 840 115" fill="none" stroke="hsl(var(--primary) / 0.16)" strokeWidth="18" />
                <path d="M-40 130 C140 80 190 210 340 180 S560 75 840 115" fill="none" stroke="hsl(var(--primary) / 0.28)" strokeWidth="2" />
                <path d="M80 -30 C140 120 280 160 300 260 S470 390 560 540" fill="none" stroke="hsl(var(--accent) / 0.18)" strokeWidth="15" />
                <path d="M80 -30 C140 120 280 160 300 260 S470 390 560 540" fill="none" stroke="hsl(var(--accent) / 0.35)" strokeWidth="2" />
                <path d="M-20 410 C160 330 240 390 390 330 S610 280 840 350" fill="none" stroke="hsl(var(--primary) / 0.14)" strokeWidth="10" />
                <path d="M-20 410 C160 330 240 390 390 330 S610 280 840 350" fill="none" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
                <circle cx="400" cy="250" r="82" fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--primary) / 0.18)" strokeDasharray="3 8" />
                <circle cx="400" cy="250" r="54" fill="none" stroke="hsl(var(--primary) / 0.18)" strokeDasharray="2 7" />
              </svg>
            </div>

            <div className="absolute left-5 top-5 z-20 rounded-2xl border border-white/10 bg-background/70 px-4 py-3 backdrop-blur-md"><p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">Mapa de traslado</p><p className="mt-1 text-xs text-muted-foreground">Rutas nocturnas hacia La Bastarda Club</p></div><div className="absolute right-5 top-5 z-20 flex flex-col overflow-hidden rounded-xl border border-white/10 bg-background/75 shadow-xl backdrop-blur-md"><button type="button" aria-label="Acercar mapa" className="px-3 py-2 text-lg text-muted-foreground transition hover:bg-primary/20 hover:text-primary">+</button><div className="h-px bg-white/10"/><button type="button" aria-label="Alejar mapa" className="px-3 py-2 text-lg text-muted-foreground transition hover:bg-primary/20 hover:text-primary">−</button></div>

            <div className="absolute bottom-5 left-5 z-20 flex items-center gap-3 rounded-full border border-white/10 bg-background/70 px-4 py-2 text-[10px] text-muted-foreground backdrop-blur-md"><span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />La Bastarda Club</span><span className="flex items-center gap-1.5"><span className="size-2 rounded-full border border-primary bg-transparent" />Puntos de salida</span></div>

            {/* Map Points */}
            <div className="relative h-full">
              {/* La Bastarda Location (Center) */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="relative"><div className="absolute inset-0 h-16 w-16 rounded-full bg-primary/30 animate-ping" /><div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary neon-glow"><span className="text-[10px] font-bold tracking-widest text-primary-foreground">La Bastarda</span></div></div>
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
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-primary/30 shadow-lg shadow-background/40 transition-all ${
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
                      stroke={selectedRoute === route.id ? '#ef4444' : '#ffffff'}
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