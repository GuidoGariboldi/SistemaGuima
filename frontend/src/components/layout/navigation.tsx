'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { name: 'Inicio', href: '#inicio' },
  { name: 'Eventos', href: '#eventos' },
  { name: 'Entradas', href: '#entradas' },
  { name: 'Barra', href: '#barra' },
  { name: 'Mesas', href: '#mesas' },
  { name: 'Info', href: '/info' },
]

interface NavigationProps {
  onLogin: () => void
  onRegister: () => void
  isAuthenticated: boolean
  onProfile: () => void
  onLogout: () => void
}

export function Navigation({ onLogin, onRegister, isAuthenticated, onProfile, onLogout }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
            {isAuthenticated ? <>
              <button type="button" onClick={onProfile} className="flex items-center gap-2 rounded-full border border-primary/30 px-3 py-1.5 transition hover:bg-primary/10"><span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">JP</span><span className="text-sm font-medium">Juan Pérez</span></button>
              <Button type="button" variant="ghost" onClick={onLogout} className="text-foreground/70">Cerrar sesión</Button>
            </> : <><Button type="button" variant="ghost" onClick={onLogin} className="text-foreground/80 hover:text-foreground hover:bg-white/5">Iniciar Sesión</Button><Button type="button" onClick={onRegister} className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">Registrarse</Button></>}
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
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-background/95 backdrop-blur-xl">
              <div className="flex flex-col items-center justify-center h-full gap-8 pt-20">
                {navLinks.map((link, index) => (
                  link.href.startsWith('/') ? (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.button
                      key={link.name}
                      type="button"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => { setIsMobileMenuOpen(false); scrollToSection(link.href.slice(1)) }}
                      className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </motion.button>
                  )
                ))}
                <div className="mt-8 flex flex-col items-center gap-4">{isAuthenticated ? <><button type="button" onClick={() => { setIsMobileMenuOpen(false); onProfile() }} className="flex items-center gap-3 rounded-full border border-primary/30 px-4 py-2"><span className="flex size-9 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">JP</span>Juan Pérez</button><Button type="button" variant="outline" size="lg" onClick={() => { setIsMobileMenuOpen(false); onLogout() }} className="w-48 border-primary/50">Cerrar sesión</Button></> : <><Button type="button" variant="outline" size="lg" onClick={() => { setIsMobileMenuOpen(false); onLogin() }} className="w-48 border-primary/50 text-foreground">Iniciar Sesión</Button><Button type="button" size="lg" onClick={() => { setIsMobileMenuOpen(false); onRegister() }} className="w-48 bg-primary hover:bg-primary/90 neon-glow">Registrarse</Button></>}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}