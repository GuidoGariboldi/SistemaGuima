'use client'

import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Wine, Beer, Coffee, Sparkles, Gift, Search, ShoppingCart, Minus, Plus, Trash2, CreditCard, Smartphone, ChevronDown, ChevronUp, ArrowUp } from 'lucide-react'
import { sileo } from 'sileo'

const categoryIcons: Record<string, typeof Wine> = {
  'Tragos': Wine,
  'Cervezas': Beer,
  'Sin Alcohol': Coffee,
  'Botellas Premium': Sparkles,
  'Combos': Gift,
}

const drinks = {
  'Tragos': [
    { name: 'Mojito La Bastarda', price: '$4.500', description: 'Ron, menta fresca, lima, azúcar', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80' },
    { name: 'Neon Margarita', price: '$5.000', description: 'Tequila, triple sec, lima, sal negra', image: 'https://images.unsplash.com/photo-1556855810-ac404aa91e85?w=400&q=80' },
    { name: 'Electric Daiquiri', price: '$4.800', description: 'Ron blanco, frutilla, lima', image: 'https://images.unsplash.com/photo-1587223962930-cb7f31384c19?w=400&q=80' },
    { name: 'Midnight Gin Tonic', price: '$5.500', description: 'Gin premium, tónica, pepino', image: 'https://images.unsplash.com/photo-1551751299-1b51cab2694c?w=400&q=80' },
    { name: 'Purple Rain', price: '$6.000', description: 'Vodka, blue curaçao, granada', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80' },
    { name: 'Dark & Stormy', price: '$5.200', description: 'Ron oscuro, ginger beer, lima', image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&q=80' },
  ],
  'Cervezas': [
    { name: 'Corona', price: '$2.500', description: 'Cerveza mexicana premium', image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80' },
    { name: 'Heineken', price: '$2.800', description: 'Cerveza holandesa lager', image: 'https://images.unsplash.com/photo-1618885472179-5e474019f2a9?w=400&q=80' },
    { name: 'Stella Artois', price: '$3.000', description: 'Cerveza belga premium', image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&q=80' },
    { name: 'IPA Artesanal', price: '$3.500', description: 'Cerveza artesanal local', image: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=400&q=80' },
  ],
  'Sin Alcohol': [
    { name: 'Virgin Mojito', price: '$2.500', description: 'Menta, lima, soda, azúcar', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80' },
    { name: 'Sunset Punch', price: '$2.800', description: 'Jugo de naranja, granadina, soda', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80' },
    { name: 'Energy Mix', price: '$3.000', description: 'Red Bull, jugo de arándanos', image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=400&q=80' },
  ],
  'Botellas Premium': [
    { name: 'Grey Goose', price: '$85.000', description: 'Vodka francés premium 750ml', image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&q=80' },
    { name: 'Moët & Chandon', price: '$120.000', description: 'Champagne francés 750ml', image: 'https://images.unsplash.com/photo-1594372365401-3b5ff14eaaed?w=400&q=80' },
    { name: 'Johnnie Walker Black', price: '$75.000', description: 'Whisky escocés 750ml', image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&q=80' },
    { name: 'Don Julio 1942', price: '$150.000', description: 'Tequila añejo premium 750ml', image: 'https://images.unsplash.com/photo-1514218953589-2d7d37efd2dc?w=400&q=80' },
  ],
  'Combos': [
    { name: 'Combo Previa x4', price: '$10.000', description: '4 cervezas a elección para arrancar la noche', image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80' },
    { name: 'Combo Fernet Grupal', price: '$16.000', description: 'Botella de Fernet + 4 Coca-Colas', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80' },
    { name: 'Combo Vodka Energy', price: '$19.000', description: 'Botella de vodka + 4 energizantes', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80' },
    { name: 'Combo Fiesta x2', price: '$9.000', description: '2 tragos a elección + shot de regalo', image: 'https://images.unsplash.com/photo-1587223962930-cb7f31384c19?w=400&q=80' },
  ],
}

type Drink = { name: string; price: string; description: string; image: string }
type CartItem = Drink & { quantity: number }

const priceToNumber = (price: string) => Number(price.replace(/[^0-9]/g, ''))
const formatPrice = (price: number) => `$${price.toLocaleString('es-AR')}`

export function BarSection() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [modalQuantity, setModalQuantity] = useState(1)
  const topOfListRef = useRef<HTMLDivElement>(null)
  const scrollToTop = () => topOfListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const addToCart = (drink: Drink, qty: number = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.name === drink.name)
      if (existing) return current.map((item) => item.name === drink.name ? { ...item, quantity: item.quantity + qty } : item)
      return [...current, { ...drink, quantity: qty }]
    })
    setIsCartOpen(true)
  }

  const openDrink = (drink: Drink) => {
    setSelectedDrink(drink)
    setModalQuantity(1)
  }

  const updateQuantity = (name: string, change: number) => {
    setCart((current) => current.map((item) => item.name === name ? { ...item, quantity: item.quantity + change } : item).filter((item) => item.quantity > 0))
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + priceToNumber(item.price) * item.quantity, 0)

  const normalizedQuery = query.trim().toLowerCase()
  const isSearching = normalizedQuery.length > 0
  const searchResults = isSearching
    ? Object.values(drinks).flat().filter((drink) => drink.name.toLowerCase().includes(normalizedQuery))
    : []

  // Producción: validar precios en servidor, crear el checkout con Stripe/Mercado Pago y enviar el QR por email con Resend.
  const checkoutDemo = (method: string) => { setCart([]); setIsCheckoutOpen(false); sileo.info({ title: 'Pedido confirmado', description: `Pago demo con ${method}. En producción acá se generaría el QR de la orden y se enviaría por mail.` }) }

  return (
    <section id="barra" className="py-16 sm:py-24 relative">
      <div className="absolute top-1/2 right-0 w-1/4 h-1/2 bg-magenta/5 blur-[150px] rounded-full" />

      <div className="container mx-auto px-4">
        <div ref={topOfListRef} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary border border-primary/30 mb-4">
            La Barra
          </span>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl mb-4">
            Bebidas <span className="gradient-text">Premium</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubrí nuestra selección de tragos artesanales, cervezas importadas y botellas exclusivas.
          </p>
        </motion.div>

        {/* Toggle abrir/cerrar */}
        <div className="mb-8 flex justify-center">
          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            className="flex items-center gap-2 rounded-full glass border border-primary/30 px-6 py-3 text-sm font-medium text-primary transition hover:bg-primary/10"
          >
            {isExpanded ? 'Ocultar bebidas' : 'Ver bebidas'}
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        <AnimatePresence>
        {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-y-hidden"
        >
          {/* Buscador */}
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

          {isSearching ? (
            /* Resultados de búsqueda: grilla plana, mezclando categorías */
            searchResults.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No encontramos productos que coincidan con tu búsqueda.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {searchResults.map((drink) => (
                  <button
                    key={drink.name}
                    type="button"
                    onClick={() => openDrink(drink)}
                    className="group glass overflow-hidden rounded-xl text-left transition hover:border-primary/50 active:scale-[0.98]"
                  >
                    <div className="relative aspect-square w-full overflow-hidden">
                      <img src={drink.image} alt={drink.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="p-2.5">
                      <h4 className="truncate text-xs font-bold group-hover:text-primary transition-colors sm:text-sm">{drink.name}</h4>
                      <span className="text-xs font-bold gradient-text sm:text-sm">{drink.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            )
          ) : (
            /* Filas por categoría, cada una con scroll horizontal propio */
            <div className="space-y-10">
              {Object.entries(drinks).map(([categoryName, items]) => {
                const Icon = categoryIcons[categoryName]
                return (
                  <div key={categoryName}>
                    <div className="mb-3 flex items-center gap-2 px-1">
                      {Icon && <Icon className="h-4 w-4 text-primary" />}
                      <h3 className="text-lg font-bold sm:text-xl">{categoryName}</h3>
                    </div>
                    <div className="overflow-hidden">
                      <div className="-mx-3 flex gap-3 overflow-x-auto px-3 pb-3">
                        {items.map((drink) => (
                          <button
                            key={drink.name}
                            type="button"
                            onClick={() => openDrink(drink)}
                            className="group glass w-32 shrink-0 overflow-hidden rounded-xl text-left transition hover:border-primary/50 active:scale-[0.98] sm:w-40 lg:w-48"
                          >
                            <div className="relative aspect-square w-full overflow-hidden">
                              <img src={drink.image} alt={drink.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <div className="p-2.5">
                              <h4 className="truncate text-xs font-bold group-hover:text-primary transition-colors sm:text-sm">{drink.name}</h4>
                              <span className="text-xs font-bold gradient-text sm:text-sm">{drink.price}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
        )}
        </AnimatePresence>

        <div className="sticky bottom-4 z-20 mt-8 flex justify-center gap-3 sm:static sm:mt-10">
          {isExpanded && <button type="button" onClick={scrollToTop} aria-label="Volver arriba, al inicio de la Barra" className="flex items-center gap-2 rounded-full border border-primary/40 bg-background/80 px-4 py-3 text-sm font-semibold text-primary backdrop-blur-sm transition hover:bg-primary/10">
            <ArrowUp className="h-4 w-4" />
          </button>}
          <button type="button" onClick={() => setIsCartOpen(true)} className="relative flex items-center gap-3 rounded-full border border-primary/40 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/20">
            <ShoppingCart className="h-4 w-4" /> Ver carrito
            {cartCount > 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{cartCount}</span>}
          </button>
        </div>

        <AnimatePresence>
        {selectedDrink && (
          <motion.div
            key="drink-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={() => setSelectedDrink(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 24 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
              className="glass w-full max-w-md overflow-hidden rounded-3xl border border-primary/30 shadow-2xl"
            >
              <img src={selectedDrink.image} alt={selectedDrink.name} className="h-56 w-full object-cover" />
              <div className="p-5">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-primary">Detalle de producto</p>
                    <h3 className="mt-1 text-2xl font-bold">{selectedDrink.name}</h3>
                  </div>
                  <button type="button" onClick={() => setSelectedDrink(null)} className="text-sm text-muted-foreground">Cerrar</button>
                </div>
                <p className="mb-6 text-muted-foreground">{selectedDrink.description}</p>
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-2xl text-primary font-bold">{selectedDrink.price}</span>
                  <div className="flex items-center gap-3 rounded-full border border-border px-2 py-1">
                    <button type="button" aria-label="Restar" onClick={() => setModalQuantity((current) => Math.max(1, current - 1))} className="flex size-8 items-center justify-center rounded-full hover:bg-white/10"><Minus className="size-4" /></button>
                    <span className="w-5 text-center text-sm font-medium">{modalQuantity}</span>
                    <button type="button" aria-label="Sumar" onClick={() => setModalQuantity((current) => current + 1)} className="flex size-8 items-center justify-center rounded-full hover:bg-white/10"><Plus className="size-4" /></button>
                  </div>
                </div>
                <button type="button" onClick={() => { addToCart(selectedDrink, modalQuantity); setSelectedDrink(null) }} className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Agregar {modalQuantity > 1 ? `${modalQuantity} al carrito` : 'al carrito'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>

        {isCheckoutOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true"><div className="glass w-full max-w-lg rounded-3xl border border-primary/30 p-5 shadow-2xl"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs uppercase tracking-widest text-primary">Checkout</p><h3 className="text-2xl font-bold">Elegí cómo pagar</h3></div><button type="button" onClick={() => setIsCheckoutOpen(false)} className="text-sm text-muted-foreground">Cerrar</button></div><div className="grid gap-3"><button type="button" onClick={() => checkoutDemo('Tarjeta Virtual')} className="flex items-center gap-3 rounded-2xl border border-primary/30 p-4 text-left transition hover:bg-primary/10"><CreditCard className="size-5 text-primary" /><span><strong className="block">Tarjeta Virtual</strong><small className="text-muted-foreground">Usar el saldo de tu tarjeta vinculada</small></span></button><button type="button" onClick={() => checkoutDemo('Mercado Pago')} className="flex items-center gap-3 rounded-2xl border border-primary/30 p-4 text-left transition hover:bg-primary/10"><Smartphone className="size-5 text-primary" /><span><strong className="block">Mercado Pago</strong><small className="text-muted-foreground">Pagar al alias labastarda</small></span></button></div></div></div>}

        {isCartOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-label="Carrito de barra">
          <div className="glass max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl border border-primary/30 p-4 shadow-2xl shadow-primary/20 sm:p-6">
            <div className="mb-5 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-primary">La Barra</p><h3 className="text-2xl font-bold">Tu carrito</h3></div><button type="button" onClick={() => setIsCartOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">Cerrar</button></div>
            {cart.length === 0 ? <p className="py-8 text-center text-muted-foreground">Todavía no agregaste productos.</p> : <div className="space-y-3">{cart.map((item) => <div key={item.name} className="flex items-center gap-3 rounded-2xl bg-background/40 p-3"><img src={item.image} alt="" className="size-12 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="truncate font-semibold">{item.name}</p><p className="text-sm text-primary">{item.price}</p></div><div className="flex items-center gap-2"><button type="button" aria-label={`Quitar una unidad de ${item.name}`} onClick={() => updateQuantity(item.name, -1)} className="rounded-full border border-border p-1"><Minus className="size-3" /></button><span className="w-4 text-center text-sm">{item.quantity}</span><button type="button" aria-label={`Agregar una unidad de ${item.name}`} onClick={() => updateQuantity(item.name, 1)} className="rounded-full border border-border p-1"><Plus className="size-3" /></button><button type="button" aria-label={`Eliminar ${item.name}`} onClick={() => setCart((current) => current.filter((cartItem) => cartItem.name !== item.name))} className="ml-1 text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button></div></div>)}</div>}
            {cart.length > 0 && <><div className="my-5 flex items-center justify-between border-t border-border pt-4"><span className="text-muted-foreground">Total</span><strong className="text-2xl text-primary">{formatPrice(cartTotal)}</strong></div><button type="button" onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true) }} className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">Ir a pagar</button></>}
          </div>
        </div>}

        {/* Bar Service Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass rounded-3xl p-8 text-center max-w-3xl mx-auto"
        >
          <Wine className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h4 className="text-xl font-bold mb-2">Servicio de Mesa VIP</h4>
          <p className="text-muted-foreground">
            Con tu entrada VIP o Premium, disfrutá de servicio de mesero exclusivo 
            directamente en tu mesa. Sin filas, sin esperas.
          </p>
        </motion.div>
      </div>
    </section>
  )
}