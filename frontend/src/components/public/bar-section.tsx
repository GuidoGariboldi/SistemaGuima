'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Wine, Search } from 'lucide-react'
import { api } from '@/lib/api'

const money = (value: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)

type Producto = { id: string; nombre: string; categoria: string; precio: number }

export function BarSection() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    api.get<Producto[]>('/productos?limit=100').then(setProductos).catch(() => setProductos([]))
  }, [])

  const normalizedQuery = query.trim().toLowerCase()
  const filtrados = normalizedQuery
    ? productos.filter((p) => `${p.nombre} ${p.categoria}`.toLowerCase().includes(normalizedQuery))
    : productos

  const porCategoria = useMemo(() => {
    const grupos: Record<string, Producto[]> = {}
    for (const producto of filtrados) {
      grupos[producto.categoria] ??= []
      grupos[producto.categoria].push(producto)
    }
    return grupos
  }, [filtrados])

  return (
    <section id="barra" className="relative py-16 sm:py-24">
      <div className="absolute top-1/2 right-0 w-1/4 h-1/2 bg-magenta/5 blur-[150px] rounded-full" />

      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary border border-primary/30 mb-4">La Barra</span>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl mb-4">Nuestra <span className="gradient-text">carta</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Pedí en la barra y pagá con el saldo de tu tarjeta La Bastarda.</p>
        </motion.div>

        <div className="mx-auto mb-10 max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar en la barra..."
              className="glass h-12 w-full rounded-full border border-primary/20 bg-transparent pl-11 pr-4 text-sm outline-none transition focus:border-primary"
            />
          </div>
        </div>

        {productos.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Todavía no hay productos cargados en la carta.</p>
        ) : filtrados.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No encontramos productos que coincidan con tu búsqueda.</p>
        ) : (
          <div className="space-y-10">
            {Object.entries(porCategoria).map(([categoria, items]) => (
              <div key={categoria}>
                <div className="mb-3 flex items-center gap-2 px-1"><Wine className="h-4 w-4 text-primary" /><h3 className="text-lg font-bold sm:text-xl">{categoria}</h3></div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {items.map((producto) => (
                    <div key={producto.id} className="glass flex items-center justify-between gap-2 rounded-xl p-3">
                      <span className="truncate text-sm font-medium">{producto.nombre}</span>
                      <span className="shrink-0 text-sm font-bold text-primary">{money(producto.precio)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 glass rounded-3xl p-8 text-center max-w-3xl mx-auto">
          <Wine className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h4 className="text-xl font-bold mb-2">Servicio de Mesa VIP</h4>
          <p className="text-muted-foreground">Con tu entrada VIP o Premium, disfrutá de servicio de mesero exclusivo directamente en tu mesa. Sin filas, sin esperas.</p>
        </motion.div>
      </div>
    </section>
  )
}
