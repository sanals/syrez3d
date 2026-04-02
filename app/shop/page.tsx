'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { CartDrawer } from '@/components/cart-drawer'
import { ProductCard } from '@/components/product-card'
import { products } from '@/lib/products'
import { ChevronDown, Loader2 } from 'lucide-react'

function ShopContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryParam = searchParams.get('category')
  
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'toys' | 'materials'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest')

  // Sync state with URL parameter on mount or URL change
  useEffect(() => {
    if (categoryParam === 'toys' || categoryParam === 'materials') {
      setSelectedCategory(categoryParam)
    } else {
      setSelectedCategory('all')
    }
  }, [categoryParam])

  // Filter products
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    return 0
  })

  return (
    <>
      <Header onCartClick={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main>
        {/* Hero */}
        <section className="bg-muted/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Shop Collection
            </h1>
            <p className="text-lg text-muted-foreground font-light max-w-2xl">
              Explore our complete range of handcrafted 3D printed designer toys and premium materials.
            </p>
          </div>
        </section>

        {/* Filters & Products */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
                    Category
                  </h3>
                  <div className="space-y-2">
                    {[
                      { value: 'all' as const, label: 'All Products' },
                      { value: 'toys' as const, label: 'Designer Toys' },
                      { value: 'materials' as const, label: 'Materials' }
                    ].map(cat => (
                      <button
                        key={cat.value}
                        onClick={() => {
                          const url = new URL(window.location.href)
                          if (cat.value === 'all') {
                            url.searchParams.delete('category')
                          } else {
                            url.searchParams.set('category', cat.value)
                          }
                          router.push(url.pathname + url.search)
                        }}
                        className={`block text-sm transition-colors ${
                          selectedCategory === cat.value
                            ? 'font-semibold text-accent'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Filter */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
                    Sort
                  </h3>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground appearance-none cursor-pointer hover:border-foreground transition-colors"
                    >
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                  </div>
                </div>

                {/* Price Range Info */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Showing {sortedProducts.length} of {products.length} products
                  </p>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {sortedProducts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-lg text-muted-foreground">No products found in this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Syrez. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default function Shop() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  )
}

