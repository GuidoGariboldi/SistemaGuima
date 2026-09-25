'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Mail, Lock, Eye, EyeOff, User, Calendar, ArrowRight, X, CheckCircle2 } from 'lucide-react'

interface AuthModalsProps {
  isLoginOpen: boolean
  isRegisterOpen: boolean
  onCloseLogin: () => void
  onCloseRegister: () => void
  onSwitchToRegister: () => void
  onSwitchToLogin: () => void
}

const inputClass = 'w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30'

export function AuthModals({ isLoginOpen, isRegisterOpen, onCloseLogin, onCloseRegister, onSwitchToRegister, onSwitchToLogin }: AuthModalsProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [success, setSuccess] = useState<'login' | 'register' | null>(null)

  const submitLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginError('')
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') ?? '').trim()
    const password = String(data.get('password') ?? '')
    if (!email || !password) return setLoginError('Completá tu email y contraseña.')
    setSuccess('login')
    event.currentTarget.reset()
  }

  const submitRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setRegisterError('')
    const data = new FormData(event.currentTarget)
    const password = String(data.get('password') ?? '')
    const confirm = String(data.get('confirmPassword') ?? '')
    if (!data.get('firstName') || !data.get('lastName') || !data.get('email') || !data.get('birthDate')) return setRegisterError('Completá todos los datos.')
    if (password.length < 8) return setRegisterError('La contraseña debe tener al menos 8 caracteres.')
    if (password !== confirm) return setRegisterError('Las contraseñas no coinciden.')
    if (!data.get('terms')) return setRegisterError('Aceptá los términos y condiciones para continuar.')
    setSuccess('register')
    event.currentTarget.reset()
  }

  const closeSuccess = () => { setSuccess(null); onCloseLogin(); onCloseRegister() }

  return (
    <>
      {(isLoginOpen || isRegisterOpen || success) && <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={success ? closeSuccess : isLoginOpen ? onCloseLogin : onCloseRegister} />}
      {success && <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 z-[51] flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div className="glass w-full max-w-md rounded-3xl p-8 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-primary" />
          <h2 className="gradient-text mb-2 text-3xl font-bold">{success === 'login' ? 'Sesión iniciada' : 'Cuenta creada'}</h2>
          <p className="mb-6 text-muted-foreground">{success === 'login' ? 'Ya podés disfrutar de toda la experiencia TEOS.' : 'Tu cuenta TEOS fue creada correctamente.'}</p>
          <Button onClick={closeSuccess} className="w-full bg-primary py-6">Continuar <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </motion.div>}
      {isLoginOpen && !success && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[51] flex items-center justify-center overflow-y-auto p-4" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <div className="glass relative my-auto w-full max-w-md rounded-3xl p-6 sm:p-8" onClick={(event) => event.stopPropagation()}>
          <button onClick={onCloseLogin} className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/10" aria-label="Cerrar"><X className="h-5 w-5" /></button>
          <div className="mb-8 text-center"><h2 id="login-title" className="gradient-text mb-2 text-3xl font-bold">Bienvenido</h2><p className="text-muted-foreground">Iniciá sesión en tu cuenta TEOS</p></div>
          <form className="space-y-5" onSubmit={submitLogin} noValidate>
            <label className="block space-y-2 text-sm font-medium">Email<div className="relative"><Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input required name="email" type="email" autoComplete="email" placeholder="tu@email.com" className={`${inputClass} pl-12`} /></div></label>
            <label className="block space-y-2 text-sm font-medium">Contraseña<div className="relative"><Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input required name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Mínimo 8 caracteres" className={`${inputClass} pl-12 pr-12`} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></label>
            <div className="flex items-center justify-between gap-3 text-sm"><label className="flex items-center gap-2 text-muted-foreground"><input name="remember" type="checkbox" className="h-4 w-4 accent-primary" />Recordarme</label><button type="button" className="text-primary hover:underline">Olvidé mi contraseña</button></div>
            {loginError && <p className="text-sm text-destructive" role="alert">{loginError}</p>}
            <Button type="submit" className="w-full bg-primary py-6">Iniciar sesión <ArrowRight className="ml-2 h-5 w-5" /></Button>
          </form><p className="mt-6 text-center text-sm text-muted-foreground">¿No tenés cuenta? <button onClick={onSwitchToRegister} className="font-medium text-primary hover:underline">Registrate</button></p>
        </div>
      </motion.div>}
      {isRegisterOpen && !success && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[51] flex items-center justify-center overflow-y-auto p-4" role="dialog" aria-modal="true" aria-labelledby="register-title">
        <div className="glass relative my-auto max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl p-6 sm:p-8" onClick={(event) => event.stopPropagation()}>
          <button onClick={onCloseRegister} className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/10" aria-label="Cerrar"><X className="h-5 w-5" /></button>
          <div className="mb-6 text-center"><h2 id="register-title" className="gradient-text mb-2 text-3xl font-bold">Crear cuenta</h2><p className="text-muted-foreground">Unite a la experiencia TEOS</p></div>
          <form className="space-y-4" onSubmit={submitRegister} noValidate>
            <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-2 text-sm font-medium">Nombre<input required name="firstName" placeholder="Juan" className={inputClass} /></label><label className="space-y-2 text-sm font-medium">Apellido<input required name="lastName" placeholder="Pérez" className={inputClass} /></label></div>
            <label className="block space-y-2 text-sm font-medium">Email<div className="relative"><Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input required name="email" type="email" autoComplete="email" placeholder="tu@email.com" className={`${inputClass} pl-12`} /></div></label>
            <label className="block space-y-2 text-sm font-medium">Fecha de nacimiento<div className="relative"><Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input required name="birthDate" type="date" className={`${inputClass} pl-12`} /></div></label>
            <label className="block space-y-2 text-sm font-medium">Contraseña<div className="relative"><Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input required name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Mínimo 8 caracteres" className={`${inputClass} pl-12 pr-12`} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Mostrar u ocultar contraseña">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></label>
            <label className="block space-y-2 text-sm font-medium">Confirmar contraseña<div className="relative"><Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input required name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Repetí tu contraseña" className={`${inputClass} pl-12 pr-12`} /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Mostrar u ocultar confirmación">{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></label>
            <label className="flex items-start gap-2 text-sm text-muted-foreground"><input required name="terms" type="checkbox" className="mt-1 h-4 w-4 accent-primary" /><span>Acepto los <button type="button" className="text-primary hover:underline">términos y condiciones</button> y la política de privacidad.</span></label>
            {registerError && <p className="text-sm text-destructive" role="alert">{registerError}</p>}
            <Button type="submit" className="w-full bg-primary py-6">Crear cuenta <ArrowRight className="ml-2 h-5 w-5" /></Button>
          </form><p className="mt-6 text-center text-sm text-muted-foreground">¿Ya tenés cuenta? <button onClick={onSwitchToLogin} className="font-medium text-primary hover:underline">Iniciá sesión</button></p>
        </div>
      </motion.div>}
    </>
  )
}