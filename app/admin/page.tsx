'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { useAuth } from '@/lib/auth-context'
import { Order, OrderStatus } from '@/lib/orders-context'
import { db } from '@/lib/firebase'
import { collection, query, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore'
import { Loader2, Plus, ShieldAlert, Package, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export default function AdminDashboard() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true)

  // Verify Admin Access
  useEffect(() => {
    if (loading) return // wait for firebase auth to resolve before checking

    if (user === null) {
      router.push('/')
      return
    }
    
    // Check if current user email matches env
    const checkAccess = async () => {
      // Small timeout to prevent flashes
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
      if (user.email === adminEmail && adminEmail) {
        setIsAdmin(true)
        loadAllOrders()
      } else {
        setIsAdmin(false)
        router.push('/')
      }
    }
    
    checkAccess()
  }, [user, loading, router])

  const loadAllOrders = async () => {
    try {
      // In production, your Firestore rules must enforce this!
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(ordersQuery)
      const allOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Order))
      setOrders(allOrders)
    } catch (error) {
      console.error('[admin] load orders err:', error)
      toast.error('Failed to load orders. Check Firestore rules.')
    } finally {
      setIsDataLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId)
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: Date.now()
      })
      
      // Update local state optimism
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: newStatus, updatedAt: Date.now() } : o
      ))
      toast.success(`Order ${orderId} updated to ${newStatus}`)
    } catch (error) {
      console.error('[admin] update err:', error)
      toast.error('Failed to update order status')
    }
  }

  const handleTrackingUpdate = async (orderId: string, trackingNumber: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId)
      await updateDoc(orderRef, {
        trackingNumber,
        updatedAt: Date.now()
      })
      
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, trackingNumber, updatedAt: Date.now() } : o
      ))
      toast.success('Tracking number saved')
    } catch (error) {
      toast.error('Failed to save tracking number')
    }
  }

  if (loading || isDataLoading || isAdmin === null || isAdmin === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <Loader2 className="w-8 h-8 animate-spin text-accent mb-4" />
        <p className="text-muted-foreground text-sm">Verifying secure connection...</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Mission Control</h1>
            <p className="text-muted-foreground">Manage order statuses and shipments</p>
          </div>
          <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">
            Secure Admin Session
          </Badge>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Order ID & Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items ($ Total)</th>
                  <th className="px-6 py-4">Tracking Node</th>
                  <th className="px-6 py-4 text-right">Status Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      <Package className="w-8 h-8 opacity-20 mx-auto mb-2" />
                      No orders found in database.
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-foreground font-medium">{order.id}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-foreground font-medium truncate w-40" title={order.userName || 'Unknown'}>
                          {order.userName || 'Unknown'}
                        </div>
                        <div className="font-mono text-xs text-muted-foreground truncate w-40" title={order.userEmail || order.userId}>
                          {order.userEmail || order.userId}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-foreground">{order.items.length} items</div>
                        <div className="font-medium text-foreground">${order.total.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          placeholder="Tracking #..."
                          defaultValue={order.trackingNumber || ''}
                          onBlur={(e) => {
                            if (e.target.value !== order.trackingNumber) {
                              handleTrackingUpdate(order.id, e.target.value)
                            }
                          }}
                          className="w-full bg-background border border-border px-3 py-1.5 rounded text-xs focus:outline-none focus:border-accent"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border-0 outline-none ${getStatusColor(order.status)}`}
                          >
                            <option value="pending">🟡 Pending</option>
                            <option value="processing">🔵 Processing</option>
                            <option value="shipped">🟣 Shipped</option>
                            <option value="delivered">🟢 Delivered</option>
                            <option value="cancelled">🔴 Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
