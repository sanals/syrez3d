'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product } from './products'
import { useAuth } from './auth-context'
import { db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { user } = useAuth()

  const previousUserRef = React.useRef(user?.uid)

  // Load and merge cart on mount or auth change
  useEffect(() => {
    let mounted = true
    
    const syncCart = async () => {
      // 1. Read local storage
      let localItems: CartItem[] = []
      try {
        const saved = localStorage.getItem('syrez_cart')
        if (saved) localItems = JSON.parse(saved)
      } catch (e) {}

      // 2. If logged out, just use local items
      if (!user) {
        if (mounted) {
          setItems(localItems)
          setIsLoaded(true)
        }
        return
      }

      // 3. If logged in, fetch cloud cart
      try {
        const cartRef = doc(db, 'carts', user.uid)
        const cartDoc = await getDoc(cartRef)
        
        let cloudItems: CartItem[] = []
        if (cartDoc.exists()) {
          cloudItems = cartDoc.data().items || []
        }

        // 4. Merge if there are local items
        if (localItems.length > 0) {
          const merged = [...cloudItems]
          localItems.forEach(localItem => {
            const existing = merged.find(i => i.product.id === localItem.product.id)
            if (existing) {
              existing.quantity += localItem.quantity
            } else {
              merged.push(localItem)
            }
          })
          
          await setDoc(cartRef, { items: merged, updatedAt: Date.now() })
          localStorage.removeItem('syrez_cart') // Clear local after absorbing
          if (mounted) setItems(merged)
        } else {
          if (mounted) setItems(cloudItems)
        }
      } catch (e) {
        console.error('[cart] Sync error:', e)
        if (mounted) setItems(localItems) // Fallback to local
      } finally {
        if (mounted) setIsLoaded(true)
      }
    }

    syncCart()
    return () => { mounted = false }
  }, [user])

  // Save to correct storage when items change
  useEffect(() => {
    // If user changed during this render, skip the save to prevent overwriting cloud cart 
    // with empty local state before syncCart finishes fetching!
    if (previousUserRef.current !== user?.uid) {
      previousUserRef.current = user?.uid
      return
    }

    if (!isLoaded) return

    if (user) {
      setDoc(doc(db, 'carts', user.uid), { items, updatedAt: Date.now() })
        .catch(e => console.error('[cart] Save error:', e))
    } else {
      localStorage.setItem('syrez_cart', JSON.stringify(items))
    }
  }, [items, isLoaded, user])

  const addItem = (product: Product, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id)
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prevItems, { product, quantity }]
    })
  }

  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
    } else {
      setItems(prevItems =>
        prevItems.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      )
    }
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
