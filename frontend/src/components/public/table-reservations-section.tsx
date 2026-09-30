'use client'

import { MessageCircle, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = ['Elegí el tipo de mesa y la cantidad de personas.', 'Completá tus datos de contacto y el horario preferido.', 'Te confirmamos disponibilidad por WhatsApp.', 'Recibís la confirmación y abonás según las indicaciones del equipo.']

export function TableReservationsSection() {
  const whatsappNumber = '5491100000000' // Demo: reemplazar por el número real configurable desde /admin.
  const whatsappMessage = encodeURIComponent('Hola, quiero reservar una mesa en La Bastarda. ¿Me pasan disponibilidad?')

  return <section id="mesas" className="relative py-16 sm:py-24"><div className="container mx-auto px-4"><div className="mx-auto max-w-3xl text-center"><span className="mb-4 inline-block rounded-full border border-primary/30 px-4 py-2 text-sm font-medium text-primary">Reservas</span><h2 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">Tu mesa, <span className="gradient-text">tu noche</span></h2><p className="text-muted-foreground">Reservá con anticipación y asegurá tu lugar en la pista.</p></div><div className="mx-auto mt-8 grid max-w-5xl gap-5 sm:mt-12 sm:gap-8 lg:grid-cols-[1fr_0.8fr]"><div className="glass rounded-3xl p-6 md:p-8"><h3 className="text-xl font-bold">Cómo reservar</h3><div className="mt-6 space-y-5">{steps.map((step, index) => <motion.div key={step} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="flex gap-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</span><p className="pt-1 text-sm text-foreground/80">{step}</p></motion.div>)}</div></div><div className="glass rounded-3xl p-6 md:p-8"><div className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary"><MessageCircle /></div><h3 className="mt-5 text-xl font-bold">Hablá con reservas</h3><p className="mt-2 text-sm text-muted-foreground">El equipo te responde por WhatsApp y coordina todos los detalles.</p><a href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground neon-glow transition hover:bg-primary/90"><MessageCircle size={17} /> Consultar por WhatsApp</a><p className="mt-3 text-center text-[11px] text-muted-foreground">Número demo configurable desde /admin</p></div></div></div></section>
}

// Producción: guardar la reserva, validar disponibilidad y enviar los datos al contacto real desde un backend seguro.
// Producción: el WhatsApp debe administrarse desde /admin y no quedar hardcodeado en el cliente.