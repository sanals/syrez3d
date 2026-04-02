import { Header } from '@/components/header'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function Shipping() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-20 min-h-screen">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-accent hover:opacity-80 transition-opacity mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-8">Shipping & Returns</h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Fulfillment Time</h2>
            <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
              <p>
                As many of our designer toys are hand-finished to order, please allow <strong>3-7 business days</strong> for fulfillment before your order is shipped. Raw materials and filament orders typically ship within 1-2 business days.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Domestic & International Shipping</h2>
            <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
              <p>
                We ship worldwide. Shipping costs are calculated at checkout based on package weight and destination. 
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Domestic:</strong> 3-5 business days via standard courier.</li>
                <li><strong>International:</strong> 7-14 business days. Please note that buyers are responsible for any customs and import taxes that may apply.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Returns & Exchanges</h2>
            <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
              <p>
                Due to the artisanal nature of our 3D printed products, we do not accept returns. However, if your item arrives damaged or defective, please contact us within 48 hours of delivery with photos of the damage, and we will arrange a replacement.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
