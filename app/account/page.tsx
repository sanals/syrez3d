'use client'

import { ProtectedRoute } from '@/components/protected-route'
import { Header } from '@/components/header'
import { CartDrawer } from '@/components/cart-drawer'
import { useAuth } from '@/lib/auth-context'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, Package, Settings, LogOut, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useWishlist } from '@/lib/wishlist-context'
import { useOrders } from '@/lib/orders-context'
import { products } from '@/lib/products'
import { OrderTracker } from '@/components/order-tracker'
import { ProductCard } from '@/components/product-card'

export default function AccountPage() {
  const { user, userProfile, logout } = useAuth()
  const { wishlistItems, isLoading: isWishlistLoading } = useWishlist()
  const { orders, isLoading: isOrdersLoading } = useOrders()
  const router = useRouter()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Hydrate full products for wishlist
  const wishlistProducts = products.filter(p => wishlistItems.includes(p.id))

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      toast.success('Signed out successfully')
      router.push('/')
    } catch (error) {
      toast.error('Failed to sign out')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header onCartClick={() => setIsCartOpen(true)} />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        <main className="max-w-4xl mx-auto px-6 py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
              Welcome, {userProfile?.displayName || 'User'}
            </h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Wishlist</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Account Information</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="text-foreground font-medium">{userProfile?.displayName || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-foreground font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Account Created</p>
                      <p className="text-foreground font-medium">
                        {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">Danger Zone</h3>
                  <Button 
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    <LogOut className="w-4 h-4" />
                    {isLoading ? 'Signing out...' : 'Sign Out'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist" className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">My Wishlist</h2>
                
                {isWishlistLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  </div>
                ) : wishlistProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
                    <Link href="/shop">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-6">Order History</h2>
                
                {isOrdersLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground mb-4">No orders yet</p>
                    <Link href="/shop">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {orders.map(order => (
                      <div key={order.id} className="border border-border rounded-lg p-6 hover:shadow-sm transition-shadow">
                        <OrderTracker order={order} />
                        <div className="mt-4 flex justify-end">
                          <Link href={`/track-order?id=${order.id}`}>
                            <Button variant="outline" size="sm" className="gap-2">
                              Full Details <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}
