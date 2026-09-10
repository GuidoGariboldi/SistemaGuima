'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Check, Crown, Star, Sparkles, QrCode } from 'lucide-react'

const ticketTypes = [
  {
    name: 'General',
    price: '$6.000',
    description: 'Acceso estándar a la pista principal',
    icon: Star,
    features: [
      'Acceso a pista principal',
      'Guardarropa incluido',
      'Acceso a bar general',
      '1 bebida de bienvenida',
    ],
    popular: false,
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    name: 'VIP',
    price: '$12.000',
    description: 'Experiencia premium con acceso exclusivo',
    icon: Crown,
    features: [
      'Todo lo de General',
      'Acceso a zona VIP',
      'Barra exclusiva',
      '3 bebidas premium incluidas',
      'Acceso rápido sin fila',
      'Asientos reservados',
    ],
    popular: true,
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    name: 'Premium',
    price: '$25.000',
    description: 'La experiencia definitiva en TEOS',
    icon: Sparkles,
    features: [
      'Todo lo de VIP',
      'Mesa privada reservada',
      'Botella premium incluida',
      'Servicio de mesero',
      'Meet & Greet con DJ',
      'Estacionamiento VIP',
      'Acceso backstage',
    ],
    popular: false,
    gradient: 'from-amber-500/20 to-orange-500/20',
  },
]

export function TicketsSection() {
  return (
    <section id="entradas" className="py-24 relative">
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-accent/5 blur-[150px] rounded-full" />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary border border-primary/30 mb-4">
            Entradas
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Elegí tu <span className="gradient-text">experiencia</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Desde acceso general hasta la experiencia más exclusiva. Encontrá la entrada perfecta para vos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {ticketTypes.map((ticket, index) => {
            const Icon = ticket.icon
            return (
              <motion.div
                key={ticket.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`relative glass rounded-3xl p-8 ${
                  ticket.popular ? 'ring-2 ring-primary neon-glow' : ''
                }`}
              >
                {/* Popular Badge */}
                {ticket.popular && (
                  <div className="absolute inset-x-0 top-0 flex -translate-y-1/2 justify-center px-4">
                    <span className="whitespace-nowrap rounded-full border border-primary/40 bg-primary px-4 py-1.5 text-center text-xs font-bold tracking-[0.14em] text-primary-foreground shadow-[0_0_24px_hsl(var(--primary)/0.45)] sm:text-sm">
                      MÁS ELEGIDA
                    </span>
                  </div>
                )}

                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${ticket.gradient} rounded-3xl opacity-50`} />

                <div className="relative">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-6 mx-auto">
                    <Icon className={`h-8 w-8 ${ticket.popular ? 'text-primary' : 'text-foreground'}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-center mb-2">{ticket.name}</h3>
                  <p className="text-sm text-muted-foreground text-center mb-6">{ticket.description}</p>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <span className="text-4xl font-bold gradient-text">{ticket.price}</span>
                    <span className="text-muted-foreground ml-2">/ persona</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {ticket.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <Button
                    className={`w-full ${
                      ticket.popular
                        ? 'bg-primary hover:bg-primary/90 neon-glow'
                        : 'glass hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    Comprar Entrada
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* QR Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-md mx-auto"
        >
          <div className="glass rounded-3xl p-8 text-center">
            <QrCode className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h4 className="text-xl font-bold mb-2">Tu entrada digital</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Recibí tu entrada con código QR único directamente en tu celular. 
              Sin imprimir, sin filas, sin complicaciones.
            </p>
            <div className="w-32 h-32 mx-auto glass rounded-xl flex items-center justify-center">
              <div className="grid grid-cols-5 gap-1">
                {[...Array(25)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-sm ${
                      Math.random() > 0.5 ? 'bg-primary' : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}