import { Link } from 'react-router-dom'
import { ArrowLeft, CreditCard, IdCard, Ticket, Wine, ShieldCheck, Sparkles, ChevronRight, Wallet } from 'lucide-react'

const topics = [
  { icon: ShieldCheck, eyebrow: 'Antes de venir', title: 'Reglas del lugar', text: 'El ingreso depende de la edad mínima indicada para cada noche. Llevá tu DNI físico: en la puerta te lo piden para controlar el acceso. No hay devolución si no cumplís la edad requerida.', tone: 'from-primary/20 to-transparent' },
  { icon: IdCard, eyebrow: 'Tu cuenta', title: 'Cargá tu DNI', text: 'Desde Mi Perfil completá tu DNI (si te registraste con Google, no te lo pedimos ahí — hay que cargarlo a mano). Sin DNI cargado no podés comprar entradas: es con lo que te identifican en la puerta.', tone: 'from-amber-500/20 to-transparent' },
  { icon: Ticket, eyebrow: 'Entradas', title: 'Cómo comprar', text: 'Elegí el evento y el tipo de entrada, confirmá la compra y se descuenta al instante del saldo de tu tarjeta. La entrada es personal e intransferible y queda asociada a vos — no hace falta imprimir nada ni mostrar ningún QR.', tone: 'from-orange-500/20 to-transparent' },
  { icon: CreditCard, eyebrow: 'Tu cuenta', title: 'Vincular tu tarjeta', text: 'Desde Mi Perfil entrá a Tarjeta La Bastarda y cargá el código que te dieron en el club (formato LB-XXXXXX). Ahí vas a ver tu saldo, tus puntos y vas a poder pausarla o reportarla perdida si hace falta.', tone: 'from-violet-500/20 to-transparent' },
  { icon: Wallet, eyebrow: 'Tu saldo', title: 'Cargar saldo', text: 'Desde Mi Perfil → Tarjeta → Cargar saldo, elegís el monto y pagás con Mercado Pago. Apenas se aprueba el pago, el saldo se acredita solo en tu tarjeta.', tone: 'from-emerald-500/20 to-transparent' },
  { icon: Wine, eyebrow: 'La Barra', title: 'Consumiciones', text: 'Mirá la carta completa de tragos, cervezas y botellas. Pedís directamente en la barra y pagás con el saldo de tu tarjeta.', tone: 'from-rose-500/20 to-transparent' },
]

export default function TeosInfo() {
  return (
    <main className="min-h-screen overflow-hidden bg-background px-4 pb-12 pt-6 sm:px-6 sm:pb-20 sm:pt-10">
      <div className="pointer-events-none fixed left-1/2 top-0 -z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]" />
      <div className="relative z-10 mx-auto max-w-5xl">
        <Link to="/" className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 text-sm text-muted-foreground transition hover:border-primary/50 hover:text-primary"><ArrowLeft className="size-4" /> Volver al inicio</Link>
        <section className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/15 via-background/80 to-background p-6 shadow-2xl shadow-primary/5 sm:p-10">
          <div className="absolute -right-20 -top-24 size-64 rounded-full border border-primary/20 bg-primary/10 blur-2xl" />
          <div className="relative max-w-3xl"><div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary"><Sparkles className="size-4" /> La Bastarda · Guía rápida</div><h1 className="text-4xl font-black leading-[0.98] tracking-tight sm:text-6xl">Todo listo para <span className="gradient-text">la noche.</span></h1><p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Encontrá acá lo esencial para entrar, comprar y disfrutar sin vueltas.</p></div>
        </section>
        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">{topics.map(({ icon: Icon, eyebrow, title, text, tone }) => <article key={title} className={`group relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br ${tone} p-5 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-primary/40 sm:p-6`}><div className="mb-8 flex items-start justify-between"><div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-background/50 text-primary"><Icon className="size-5" /></div><ChevronRight className="size-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" /></div><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">{eyebrow}</p><h2 className="mt-2 text-xl font-bold">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></article>)}</div>
      </div>
    </main>
  )
}
