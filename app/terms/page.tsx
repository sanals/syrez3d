import { Header } from '@/components/header'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfService() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-20 min-h-screen">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-accent hover:opacity-80 transition-opacity mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-12">Terms of Service</h1>
        
        <div className="space-y-8 text-muted-foreground font-light leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>
              By visiting our site and/ or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms").
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">2. Products or Services</h2>
            <p>
              Certain products or services may be available exclusively online through the website. We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">3. Accuracy of Billing</h2>
            <p>
              We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. 
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">4. Handcrafted Variance</h2>
            <p>
              Due to the nature of 3D printing and post-processing, minor variations in layer lines, resin curing, or paint finish are considered part of the artisanal process rather than defects.
            </p>
          </section>
        </div>
      </main>
    </>
  )
}
