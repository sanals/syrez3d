'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/header'
import { CartDrawer } from '@/components/cart-drawer'
import { ProductCard } from '@/components/product-card'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { useAuth } from '@/lib/auth-context'
import { getProductById, products } from '@/lib/products'
import { ArrowLeft, Plus, Minus, CheckCircle2, Heart, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ProductDetail() {
  const params = useParams()
  const id = params?.id as string
  const product = getProductById(id)
  const { addItem } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { user } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)
  
  const inWishlist = isInWishlist(product?.id || '')

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link href="/shop" className="text-accent hover:underline">Back to Shop</Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
    toast.success(`${product.name} added to cart`)
  }

  const handleWishlistToggle = async () => {
    if (isWishlistLoading) return

    if (!user) {
      toast.error('Please log in to use the wishlist')
      return
    }
    
    setIsWishlistLoading(true)
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id)
        toast.success('Removed from wishlist')
      } else {
        await addToWishlist(product.id)
        toast.success('Added to wishlist')
      }
    } catch (err) {
      toast.error('Failed to update wishlist')
    } finally {
      setIsWishlistLoading(false)
    }
  }

  const relatedProducts = products.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 3)

  return (
    <>
      <Header onCartClick={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/shop" className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>

        {/* Product Section */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div className="relative aspect-square rounded-2xl bg-muted overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category */}
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                {product.category === 'toys' ? 'Designer Toy' : 'Material'}
              </span>

              {/* Title */}
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {product.name}
              </h1>

              {/* Description */}
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Price */}
              <div className="mb-8 pb-8 border-b border-border">
                <p className="text-4xl font-bold text-foreground">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              {/* Specifications */}
              <div className="mb-8 pb-8 border-b border-border space-y-4">
                <h3 className="font-semibold text-foreground uppercase text-sm tracking-wider">
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Material</p>
                    <p className="font-medium text-foreground">{product.specs.material}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Print Time</p>
                    <p className="font-medium text-foreground">{product.specs.printTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Scale</p>
                    <p className="font-medium text-foreground">{product.specs.scale}</p>
                  </div>
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4 mb-8">
                {/* Quantity Selector */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Quantity</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-12 text-center text-lg font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart & Wishlist Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-accent text-accent-foreground py-4 rounded-lg font-medium hover:bg-accent/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg shadow-sm"
                  >
                    {addedToCart ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        Add to Cart
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleWishlistToggle}
                    disabled={isWishlistLoading}
                    className="w-16 shrink-0 border border-border flex items-center justify-center rounded-lg hover:bg-muted active:scale-[0.98] transition-all"
                    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {isWishlistLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    ) : (
                      <Heart className={`w-6 h-6 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
                    )}
                  </button>
                </div>

                {/* WhatsApp Inquiry */}
                <a
                  href={`https://wa.me/918089590649?text=Hi, I'm interested in ${product.name}. Price: $${product.price.toFixed(2)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-border text-foreground py-3 rounded-lg font-medium hover:bg-muted transition-colors text-center"
                >
                  Inquire on WhatsApp
                </a>
              </div>

              {/* Shipping Info */}
              <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">Handcrafted & Shipped with Care</p>
                <p className="text-xs text-muted-foreground">
                  Each piece is inspected and packaged carefully. Worldwide shipping available.
                </p>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-border pt-16">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
                Related Products
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </section>
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
