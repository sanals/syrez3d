import { Header } from '@/components/header'
import Link from 'next/link'
import { ArrowLeft, Mail, MessageCircle } from 'lucide-react'

export default function Contact() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-20 min-h-screen">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-accent hover:opacity-80 transition-opacity mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-8">Contact Us</h1>
        
        <p className="text-lg text-muted-foreground font-light mb-12">
          Have a question about an order, a custom commission, or our materials? We would love to hear from you.
        </p>

        <div className="space-y-6">
          <a href="mailto:hello@syrez.com" className="flex items-center gap-4 p-6 border border-border rounded-xl hover:bg-muted/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Email</h3>
              <p className="text-muted-foreground text-sm">hello@syrez.com</p>
            </div>
          </a>

          <a href="https://wa.me/918089590649" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-6 border border-border rounded-xl hover:bg-muted/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">WhatsApp</h3>
              <p className="text-muted-foreground text-sm">Chat with our support team</p>
            </div>
          </a>
        </div>
      </main>
    </>
  )
}
