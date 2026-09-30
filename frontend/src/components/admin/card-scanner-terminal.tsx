'use client'

import { useEffect, useState } from 'react'
import { Check, CreditCard, LockKeyhole, Mail, Radio, ScanLine, ShieldCheck, Sparkles, UserRound } from 'lucide-react'

type ScanState = 'waiting' | 'reading' | 'success'
type AccountState = 'idle' | 'login' | 'confirm' | 'linked'

export function CardScannerTerminal() {
  const [status, setStatus] = useState<ScanState>('waiting')
  const [accountState, setAccountState] = useState<AccountState>('idle')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (status !== 'reading') return
    const timer = window.setTimeout(() => setStatus('success'), 1800)
    return () => window.clearTimeout(timer)
  }, [status])

  const startScan = () => setStatus('reading')
  const reset = () => setStatus('waiting')

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl min-w-0 flex-col items-center justify-center overflow-x-hidden px-4 py-8 sm:px-10 sm:py-10">
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

        {status === 'success' ? <SuccessState onContinue={() => window.location.assign('/carga')} onReset={reset} accountState={accountState} setAccountState={setAccountState} email={email} setEmail={setEmail} password={password} setPassword={setPassword} /> : <>
          <div className={`scanner-device relative flex size-56 items-center justify-center rounded-[2.5rem] border bg-card shadow-2xl transition-all duration-500 sm:size-72 ${status === 'reading' ? 'border-primary neon-glow' : 'border-border/80'}`}>
            <div className={`absolute inset-5 rounded-[1.8rem] border border-dashed transition-colors ${status === 'reading' ? 'border-primary' : 'border-primary/40'}`} />
            <div className="relative flex size-32 items-center justify-center rounded-3xl bg-background shadow-inner sm:size-40">
              <CreditCard className={`transition-all duration-500 ${status === 'reading' ? 'scale-110 text-primary' : 'text-primary/80'}`} size={68} strokeWidth={1.25} />
              {status === 'reading' && <div className="absolute inset-x-3 top-1/2 h-0.5 animate-pulse bg-primary shadow-[0_0_18px_var(--primary)]" />}
            </div>
            <div className="absolute -right-4 top-10 flex size-10 items-center justify-center rounded-xl border border-primary/30 bg-card text-primary shadow-xl"><Radio size={18} className={status === 'reading' ? 'animate-pulse' : ''} /></div>
            <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"><ScanLine size={14} className="text-primary" /> NFC / RFID</div>
          </div>

          <div className="relative z-10 mt-12 max-w-xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{status === 'reading' ? 'Leyendo tarjeta' : 'Paso 1 de 2'}</p>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{status === 'reading' ? 'No retires tu tarjeta' : 'Acercá tu La Bastarda Card'}</h1>
            <p className="mx-auto mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">{status === 'reading' ? 'Estamos verificando tu tarjeta de forma segura. Esto puede tardar unos segundos.' : 'Apoyala sobre el lector y mantenela quieta hasta que la terminal la reconozca.'}</p>
          </div>

          <button onClick={startScan} disabled={status === 'reading'} className="relative z-10 mt-8 flex min-h-16 min-w-64 items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:scale-[1.02] hover:opacity-95 active:scale-95 disabled:cursor-wait disabled:opacity-70">
            {status === 'reading' ? <><span className="size-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" /> Escaneando...</> : <><ScanLine size={21} /> Tocar para escanear</>}
          </button>

          <div className="relative z-10 mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2"><ShieldCheck size={15} className="text-primary" /> Datos protegidos</span>
            <span className="flex items-center gap-2"><LockKeyhole size={15} className="text-primary" /> Sin contacto</span>
          </div>
        </>}
      </section>
    </main>
  )
}

function SuccessState({ onContinue, onReset, accountState, setAccountState, email, setEmail, password, setPassword }: { onContinue: () => void; onReset: () => void; accountState: AccountState; setAccountState: (state: AccountState) => void; email: string; setEmail: (value: string) => void; password: string; setPassword: (value: string) => void }) {
  const cardData = {
    holder: 'MARTÍN GÓMEZ',
    number: 'La Bastarda •••• 4821',
    level: 'Gold Member',
    balance: '$ 24.850',
    points: '1.240 puntos',
  }

  return <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
    <div className="flex size-20 items-center justify-center rounded-full border border-red-400/30 bg-red-400/10 text-red-400 shadow-[0_0_45px_rgba(52,211,153,0.2)]"><Check size={40} /></div>
    <p className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-400"><Sparkles size={15} /> Tarjeta reconocida</p>
    <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Tarjeta lista</h1>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">Podés continuar para cargar saldo.</p>

    <aside className="mt-8 w-full max-w-md rounded-[2rem] border border-primary/30 bg-card/95 p-4 text-left shadow-2xl shadow-primary/15">
      <div className="mb-3 flex items-center justify-between border-b border-border/60 pb-3">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Datos de tu tarjeta</p><p className="mt-1 text-xs text-muted-foreground">Información verificada</p></div>
        <span className="flex items-center gap-1.5 rounded-full bg-red-400/10 px-2.5 py-1 text-[10px] font-semibold text-red-400"><span className="size-1.5 rounded-full bg-red-400" /> Activa</span>
      </div>
      <div className="relative mb-4 min-h-40 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/80 via-primary/35 to-background p-4 text-primary-foreground shadow-lg">
        <div className="absolute -right-10 -top-16 size-32 rounded-full border border-primary-foreground/20" />
        <div className="relative flex h-full min-h-32 flex-col justify-between">
          <div className="flex items-start justify-between"><span className="text-xs font-bold tracking-[0.25em]">La Bastarda</span><CreditCard size={19} className="opacity-80" /></div>
          <div><p className="text-sm font-semibold tracking-[0.16em]">{cardData.number}</p><div className="mt-3 flex items-end justify-between gap-2"><div><p className="text-[8px] uppercase tracking-[0.2em] opacity-70">Titular</p><p className="mt-1 text-[10px] font-medium tracking-wider">{cardData.holder}</p></div><p className="text-[10px] font-semibold uppercase">{cardData.level}</p></div></div>
        </div>
      </div>
      <div className="flex flex-col gap-3"><DataRow label="Saldo disponible" value={cardData.balance} accent /><DataRow label="Nivel" value={cardData.level} /><DataRow label="Puntos La Bastarda" value={cardData.points} /></div>
    </aside>

    {accountState === 'idle' && <div className="mt-5 flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <button onClick={onContinue} className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.98]"><CreditCard size={18} /> Continuar a cargar saldo</button>
      <button onClick={onReset} className="min-h-14 flex-1 rounded-2xl border border-border px-6 py-4 text-sm text-muted-foreground transition hover:border-primary hover:text-foreground active:scale-[0.98]">Escanear otra</button>
    </div>}

    {accountState === 'idle' && <button onClick={() => setAccountState('login')} className="mt-3 flex min-h-14 w-full max-w-md items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 px-6 py-4 text-sm font-semibold text-primary transition hover:bg-primary/15 active:scale-[0.98]"><UserRound size={18} /> Vincular Cuenta</button>}

    {accountState === 'login' && <div className="mt-5 w-full max-w-md rounded-[2rem] border border-border bg-card/95 p-5 text-left shadow-2xl">
      <div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Vincular cuenta</p><h2 className="mt-2 text-xl font-semibold">Iniciá sesión para continuar</h2><p className="mt-1 text-sm text-muted-foreground">Usá la cuenta asociada a tu La Bastarda Card.</p></div>
      <label className="block text-xs font-medium text-muted-foreground">Correo electrónico</label>
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-background px-3"><Mail size={16} className="text-primary" /><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="tu@email.com" className="min-h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60" /></div>
      <label className="mt-4 block text-xs font-medium text-muted-foreground">Contraseña</label>
      <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="••••••••" className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary" />
      <div className="mt-5 flex gap-3"><button onClick={() => setAccountState('idle')} className="min-h-12 flex-1 rounded-xl border border-border px-4 text-sm text-muted-foreground hover:text-foreground">Cancelar</button><button disabled={!email || password.length < 4} onClick={() => setAccountState('confirm')} className="min-h-12 flex-1 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">Iniciar sesión</button></div>
    </div>}

    {accountState === 'confirm' && <div className="mt-5 w-full max-w-md rounded-[2rem] border border-primary/30 bg-card/95 p-6 shadow-2xl shadow-primary/10"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Cuenta encontrada</p><h2 className="mt-2 text-2xl font-semibold">¿Sos vos esta persona?</h2><div className="mt-5 flex items-center gap-4 rounded-2xl border border-border bg-background/70 p-4 text-left"><div className="size-16 overflow-hidden rounded-full border-2 border-primary/40 bg-primary/20"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80" alt="Foto de perfil de Martín Gómez" className="size-full object-cover" /></div><div><p className="font-semibold">Martín Gómez</p><p className="mt-1 text-sm text-muted-foreground">{email}</p></div></div><div className="mt-5 flex gap-3"><button onClick={() => setAccountState('login')} className="min-h-12 flex-1 rounded-xl border border-border px-4 text-sm text-muted-foreground hover:text-foreground">No soy yo</button><button onClick={() => setAccountState('linked')} className="min-h-12 flex-1 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">Sí, soy yo</button></div></div>}

    {accountState === 'linked' && <div className="mt-5 w-full max-w-md rounded-[2rem] border border-red-400/30 bg-red-400/10 p-5 text-center"><Check className="mx-auto text-red-400" size={28} /><p className="mt-2 font-semibold text-red-300">Cuenta vinculada correctamente</p><p className="mt-1 text-sm text-muted-foreground">Ya podés continuar con tu carga de saldo.</p><button onClick={onContinue} className="mt-4 min-h-12 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">Continuar a cargar saldo</button></div>}
  </div>
}

function DataRow({ label, value, accent, status }: { label: string; value: string; accent?: boolean; status?: boolean }) {
  return <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className={`text-right text-sm font-semibold ${accent ? 'text-lg text-primary' : status ? 'text-red-400' : 'text-foreground'}`}>{value}</span>
  </div>
}