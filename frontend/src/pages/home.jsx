import { useState } from 'react'
import { Navigation } from '@/components/layout/navigation'
import { HeroSection } from '@/components/public/hero-section'
import { EventsSection } from '@/components/public/events-section'
import { TicketsSection } from '@/components/public/tickets-section'
import { BarSection } from '@/components/public/bar-section'
import { TableReservationsSection } from '@/components/public/table-reservations-section'
import { Footer } from '@/components/layout/footer'
import { AuthModals } from '@/components/public/auth-modals'
import { UserProfile } from '@/components/public/user-profile'

export default function TeosHome() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleSwitchToRegister = () => {
    setIsLoginOpen(false)
    setIsRegisterOpen(true)
  }

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false)
    setIsLoginOpen(true)
  }

  return (
    <main className="min-h-screen">
      <Navigation
        onLogin={() => setIsLoginOpen(true)}
        onRegister={() => setIsRegisterOpen(true)}
        isAuthenticated={isAuthenticated}
        onProfile={() => setIsProfileOpen(true)}
        onLogout={() => setIsAuthenticated(false)}
      />

      <HeroSection />
      <EventsSection />
      <TicketsSection />
      <BarSection />
      <TableReservationsSection />
      <Footer />

      <AuthModals
        isLoginOpen={isLoginOpen}
        isRegisterOpen={isRegisterOpen}
        onCloseLogin={() => setIsLoginOpen(false)}
        onCloseRegister={() => setIsRegisterOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
        onSwitchToLogin={handleSwitchToLogin}
        onAuthenticated={() => setIsAuthenticated(true)}
      />

      <UserProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </main>
  )
}