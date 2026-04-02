import { Header } from '@/components/header'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function FAQ() {
  const faqs = [
    {
      q: "What materials do you use for your toys?",
      a: "Our designer toys are primarily printed using high-resolution liquid resin (SLA) for extreme detail. Some structural or larger pieces may utilize Selective Laser Sintering (SLS) nylon."
    },
    {
      q: "Are the toys hand-painted?",
      a: "Yes. Most of our colored variations are hand-finished and painted using premium acrylics and clear coats for durability."
    },
    {
      q: "Do you take custom commissions?",
      a: "Occasionally. If you have a specific vision or need a custom colorway, please reach out via our Contact page to discuss availability."
    },
    {
      q: "How should I care for my 3D printed piece?",
      a: "Keep resin prints out of direct, prolonged sunlight to prevent UV degradation over time. Dust gently with a microfiber cloth. Avoid dropping them, as resin can be brittle."
    }
  ]

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-20 min-h-screen">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-accent hover:opacity-80 transition-opacity mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-12">Frequently Asked Questions</h1>
        
        <div className="space-y-8">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-border pb-8 last:border-0">
              <h3 className="font-semibold text-lg text-foreground mb-3">{faq.q}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
