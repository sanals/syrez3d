import { Header } from '@/components/header'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-20 min-h-screen">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-accent hover:opacity-80 transition-opacity mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-12">Privacy Policy</h1>
        
        <div className="space-y-8 text-muted-foreground font-light leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
            <p>
              When you visit Syrez, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
            <p>
              We use your personal Information to provide our services to you, which includes: offering products for sale, processing payments, shipping and fulfillment of your order, and keeping you up to date on new products, services, and offers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">3. Data Retention</h2>
            <p>
              When you place an order through the Site, we will retain your Personal Information for our records unless and until you ask us to erase this information.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">4. Contact Us</h2>
            <p>
              For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <a href="mailto:privacy@syrez.com" className="text-foreground hover:underline">privacy@syrez.com</a>.
            </p>
          </section>
        </div>
      </main>
    </>
  )
}
