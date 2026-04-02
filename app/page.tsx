'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/header'
import { CartDrawer } from '@/components/cart-drawer'
import { ProductCard } from '@/components/product-card'
import { getFeaturedProducts } from '@/lib/products'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const featuredProducts = getFeaturedProducts()

  return (
    <>
      <Header onCartClick={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-background via-background to-muted/20">
          <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                    Precision Meets Artistry
                  </h1>
                  <p className="text-lg lg:text-xl text-muted-foreground font-light leading-relaxed">
                    Handcrafted 3D printed designer toys and premium materials. Each piece is engineered with precision and finished by hand.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
                  >
                    Shop Collection
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <a
                    href="#featured"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-foreground hover:bg-muted rounded-lg font-medium transition-colors"
                  >
                    View Highlights
                  </a>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-border">
                  <div>
                    <p className="text-sm font-semibold text-accent mb-1">100%</p>
                    <p className="text-xs text-muted-foreground">Handcrafted</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-accent mb-1">Expert</p>
                    <p className="text-xs text-muted-foreground">Artisan Quality</p>
                  </div>
                </div>
              </div>

              {/* Right: Hero Image Placeholder */}
              <div className="relative aspect-square rounded-2xl bg-muted overflow-hidden lg:h-[600px]">
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent/70 rounded-lg mx-auto mb-4 opacity-50"></div>
                    <p className="text-sm text-muted-foreground">Hero imagery coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="featured" className="max-w-7xl mx-auto px-6 py-20">
          <div className="space-y-12">
            {/* Section Header */}
            <div className="space-y-4">
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                Curated Collection
              </h2>
              <p className="text-lg text-muted-foreground font-light max-w-2xl">
                Our most coveted designer toys and premium materials. Each piece celebrates the precision of modern 3D printing.
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* View All CTA */}
            <div className="flex justify-center pt-8">
              <Link
                href="/shop"
                className="text-lg font-medium text-accent hover:text-accent/80 transition-colors flex items-center gap-2"
              >
                Explore Full Collection
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Why Syrez Section */}
        <section className="bg-muted/30 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-12 text-center">
              Why Choose Syrez
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="space-y-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-accent">01</span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Precision Engineering
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Advanced 3D printing technology with micron-level accuracy. Every piece is inspected and hand-finished to perfection.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-accent">02</span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Artisan Finish
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Hand-polished edges and surfaces. Matte resin details and custom coloring elevate each design into art.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="space-y-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-accent">03</span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Premium Materials
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Sourced from leading manufacturers. SLS nylon, technical resin, and silk-textured filaments for quality that lasts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-foreground/5 border border-border rounded-2xl p-12 text-center space-y-6">
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Ready to Own Precision Art?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our full collection and discover the perfect piece for your collection.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border mt-20 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <p className="font-serif text-lg font-semibold text-foreground mb-2">Syrez</p>
                <p className="text-sm text-muted-foreground">Premium 3D printed designer toys and materials.</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground mb-4">Shop</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/shop" className="hover:text-foreground transition-colors">All Products</Link></li>
                  <li><Link href="/shop?category=toys" className="hover:text-foreground transition-colors">Designer Toys</Link></li>
                  <li><Link href="/shop?category=materials" className="hover:text-foreground transition-colors">Materials</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground mb-4">Support</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                  <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
                  <li><Link href="/shipping" className="hover:text-foreground transition-colors">Shipping</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground mb-4">Connect</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Instagram</a></li>
                  <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Twitter</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
                <p>&copy; 2024 Syrez. All rights reserved.</p>
                <div className="flex gap-6 mt-4 sm:mt-0">
                  <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}

