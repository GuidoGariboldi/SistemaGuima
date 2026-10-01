'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, Music, Filter } from 'lucide-react'

const events = [
  {
    id: 1,
    name: 'Neon Dreams',
    dj: 'DJ AURORA',
    date: '15 Dic 2024',
    time: '23:00',
    price: '$8.000',
    category: 'La Bastarda',
    age: '+23',
    image: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=600&q=80',
    featured: true,
  },
  {
    id: 2,
    name: 'Electric Pulse',
    dj: 'MARTIN WAVE',
    date: '22 Dic 2024',
    time: '00:00',
    price: '$6.000',
    category: 'Guanaco',
    age: '+18',
    image: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=600&q=80',
    featured: false,
  },
  {
    id: 3,
    name: 'Midnight Rave',
    dj: 'SOPHIA DARK',
    date: '31 Dic 2024',
    time: '23:30',
    price: '$15.000',
    category: 'La Bastarda',
    age: '+23',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    featured: true,
  },
  {
    id: 4,
    name: 'Bass Nation',
    dj: 'DJ THUNDER',
    date: '05 Ene 2025',
    time: '00:00',
    price: '$7.000',
    category: 'Guanaco',
    age: '+18',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    featured: false,
  },
  {
    id: 5,
    name: 'Underground',
    dj: 'TECHNO MASTER',
    date: '12 Ene 2025',
    time: '01:00',
    price: '$9.000',
    category: 'La Bastarda',
    age: '+23',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
    featured: false,
  },
  {
    id: 6,
    name: 'Euphoria',
    dj: 'LUNA BEATS',
    date: '19 Ene 2025',
    time: '23:00',
    price: '$8.500',
    category: 'Guanaco',
    age: '+18',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    featured: true,
  },
]

const categories = ['Todos', 'La Bastarda', 'Guanaco']

export function EventsSection() {
  const [activeCategory, setActiveCategory] = useState('Todos')

  const filteredEvents = activeCategory === 'Todos' 
    ? events 
    : events.filter(e => e.category === activeCategory)

  return (
    <section id="eventos" className="py-16 sm:py-24 relative">
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/5 blur-[150px] rounded-full" />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center sm:mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary border border-primary/30 mb-4">
            Próximos Eventos
          </span>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl mb-4">
            <span className="gradient-text">Eventos</span> que no te podés perder
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubrí nuestra agenda de eventos con los mejores DJs nacionales e internacionales.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:mb-12 sm:gap-3"
        >
          <Filter className="h-5 w-5 text-muted-foreground mr-2" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-all sm:px-4 sm:text-sm ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground neon-glow'
                  : 'glass text-foreground/80 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative glass rounded-2xl overflow-hidden card-3d"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                {event.featured && (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-primary text-xs font-bold rounded-full">
                    DESTACADO
                  </span>
                )}
                <span className="absolute top-4 left-4 px-3 py-1 glass text-xs font-medium rounded-full">
                  {event.category} · {event.age}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 text-center sm:p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {event.name}
                </h3>
                <div className="flex items-center gap-2 text-primary mb-4">
                  <Music className="h-4 w-4" />
                  <span className="text-sm font-medium">{event.dj}</span>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {event.time}
                  </div>
                </div>

                <div className="mt-2 text-sm font-medium text-primary">Entrada General disponible</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10">
            Ver todos los eventos
          </Button>
        </motion.div>
      </div>
    </section>
  )
}