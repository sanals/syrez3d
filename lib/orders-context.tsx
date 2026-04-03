'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './auth-context'
import { db } from './firebase'
import { collection, query, where, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore'

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: number
  updatedAt: number
  estimatedDelivery?: number
  trackingNumber?: string
  notes?: string
  userName?: string
  userEmail?: string
}

interface OrdersContextType {
  orders: Order[]
  isLoading: boolean
  createOrder: (items: OrderItem[], total: number) => Promise<string>
  getOrder: (orderId: string) => Order | undefined
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Load user's orders from Firestore
  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setOrders([])
        setIsLoading(false)
        return
      }

      try {
        const ordersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid))
        const snapshot = await getDocs(ordersQuery)
        const userOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Order))
        setOrders(userOrders.sort((a, b) => b.createdAt - a.createdAt))
      } catch (error) {
        console.log('[orders] Load error:', error)
        setOrders([])
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [user])

  const createOrder = async (items: OrderItem[], total: number) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const now = Date.now()
      const orderId = `ORD-${user.uid.substring(0, 8)}-${Date.now()}`

      const newOrder: Order = {
        id: orderId,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Unknown',
        userEmail: user.email || 'Unknown',
        items,
        total,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
        estimatedDelivery: now + 7 * 24 * 60 * 60 * 1000, // 7 days from now
      }

      await setDoc(doc(db, 'orders', orderId), newOrder)
      setOrders((prev) => [newOrder, ...prev])
      return orderId
    } catch (error) {
      console.log('[orders] Create error:', error)
      throw error
    }
  }

  const getOrder = (orderId: string) => orders.find((order) => order.id === orderId)

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const orderRef = doc(db, 'orders', orderId)
      await updateDoc(orderRef, {
        status,
        updatedAt: Date.now(),
      })

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status, updatedAt: Date.now() } : order
        )
      )
    } catch (error) {
      console.log('[orders] Update error:', error)
      throw error
    }
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        isLoading,
        createOrder,
        getOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider')
  }
  return context
}
