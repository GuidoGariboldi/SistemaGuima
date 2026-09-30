'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Calendar, Ticket, ChevronDown } from 'lucide-react'

export function HeroSection() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-gradient" />
      
      {/* Animated Particles/Lights */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, '-100%'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-primary/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-accent/10 blur-[150px] rounded-full" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-24 md:pt-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary border border-primary/30">
            La experiencia nocturna definitiva
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="text-foreground">Viví la noche</span>
          <br />
          <span className="gradient-text neon-text">como nunca antes</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Descubrí La Bastarda, donde la música electrónica, las luces y la energía se fusionan 
          para crear una experiencia única e inolvidable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 neon-glow pulse-neon group"
          >
            <Ticket className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Comprar Entradas
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary/50 text-foreground hover:bg-primary/10 text-lg px-8 py-6 group"
          >
            <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Ver Eventos
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          {[
            { number: '50K+', label: 'Asistentes' },
            { number: '200+', label: 'Eventos' },
            { number: '100+', label: 'DJs' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.number}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-sm">Descubrí más</span>
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </section>
  )
}