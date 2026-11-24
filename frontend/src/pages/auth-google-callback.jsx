import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/context/auth-context'

export default function AuthGoogleCallback() {
  const [searchParams] = useSearchParams()
  const { loginConToken } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setError('No llegó ningún token de Google.')
      return
    }
    loginConToken(token)
      .then(() => navigate('/', { replace: true }))
      .catch(() => setError('No se pudo completar el inicio de sesión con Google.'))
  }, [searchParams, loginConToken, navigate])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      {error ? (
        <>
          <p className="text-destructive">{error}</p>
          <button onClick={() => navigate('/')} className="text-sm text-primary hover:underline">
            Volver al inicio
          </button>
        </>
      ) : (
        <>
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Iniciando sesión con Google…</p>
        </>
      )}
    </main>
  )
}
