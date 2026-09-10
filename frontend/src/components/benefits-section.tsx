'use client'

import { motion } from 'framer-motion'
import { Gift, Zap, Crown, Star, Percent, Users } from 'lucide-react'

const benefits = [
  {
    icon: Percent,
    title: 'Descuentos Exclusivos',
    description: 'Hasta 30% de descuento en bebidas y entradas para socios.',
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    icon: Zap,
    title: 'Acceso Prioritario',
    description: 'Ingresá sin hacer fila. Tu tiempo vale, nosotros lo sabemos.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    icon: Star,
    title: 'Eventos Exclusivos',
    description: 'Acceso a eventos privados, pre-parties y after parties VIP.',
    gradient: 'from-amber-500/20 to-orange-500/20',
  },
  {
    icon: Gift,
    title: 'Programa de Puntos',
    description: 'Acumulá puntos con cada compra y canjealos por premios.',
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
  {
    icon: Crown,
    title: 'Niveles de Membresía',
    description: 'Subí de nivel y desbloqueá beneficios cada vez mejores.',
    gradient: 'from-rose-500/20 to-red-500/20',
  },
  {
    icon: Users,
    title: 'Referidos',
    description: 'Invitá amigos y ganá puntos extra cuando se registren.',
    gradient: 'from-indigo-500/20 to-purple-500/20',
  },
]

const membershipLevels = [
  { name: 'Starter', points: '0 - 999', color: 'text-blue-400', benefits: 3 },
  { name: 'Silver', points: '1,000 - 4,999', color: 'text-gray-300', benefits: 5 },
  { name: 'Gold', points: '5,000 - 9,999', color: 'text-amber-400', benefits: 7 },
  { name: 'Platinum', points: '10,000+', color: 'text-purple-400', benefits: 'Todos' },
]

export function BenefitsSection() {
  return (
    <section id="beneficios" className="py-24 relative">
      <div className="absolute top-1/3 left-0 w-1/3 h-1/2 bg-primary/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-1/4 h-1/3 bg-accent/5 blur-[150px] rounded-full" />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary border border-primary/30 mb-4">
            Beneficios Exclusivos
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Más razones para ser <span className="gradient-text">socio</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubrí todos los beneficios que tenés por ser parte de la comunidad TEOS.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group glass rounded-2xl p-6 hover:bg-white/5 transition-all"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-7 w-7 text-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Membership Levels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 md:p-12"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            Niveles de <span className="gradient-text">Membresía</span>
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            {membershipLevels.map((level, index) => (
              <motion.div
                key={level.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="glass rounded-2xl p-6 text-center hover:bg-white/5 transition-all"
              >
                <Crown className={`h-10 w-10 mx-auto mb-4 ${level.color}`} />
                <h4 className={`text-xl font-bold mb-2 ${level.color}`}>{level.name}</h4>
                <p className="text-sm text-muted-foreground mb-4">{level.points} puntos</p>
                <div className="text-sm">
                  <span className="text-primary font-bold">{level.benefits}</span>
                  <span className="text-muted-foreground"> beneficios</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress Bar Example */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Tu progreso actual</span>
              <span className="text-primary font-medium">2,450 / 5,000 puntos</span>
            </div>
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '49%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Te faltan 2,550 puntos para alcanzar el nivel Gold
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}