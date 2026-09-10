
import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { EventsSection } from '@/components/events-section'
import { TicketsSection } from '@/components/tickets-section'
import { BarSection } from '@/components/bar-section'
import { TransportSection } from '@/components/transport-section'
import { BenefitsSection } from '@/components/benefits-section'
import { Footer } from '@/components/footer'
import { AuthModals } from '@/components/auth-modals'
import { UserProfile } from '@/components/user-profile'

export default function TeosHome() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleSwitchToRegister = () => { setIsLoginOpen(false); setIsRegisterOpen(true) }
  const handleSwitchToLogin = () => { setIsRegisterOpen(false); setIsLoginOpen(true) }

  return (
    <main className="min-h-screen">
      <Navigation onLogin={() => setIsLoginOpen(true)} onRegister={() => setIsRegisterOpen(true)} />
      <HeroSection />
      <EventsSection />
      <TicketsSection />
      <BarSection />
      <TransportSection />
      <BenefitsSection />
      <Footer />
      <AuthModals
        isLoginOpen={isLoginOpen}
        isRegisterOpen={isRegisterOpen}
        onCloseLogin={() => setIsLoginOpen(false)}
        onCloseRegister={() => setIsRegisterOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />
      <UserProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </main>
  )
}