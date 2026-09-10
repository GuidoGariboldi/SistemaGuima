'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Menu, X, User, Ticket, Calendar, Wine, Bus, Gift, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { name: 'Inicio', href: '#inicio' },
  { name: 'Eventos', href: '#eventos' },
  { name: 'Entradas', href: '#entradas' },
  { name: 'Barra', href: '#barra' },
  { name: 'Traslado', href: '#traslado' },
  { name: 'Beneficios', href: '#beneficios' },
]

interface NavigationProps {
  onLogin: () => void
  onRegister: () => void
}

export function Navigation({ onLogin, onRegister }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <span className="text-3xl font-bold tracking-wider gradient-text">
                TEOS
              </span>
              <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full -z-10" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                whileHover={{ scale: 1.05 }}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button type="button" variant="ghost" onClick={onLogin} className="text-foreground/80 hover:text-foreground hover:bg-white/5">
              Iniciar Sesión
            </Button>
            <Button type="button" onClick={onRegister} className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
              Registrarse
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground"
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
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </motion.a>
                ))}
                <div className="flex flex-col gap-4 mt-8">
                  <Button type="button" variant="outline" size="lg" onClick={() => { setIsMobileMenuOpen(false); onLogin() }} className="w-48 border-primary/50 text-foreground">
                    Iniciar Sesión
                  </Button>
                  <Button type="button" size="lg" onClick={() => { setIsMobileMenuOpen(false); onRegister() }} className="w-48 bg-primary hover:bg-primary/90 neon-glow">
                    Registrarse
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}