import type { Metadata, Viewport } from 'next'
import { Crimson_Text, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { WishlistProvider } from '@/lib/wishlist-context'
import { OrdersProvider } from '@/lib/orders-context'
import { CartProvider } from '@/lib/cart-context'
import { ThemeProvider } from '@/components/theme-provider'

const crimsonText = Crimson_Text({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-serif'
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: 'Syrez — Premium 3D Printed Designer Toys & Materials',
  description: 'Handcrafted 3D printed designer toys and premium materials. Precision-engineered, artisan quality.',
  icons: {
    icon: '/icons/icon-light.png',
    apple: '/icons/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf8f3' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0e0b' }
  ],
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${crimsonText.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <OrdersProvider>
              <WishlistProvider>
                <CartProvider>
                  {children}
                </CartProvider>
              </WishlistProvider>
            </OrdersProvider>
          </AuthProvider>
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
