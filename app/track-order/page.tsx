'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { CartDrawer } from '@/components/cart-drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { Order } from '@/lib/orders-context'
import { OrderTracker } from '@/components/order-tracker'
import { Loader2, Package } from 'lucide-react'

export default function TrackOrderPage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderId.trim()) {
      toast.error('Please enter an order ID')
      return
    }

    setIsLoading(true)
    setSearched(true)

    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId))
      if (orderDoc.exists()) {
        setOrder({ id: orderDoc.id, ...orderDoc.data() } as Order)
      } else {
        setOrder(null)
        toast.error('Order not found')
      }
    } catch (error) {
      console.log('[track] Error:', error)
      toast.error('Failed to find order')
      setOrder(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Package className="w-12 h-12 text-accent mx-auto mb-4 opacity-80" />
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
            Track Your Order
          </h1>
          <p className="text-muted-foreground">
            Enter your order ID to track the status of your shipment
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-12 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderId">Order ID</Label>
            <Input
              id="orderId"
              placeholder="ORD-xxxxxxxx-1234567890"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              You can find your order ID in your confirmation email or account dashboard
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              'Track Order'
            )}
          </Button>
        </form>

        {/* Results */}
        {searched && (
          <div className="space-y-6">
            {order ? (
              <div className="bg-card border border-border rounded-lg p-6">
                <OrderTracker order={order} />
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground mb-4">Order not found</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Please check your order ID and try again. If you need help, contact our support team.
                </p>
                <Button
                  onClick={() => {
                    setOrderId('')
                    setOrder(null)
                    setSearched(false)
                  }}
                  variant="outline"
                  className="border-border hover:bg-muted"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        {!searched && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-2">Don&apos;t have an order ID?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sign in to your account to view all your orders in one place.
              </p>
              <Button
                variant="outline"
                className="w-full border-border hover:bg-muted text-foreground"
                asChild
              >
                <a href="/account">View My Orders</a>
              </Button>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Contact our support team for assistance with your order.
              </p>
              <Button
                variant="outline"
                className="w-full border-border hover:bg-muted text-foreground"
                asChild
              >
                <a href="mailto:support@syrez.com">Email Support</a>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
