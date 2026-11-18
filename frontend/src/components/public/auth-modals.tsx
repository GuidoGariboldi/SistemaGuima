'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Mail, Lock, Eye, EyeOff, User, Calendar, ArrowRight, X, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { ApiError } from '@/lib/api'

interface AuthModalsProps {
  isLoginOpen: boolean
  isRegisterOpen: boolean
  onCloseLogin: () => void
  onCloseRegister: () => void
  onSwitchToRegister: () => void
  onSwitchToLogin: () => void
  onAuthenticated: () => void
}

// Demo visual: en producción este botón usaría OAuth de Google y una sesión persistente.
const inputClass = 'w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30'

export function AuthModals({ isLoginOpen, isRegisterOpen, onCloseLogin, onCloseRegister, onSwitchToRegister, onSwitchToLogin, onAuthenticated }: AuthModalsProps) {
  const { login, register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [success, setSuccess] = useState<'login' | 'register' | null>(null)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)

    useEffect(() => {
    const isAnyOpen = isLoginOpen || isRegisterOpen || !!success
    if (!isAnyOpen) return

    const scrollY = window.scrollY
    const body = document.body
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.overflow = 'hidden'

    return () => {
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [isLoginOpen, isRegisterOpen, success])

  const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginError('')
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') ?? '').trim()
    const password = String(data.get('password') ?? '')
    if (!email || !password) return setLoginError('Completá tu email y contraseña.')
    try {
      await login(email, password)
      setSuccess('login')
      onAuthenticated()
      event.currentTarget.reset()
    } catch (error) {
      setLoginError(error instanceof ApiError ? error.message : 'No se pudo iniciar sesión.')
    }
  }

  const submitRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setRegisterError('')
    const data = new FormData(event.currentTarget)
    const password = String(data.get('password') ?? '')
    const confirm = String(data.get('confirmPassword') ?? '')
    const firstName = String(data.get('firstName') ?? '').trim()
    const lastName = String(data.get('lastName') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const birthDate = String(data.get('birthDate') ?? '')
    if (!firstName || !lastName || !email || !birthDate) return setRegisterError('Completá todos los datos.')
    if (password.length < 8) return setRegisterError('La contraseña debe tener al menos 8 caracteres.')
    if (password !== confirm) return setRegisterError('Las contraseñas no coinciden.')
    if (!data.get('terms')) return setRegisterError('Aceptá los términos y condiciones para continuar.')
    try {
      await register({ nombre: firstName, apellido: lastName, email, password, fechaNac: birthDate })
      setSuccess('register')
      onAuthenticated()
      event.currentTarget.reset()
    } catch (error) {
      setRegisterError(error instanceof ApiError ? error.message : 'No se pudo crear la cuenta.')
    }
  }

  const closeSuccess = () => { setSuccess(null); onCloseLogin(); onCloseRegister() }

  const submitForgot = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    if (!String(data.get('email') ?? '').trim()) return
    setForgotSent(true)
  }

  const handleCloseLogin = () => {
    setForgotOpen(false)
    setForgotSent(false)
    onCloseLogin()
  }

  return (
    <>
      {(isLoginOpen || isRegisterOpen || success) && <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={success ? closeSuccess : isLoginOpen ? onCloseLogin : onCloseRegister} />}
      {success && <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 z-[51] flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div className="glass w-full max-w-md rounded-3xl p-8 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-primary" />
          <h2 className="gradient-text mb-2 text-3xl font-bold">{success === 'login' ? 'Sesión iniciada' : 'Cuenta creada'}</h2>
          <p className="mb-6 text-muted-foreground">{success === 'login' ? 'Ya podés disfrutar de toda la experiencia La Bastarda.' : 'Tu cuenta La Bastarda fue creada correctamente.'}</p>
          <Button onClick={closeSuccess} className="w-full bg-primary py-6">Continuar <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </motion.div>}
      {isLoginOpen && !success && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[51] flex items-center justify-center overflow-y-auto overflow-x-hidden p-4" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <div className="glass relative my-auto w-full max-w-md overflow-x-hidden rounded-3xl p-6 sm:p-8" onClick={(event) => event.stopPropagation()}>
          <button onClick={handleCloseLogin} className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/10" aria-label="Cerrar"><X className="h-5 w-5" /></button>
          {forgotOpen ? (
            forgotSent ? (
              <div className="py-4 text-center">
                <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-primary" />
                <h2 className="gradient-text mb-2 text-3xl font-bold">Revisá tu email</h2>
                <p className="mb-6 text-muted-foreground">Si existe una cuenta con ese email, te enviamos un enlace para restablecer tu contraseña.</p>
                <Button onClick={() => { setForgotOpen(false); setForgotSent(false) }} className="w-full bg-primary py-6">Volver a iniciar sesión</Button>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center"><h2 className="gradient-text mb-2 text-3xl font-bold">Recuperar contraseña</h2><p className="text-muted-foreground">Ingresá tu email y te mandamos un enlace para restablecerla.</p></div>
                <form className="space-y-5" onSubmit={submitForgot} noValidate>
                  <label className="block space-y-2 text-sm font-medium">Email<div className="relative"><Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input required name="email" type="email" autoComplete="email" placeholder="tu@email.com" className={`${inputClass} pl-12`} /></div></label>
                  <Button type="submit" className="w-full bg-primary py-6">Enviar enlace <ArrowRight className="ml-2 h-5 w-5" /></Button>
                  <button type="button" onClick={() => setForgotOpen(false)} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">Volver a iniciar sesión</button>
                </form>
              </>
            )
          ) : (
            <>
              <div className="mb-8 text-center"><h2 id="login-title" className="gradient-text mb-2 text-3xl font-bold">Bienvenido</h2><p className="text-muted-foreground">Iniciá sesión en tu cuenta La Bastarda</p></div>
              <button type="button" onClick={() => { setSuccess('login'); onAuthenticated() }} className="mb-5 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white px-4 py-3 font-medium text-slate-900 transition hover:bg-slate-100"><span className="font-bold text-red-500">G</span> Continuar con Google</button><div className="mb-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />o con email<span className="h-px flex-1 bg-border" /></div>
              <form className="space-y-5" onSubmit={submitLogin} noValidate>
                <label className="block space-y-2 text-sm font-medium">Email<div className="relative"><Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input required name="email" type="email" autoComplete="email" placeholder="tu@email.com" className={`${inputClass} pl-12`} /></div></label>
                <label className="block space-y-2 text-sm font-medium">Contraseña<div className="relative"><Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input required name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Mínimo 8 caracteres" className={`${inputClass} pl-12 pr-12`} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></label>
                <div className="flex items-center justify-between gap-3 text-sm"><label className="flex items-center gap-2 text-muted-foreground"><input name="remember" type="checkbox" className="h-4 w-4 accent-primary" />Recordarme</label><button type="button" onClick={() => setForgotOpen(true)} className="text-primary hover:underline">Olvidé mi contraseña</button></div>
                {loginError && <p className="text-sm text-destructive" role="alert">{loginError}</p>}
                <Button type="submit" className="w-full bg-primary py-6">Iniciar sesión <ArrowRight className="ml-2 h-5 w-5" /></Button>
              </form><p className="mt-6 text-center text-sm text-muted-foreground">¿No tenés cuenta? <button onClick={onSwitchToRegister} className="font-medium text-primary hover:underline">Registrate</button></p>
            </>
          )}
        </div>
      </motion.div>}
      {isRegisterOpen && !success && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[51] flex items-center justify-center overflow-y-auto overflow-x-hidden p-4" role="dialog" aria-modal="true" aria-labelledby="register-title">
        <div className="glass relative my-auto max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto overflow-x-hidden rounded-3xl p-6 sm:p-8" onClick={(event) => event.stopPropagation()}>
          <button onClick={onCloseRegister} className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/10" aria-label="Cerrar"><X className="h-5 w-5" /></button>
          <div className="mb-6 text-center"><h2 id="register-title" className="gradient-text mb-2 text-3xl font-bold">Crear cuenta</h2><p className="text-muted-foreground">Unite a la experiencia La Bastarda</p></div>
          <button type="button" onClick={() => { setSuccess('register'); onAuthenticated() }} className="mb-5 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white px-4 py-3 font-medium text-slate-900 transition hover:bg-slate-100"><span className="font-bold text-red-500">G</span> Registrarte con Google</button><div className="mb-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />o con email<span className="h-px flex-1 bg-border" /></div>
          <form className="space-y-4" onSubmit={submitRegister} noValidate>
            <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-2 text-sm font-medium">Nombre<input required name="firstName" placeholder="Juan" className={inputClass} /></label><label className="space-y-2 text-sm font-medium">Apellido<input required name="lastName" placeholder="Pérez" className={inputClass} /></label></div>
            <label className="block space-y-2 text-sm font-medium">Email<div className="relative"><Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input required name="email" type="email" autoComplete="email" placeholder="tu@email.com" className={`${inputClass} pl-12`} /></div></label>
            <label className="block space-y-2 text-sm font-medium">Fecha de nacimiento<div className="relative"><Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input required name="birthDate" type="date" className={`${inputClass} pl-12`} /></div></label>
            <label className="block space-y-2 text-sm font-medium">Contraseña<div className="relative"><Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input required name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Mínimo 8 caracteres" className={`${inputClass} pl-12 pr-12`} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Mostrar u ocultar contraseña">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></label>
            <label className="block space-y-2 text-sm font-medium">Confirmar contraseña<div className="relative"><Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input required name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Repetí tu contraseña" className={`${inputClass} pl-12 pr-12`} /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Mostrar u ocultar confirmación">{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></label>
            <label className="flex items-start gap-2 text-sm text-muted-foreground"><input required name="terms" type="checkbox" className="mt-1 h-4 w-4 accent-primary" /><span>Acepto los <button type="button" onClick={() => setTermsOpen(true)} className="text-primary hover:underline">términos y condiciones</button> y la política de privacidad.</span></label>
            {registerError && <p className="text-sm text-destructive" role="alert">{registerError}</p>}
            <Button type="submit" className="w-full bg-primary py-6">Crear cuenta <ArrowRight className="ml-2 h-5 w-5" /></Button>
          </form><p className="mt-6 text-center text-sm text-muted-foreground">¿Ya tenés cuenta? <button onClick={onSwitchToLogin} className="font-medium text-primary hover:underline">Iniciá sesión</button></p>
        </div>
      </motion.div>}
      {termsOpen && <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-background/80 p-4 backdrop-blur-sm" onClick={() => setTermsOpen(false)} role="dialog" aria-modal="true" aria-labelledby="terms-title">
        <div className="glass relative my-auto max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto overflow-x-hidden rounded-3xl p-6 sm:p-8" onClick={(event) => event.stopPropagation()}>
          <button onClick={() => setTermsOpen(false)} className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/10" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
          <h2 id="terms-title" className="gradient-text mb-4 text-2xl font-bold">Términos y condiciones</h2>
          <div className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>Al crear una cuenta en La Bastarda aceptás que la información que cargues (nombre, email, fecha de nacimiento) se use para gestionar tu entrada, tu tarjeta de saldo y tus compras dentro del club.</p>
            <p>La entrada y el consumo de alcohol están sujetos a la edad mínima de cada evento. No se realizan devoluciones por incumplimiento de la edad requerida.</p>
            <p>El saldo cargado en tu tarjeta es personal e intransferible. La Bastarda no se responsabiliza por el uso de la tarjeta en caso de pérdida o robo no reportado.</p>
            <p>Podés solicitar la baja de tu cuenta y la eliminación de tus datos en cualquier momento contactando al staff del club.</p>
            <p className="text-xs text-muted-foreground/70">Este es un texto de ejemplo para el proyecto — reemplazalo por los términos y condiciones reales del boliche antes de publicar el sitio.</p>
          </div>
          <Button onClick={() => setTermsOpen(false)} className="mt-6 w-full bg-primary py-6">Entendido</Button>
        </div>
      </div>}
    </>
  )
}