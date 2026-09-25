'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Crown, QrCode, Sparkles } from 'lucide-react'

interface TarjetaCardProps {
  userData: {
    name: string
    lastName: string
    memberNumber: string
    membershipLevel: string
    memberSince: string
    points: number
  }
}

export function TarjetaCard({ userData }: TarjetaCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const levelColors = {
    'General': 'from-blue-600 to-cyan-600',
    'VIP': 'from-purple-600 via-pink-600 to-purple-600',
    'Premium': 'from-amber-600 via-yellow-500 to-amber-600',
  }

  const levelGradient = levelColors[userData.membershipLevel as keyof typeof levelColors] || levelColors['VIP']

  return (
    <div className="flex flex-col items-center gap-8">
      {/* 3D Card */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-md aspect-[1.586/1] cursor-pointer"
      >
        {/* Card Background */}
        <div 
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${levelGradient} p-[2px]`}
          style={{ transform: "translateZ(0)" }}
        >
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
            {/* Animated Glow Effect */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/50 to-transparent blur-3xl animate-pulse" />
              <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent/50 to-transparent blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="cardGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cardGrid)" />
              </svg>
            </div>

            {/* Card Content */}
            <div 
              className="relative h-full p-6 flex flex-col justify-between"
              style={{ transform: "translateZ(50px)" }}
            >
              {/* Top Section */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-3xl font-bold tracking-wider gradient-text">TEOS</span>
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  </div>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">
                    Club Exclusivo
                  </span>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${levelGradient}`}>
                  <Crown className="h-4 w-4" />
                  <span className="text-xs font-bold">{userData.membershipLevel}</span>
                </div>
              </div>

              {/* Middle Section - Member Info */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">SOCIO</p>
                  <p className="text-xl font-bold tracking-wide">
                    {userData.name.toUpperCase()} {userData.lastName.toUpperCase()}
                  </p>
                  <p className="text-sm font-mono text-muted-foreground mt-2">
                    {userData.memberNumber}
                  </p>
                </div>

                {/* QR Code */}
                <div 
                  className="w-20 h-20 rounded-xl bg-white/10 backdrop-blur-sm p-2 flex items-center justify-center"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <div className="w-full h-full bg-white rounded-lg p-1">
                    <div className="w-full h-full grid grid-cols-8 gap-0.5">
                      {[...Array(64)].map((_, i) => (
                        <div
                          key={i}
                          className={`aspect-square ${
                            Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">MIEMBRO DESDE</p>
                  <p className="text-sm font-medium">{userData.memberSince}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">PUNTOS</p>
                  <p className="text-lg font-bold gradient-text">{userData.points.toLocaleString()}</p>
                </div>
              </div>

              {/* Holographic Strip */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                style={{
                  maskImage: 'linear-gradient(to right, transparent, black, transparent)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent, black, transparent)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Reflection */}
        <div 
          className="absolute -bottom-2 left-4 right-4 h-20 bg-gradient-to-b from-primary/20 to-transparent blur-xl rounded-full opacity-50"
          style={{ transform: "translateZ(-50px)" }}
        />
      </motion.div>

      {/* Card Info */}
      <div className="text-center max-w-md">
        <h3 className="text-xl font-bold mb-2">Tu Tarjeta Digital</h3>
        <p className="text-sm text-muted-foreground">
          Presentá el código QR en la entrada para acceder a beneficios exclusivos, 
          acumular puntos y disfrutar de la experiencia TEOS.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-md">
        {[
          { icon: '🎫', label: 'Acceso Rápido', desc: 'Sin filas' },
          { icon: '💎', label: 'Puntos x2', desc: 'En compras' },
          { icon: '🎁', label: 'Regalos', desc: 'Exclusivos' },
        ].map((benefit, i) => (
          <div key={i} className="glass rounded-xl p-4 text-center">
            <span className="text-2xl">{benefit.icon}</span>
            <p className="text-sm font-medium mt-2">{benefit.label}</p>
            <p className="text-xs text-muted-foreground">{benefit.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}