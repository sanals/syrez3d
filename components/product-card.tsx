'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/products'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { useAuth } from '@/lib/auth-context'
import { Heart, Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { user } = useAuth()
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)
  
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    toast.success(`${product.name} added to cart`)
  }

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
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

  const handleAddToCartKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleAddToCart(e as any)
    }
  }

  const handleWishlistKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleWishlistToggle(e as any)
    }
  }

  return (
    <Link href={`/shop/${product.id}`} className="block group cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent rounded-lg">
      <div className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative bg-muted rounded-lg overflow-hidden aspect-square mb-4">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Wishlist Button Overlay */}
          <div 
            role="button"
            tabIndex={0}
            onClick={handleWishlistToggle}
            onKeyDown={handleWishlistKeyDown}
            className={`absolute top-3 right-3 p-2.5 bg-background/80 backdrop-blur-sm rounded-full transition-all z-20 shadow-sm ${
              isWishlistLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-background hover:scale-110 cursor-pointer'
            }`}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlistLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-foreground" />
            ) : (
              <Heart className={`w-4 h-4 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {product.category === 'toys' ? 'Designer Toy' : 'Material'}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          {/* Price and Cart Toggle */}
          <div className="pt-3 mt-auto border-t border-border flex items-center justify-between">
            <p className="text-lg font-semibold text-foreground">
              ${product.price.toFixed(2)}
            </p>
            <div
              role="button"
              tabIndex={0}
              onClick={handleAddToCart}
              onKeyDown={handleAddToCartKeyDown}
              className="w-10 h-10 flex items-center justify-center bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all shadow-sm"
              aria-label="Add to cart"
            >
              <Plus className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
