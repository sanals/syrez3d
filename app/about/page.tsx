import { Header } from '@/components/header'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function About() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-20 min-h-screen">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-accent hover:opacity-80 transition-opacity mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-8">About Syrez</h1>
        
        <div className="space-y-6 text-muted-foreground font-light leading-relaxed text-lg">
          <p>
            Syrez was born from a passion for precision and the art of physical form. We believe that 3D printing is not just a prototyping tool, but a medium for final, handcrafted art.
          </p>
          <p>
            Our designer toys are meticulously conceptualized, modeled, and printed using cutting-edge resin and SLS technologies. Each piece is hand-finished to ensure it feels less like a product, and more like a sculptural artifact.
          </p>
          <p>
            Beyond our toys, we offer premium materials and filaments for creators who demand the same uncompromising quality in their own studios. Welcome to the intersection of digital design and tactile reality.
          </p>
        </div>
      </main>
    </>
  )
}
