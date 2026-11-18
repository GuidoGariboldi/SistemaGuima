// Decodifica el payload de un JWT en el cliente, sin verificar la firma
// (la verificación real la hace siempre el backend). Sirve solo para
// mostrar/ocultar cosas en la UI, nunca para decisiones de seguridad.
export function decodeJwt(token: string): Record<string, any> | null {
  try {
    const [, payload] = token.split('.')
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}
