'use client'

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, CircleDollarSign, CreditCard, Delete, Home, Loader2, QrCode, RefreshCw, ShieldCheck, Sparkles, Wallet, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

const quickAmounts = [5000, 10000, 20000, 30000]
const money = (value: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)

type Step = 'amount' | 'review' | 'qr' | 'success'

export function TopupTerminal() {
  const [amount, setAmount] = useState('')
  const [step, setStep] = useState<Step>('amount')
  const [paymentId, setPaymentId] = useState('')
  const navigate = useNavigate()
  const numericAmount = Number(amount) || 0

  useEffect(() => {
    if (step !== 'success') return
    const timeout = window.setTimeout(() => navigate('/escaneartarjeta'), 1800)
    return () => window.clearTimeout(timeout)
  }, [navigate, step])
  const qrPayload = useMemo(() => `La Bastarda|CARGA|MP|${paymentId}|${numericAmount}`, [paymentId, numericAmount])

  const append = (digit: string) => setAmount((value) => (value.length >= 7 ? value : `${value}${digit}`.replace(/^0+(?=\d)/, '')))
  const removeLast = () => setAmount((value) => value.slice(0, -1))
  const reset = () => { setAmount(''); setStep('amount'); setPaymentId('') }
  const beginPayment = () => { if (numericAmount >= 1000) setStep('review') }
  const showQr = () => { setPaymentId(`La Bastarda-${Date.now().toString().slice(-6)}`); setStep('qr') }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-6xl min-w-0 px-4 py-6 sm:px-10 sm:py-8 lg:py-12">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-sm text-primary">Terminal táctil</p><h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Poné saldo en tu La Bastarda Card</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">Elegí cuánto querés cargar, pagá escaneando el QR y volvé a la pista sin hacer fila.</p></div><div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">{step === 'amount' ? '1' : step === 'review' ? '2' : step === 'success' ? '✓' : '3'}</span><span>Proceso seguro</span></div></div>

        {step === 'success' ? <Success amount={numericAmount}/> : <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-2xl sm:p-8">
            {step === 'qr' ? <QrPayment amount={numericAmount} payload={qrPayload} paymentId={paymentId} onPaid={() => setStep('success')} onCancel={() => setStep('review')}/> : step === 'review' ? <Review amount={numericAmount} onContinue={showQr} onBack={() => setStep('amount')}/> : <AmountPicker amount={amount} numericAmount={numericAmount} append={append} removeLast={removeLast} onReset={() => setAmount('')} onContinue={beginPayment}/>} 
          </div>
          <aside className="space-y-4"><div className="rounded-3xl border border-primary/20 bg-primary/5 p-6"><div className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary"><CircleDollarSign size={24}/></div><div><p className="text-xs text-muted-foreground">Saldo a cargar</p><p className="text-2xl font-semibold">{money(numericAmount)}</p></div></div><div className="mt-6 h-px bg-border/60"/><div className="mt-4 flex justify-between text-xs"><span className="text-muted-foreground">Saldo disponible después</span><span className="font-medium text-primary">{money(numericAmount)}</span></div></div><div className="rounded-3xl border border-border/70 bg-card p-6"><div className="flex items-center gap-2 text-primary"><Sparkles size={16}/><p className="text-sm font-medium">Tips para cargar</p></div><ul className="mt-4 space-y-3 text-xs leading-relaxed text-muted-foreground"><li>• Mínimo de carga: $1.000</li><li>• Escaneá el QR desde la app de Mercado Pago</li><li>• El saldo se acredita al confirmar el pago</li></ul></div></aside>
        </div>}
      </section>
    </main>
  )
}

function AmountPicker({ amount, numericAmount, append, removeLast, onReset, onContinue }: { amount: string; numericAmount: number; append: (digit: string) => void; removeLast: () => void; onReset: () => void; onContinue: () => void }) {
  return <><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-primary">Paso 1</p><h3 className="mt-2 text-xl font-semibold">Elegí el monto</h3></div><span className="rounded-full bg-muted px-3 py-1 text-[11px] text-muted-foreground">Touch friendly</span></div><div className="mt-8 rounded-2xl border border-border bg-background/60 p-5 text-center"><p className="text-xs text-muted-foreground">Monto a cargar</p><p className="mt-2 text-4xl font-semibold tracking-tight">{numericAmount ? money(numericAmount) : '$ 0'}</p></div><div className="mt-5 grid grid-cols-4 gap-2">{quickAmounts.map((value) => <button key={value} onClick={() => append(String(value))} className="rounded-xl border border-border bg-muted/40 py-3 text-xs font-medium transition hover:border-primary hover:bg-primary/10">+{money(value)}</button>)}</div><div className="mx-auto mt-5 grid max-w-sm grid-cols-3 gap-3">{['1','2','3','4','5','6','7','8','9','00','0'].map((digit) => <button key={digit} onClick={() => append(digit)} className="h-14 rounded-2xl border border-border bg-muted/30 text-lg font-medium transition active:scale-95 hover:border-primary hover:bg-primary/10">{digit}</button>)}<button onClick={removeLast} aria-label="Borrar último número" className="flex h-14 items-center justify-center rounded-2xl border border-border bg-muted/30 transition hover:border-primary hover:bg-primary/10"><Delete size={20}/></button></div><div className="mt-5 flex gap-3"><button onClick={onReset} className="flex-1 rounded-xl border border-border px-4 py-3 text-sm transition hover:bg-muted">Limpiar</button><button disabled={numericAmount < 1000} onClick={onContinue} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">Continuar<ChevronRight size={17}/></button></div></>
}

function Review({ amount, onContinue, onBack }: { amount: number; onContinue: () => void; onBack: () => void }) { return <><p className="text-xs uppercase tracking-[0.2em] text-primary">Paso 2</p><h3 className="mt-2 text-xl font-semibold">Revisá tu carga</h3><div className="mt-8 rounded-2xl border border-border bg-muted/30 p-6"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Carga La Bastarda Card</span><span>{money(amount)}</span></div><div className="my-5 h-px bg-border"/><div className="flex justify-between"><span className="font-medium">Total a pagar</span><strong className="text-2xl text-primary">{money(amount)}</strong></div></div><div className="mt-5 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-muted-foreground"><ShieldCheck className="mt-0.5 shrink-0 text-primary" size={17}/>Serás redirigido a una pantalla con un QR único de Mercado Pago para completar el pago.</div><div className="mt-8 flex gap-3"><button onClick={onBack} className="flex-1 rounded-xl border border-border px-4 py-3 text-sm hover:bg-muted">Atrás</button><button onClick={onContinue} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Mostrar QR<QrCode size={17}/></button></div></> }

function QrPayment({ amount, payload, paymentId, onPaid, onCancel }: { amount: number; payload: string; paymentId: string; onPaid: () => void; onCancel: () => void }) { return <><p className="text-xs uppercase tracking-[0.2em] text-primary">Paso 3 · Mercado Pago</p><h3 className="mt-2 text-xl font-semibold">Escaneá para pagar</h3><div className="mt-6 flex flex-col items-center rounded-2xl border border-primary/20 bg-white p-6"><QRCodeSVG value={payload} size={210} level="H" includeMargin/><p className="mt-4 text-xs font-medium text-slate-700">Pago La Bastarda · {paymentId}</p></div><div className="mt-5 flex items-center justify-between rounded-2xl bg-primary/10 px-4 py-3"><span className="text-sm text-muted-foreground">Total</span><strong className="text-xl text-primary">{money(amount)}</strong></div><p className="mt-4 text-center text-xs text-muted-foreground">Abrí Mercado Pago, tocá “Escanear” y apuntá al código.</p><div className="mt-7 flex gap-3"><button onClick={onCancel} className="flex-1 rounded-xl border border-border px-4 py-3 text-sm hover:bg-muted">Cancelar</button><button onClick={onPaid} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"><Loader2 size={16}/>Confirmar pago</button></div></> }

function Success({ amount }: { amount: number }) { return <div className="mx-auto max-w-xl rounded-3xl border border-red-500/20 bg-card p-8 text-center sm:p-12"><div className="mx-auto flex size-20 items-center justify-center rounded-full bg-red-500/15 text-red-400"><Check size={40}/></div><p className="mt-7 text-xs uppercase tracking-[0.2em] text-red-400">Carga acreditada</p><h2 className="mt-3 text-3xl font-semibold">¡Listo, ya tenés saldo!</h2><p className="mt-3 text-sm text-muted-foreground">Se acreditaron <strong className="text-foreground">{money(amount)}</strong> en tu La Bastarda Card.</p><p className="mt-8 text-xs text-muted-foreground">Volviendo al lector de tarjeta…</p></div> }

export function TopupIcon() { return <CreditCard size={18}/> }

void X
void Wallet
void Loader2
void Delete
void RefreshCw
void TopupIcon