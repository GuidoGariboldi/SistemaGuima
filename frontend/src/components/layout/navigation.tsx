'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Menu, X, Home, CalendarDays, Ticket, Wine, Info as InfoIcon, ChevronRight, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { name: 'Inicio', href: '#inicio', icon: Home },
  { name: 'Eventos', href: '#eventos', icon: CalendarDays },
  { name: 'Entradas', href: '#entradas', icon: Ticket },
  { name: 'Barra', href: '#barra', icon: Wine },
  { name: 'Info', href: '/info', icon: InfoIcon },
]

interface NavigationProps {
  onLogin: () => void
  onRegister: () => void
  isAuthenticated: boolean
  nombreCompleto?: string
  onProfile: () => void
  onLogout: () => void
}

export function Navigation({ onLogin, onRegister, isAuthenticated, nombreCompleto, onProfile, onLogout }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const iniciales = nombreCompleto
    ? nombreCompleto
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0].toUpperCase())
        .join('')
    : ''

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed left-0 right-0 top-0 z-50 min-w-0 transition-all duration-300 ${
          isScrolled ? 'glass-dark py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto flex min-w-0 items-center justify-between gap-3 px-4">
          {/* Logo */}
          <Link to="/" className="order-1 min-w-0 flex items-center gap-1.5">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <span className="truncate text-xl font-bold tracking-wider gradient-text sm:text-3xl">La Bastarda</span>
              <div className="absolute -inset-2 rounded-full bg-primary/20 blur-xl -z-10" />
            </motion.div>
            <span aria-hidden="true" className="px-0.5 text-base font-semibold text-primary sm:px-1 sm:text-xl">X</span>
            <img src={`${import.meta.env.BASE_URL}la-bastarda-logo.png`} alt="Logo de La Bastarda" className="size-8 shrink-0 rounded-full border border-primary/50 object-cover shadow-[0_0_18px_hsl(var(--primary)/0.35)]" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="order-2 hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ) : (
                <motion.button
                  key={link.name}
                  type="button"
                  onClick={() => scrollToSection(link.href.slice(1))}
                  whileHover={{ scale: 1.05 }}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </motion.button>
              )
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="order-3 hidden items-center gap-4 lg:flex">
            {isAuthenticated ? (
              <>
                <button type="button" onClick={onProfile} className="flex items-center gap-2 rounded-full border border-primary/30 px-3 py-1.5 transition hover:bg-primary/10">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{iniciales}</span>
                  <span className="text-sm font-medium">{nombreCompleto}</span>
                </button>
                <Button type="button" variant="ghost" onClick={onLogout} className="text-foreground/70">Cerrar sesión</Button>
              </>
            ) : (
              <>
                <Button type="button" variant="ghost" onClick={onLogin} className="text-foreground/80 hover:text-foreground hover:bg-white/5">Iniciar Sesión</Button>
                <Button type="button" onClick={onRegister} className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">Registrarse</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="order-4 p-2 text-foreground lg:hidden"
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sheet that rises from the bottom */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="glass absolute inset-x-4 bottom-0 flex max-h-[75dvh] flex-col overflow-hidden rounded-t-[2rem] border border-b-0 border-primary/20 bg-[#120d0e]/95 shadow-2xl shadow-red-950/40"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Drag handle */}
              <div className="flex shrink-0 justify-center pt-3 pb-1">
                <span className="h-1.5 w-12 rounded-full bg-white/15" />
              </div>

              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 pb-4 pt-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Menú</p>
                  <h3 className="text-xl font-bold gradient-text">La Bastarda</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                  aria-label="Cerrar menú"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-4">
                {navLinks.map((link, index) => {
                  const Icon = link.icon
                  const itemClass = "group flex min-h-14 w-full items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold text-foreground/90 transition-all hover:bg-primary/10 hover:text-primary active:scale-[0.98]"
                  return link.href.startsWith('/') ? (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <Link to={link.href} onClick={() => setIsMobileMenuOpen(false)} className={itemClass}>
                        <Icon className="h-5 w-5 text-primary" />
                        <span>{link.name}</span>
                        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.button
                      key={link.name}
                      type="button"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      onClick={() => { setIsMobileMenuOpen(false); scrollToSection(link.href.slice(1)) }}
                      className={itemClass}
                    >
                      <Icon className="h-5 w-5 text-primary" />
                      <span>{link.name}</span>
                      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </motion.button>
                  )
                })}
              </nav>

              {/* Auth footer */}
              <div className="shrink-0 border-t border-white/10 bg-black/20 px-6 py-5">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => { setIsMobileMenuOpen(false); onProfile() }}
                      className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-left transition hover:bg-primary/10"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-red-700 font-bold text-primary-foreground shadow-[0_0_14px_hsl(var(--primary)/0.5)]">{iniciales}</span>
                      <span className="truncate font-semibold">{nombreCompleto}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsMobileMenuOpen(false); onLogout() }}
                      className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 text-muted-foreground transition hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Cerrar sesión"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => { setIsMobileMenuOpen(false); onLogin() }}
                      className="flex-1 border-primary/40 text-foreground"
                    >
                      Iniciar Sesión
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      onClick={() => { setIsMobileMenuOpen(false); onRegister() }}
                      className="flex-1 bg-primary hover:bg-primary/90 neon-glow"
                    >
                      Registrarse
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}