'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wine, Beer, Coffee, Sparkles } from 'lucide-react'

const categories = [
  { name: 'Tragos', icon: Wine },
  { name: 'Cervezas', icon: Beer },
  { name: 'Sin Alcohol', icon: Coffee },
  { name: 'Botellas Premium', icon: Sparkles },
]

const drinks = {
  'Tragos': [
    { name: 'Mojito TEOS', price: '$4.500', description: 'Ron, menta fresca, lima, azúcar', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80' },
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
}

export function BarSection() {
  const [activeCategory, setActiveCategory] = useState('Tragos')

  return (
    <section id="barra" className="py-24 relative">
      <div className="absolute top-1/2 right-0 w-1/4 h-1/2 bg-magenta/5 blur-[150px] rounded-full" />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary border border-primary/30 mb-4">
            La Barra
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Bebidas <span className="gradient-text">Premium</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubrí nuestra selección de tragos artesanales, cervezas importadas y botellas exclusivas.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.name
                    ? 'bg-primary text-primary-foreground neon-glow'
                    : 'glass text-foreground/80 hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </button>
            )
          })}
        </motion.div>

        {/* Drinks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drinks[activeCategory as keyof typeof drinks].map((drink, index) => (
            <motion.div
              key={drink.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group glass rounded-2xl overflow-hidden"
            >
              <div className="flex gap-4 p-4">
                {/* Image */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                  <img
                    src={drink.image}
                    alt={drink.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                    {drink.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {drink.description}
                  </p>
                  <span className="text-xl font-bold gradient-text">{drink.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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