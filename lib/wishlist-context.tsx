'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './auth-context'
import { db } from './firebase'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'

interface WishlistContextType {
  wishlistItems: string[]
  isLoading: boolean
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Load wishlist from Firestore
  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) {
        setWishlistItems([])
        setIsLoading(false)
        return
      }

      try {
        const wishlistDoc = await getDoc(doc(db, 'wishlists', user.uid))
        if (wishlistDoc.exists()) {
          const items = wishlistDoc.data().items || []
          setWishlistItems(items)
        } else {
          setWishlistItems([])
        }
      } catch (error) {
        console.log('[wishlist] Load error:', error)
        setWishlistItems([])
      } finally {
        setIsLoading(false)
      }
    }

    loadWishlist()
  }, [user])

  const addToWishlist = async (productId: string) => {
    if (!user) return

    try {
      const wishlistRef = doc(db, 'wishlists', user.uid)
      const wishlistDoc = await getDoc(wishlistRef)

      if (wishlistDoc.exists()) {
        // Update existing wishlist
        await updateDoc(wishlistRef, {
          items: arrayUnion(productId),
          updatedAt: Date.now(),
        })
      } else {
        // Create new wishlist
        await setDoc(wishlistRef, {
          items: [productId],
          userId: user.uid,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        })
      }

      setWishlistItems((prev) => [...new Set([...prev, productId])])
    } catch (error) {
      console.log('[wishlist] Add error:', error)
      throw error
    }
  }

  const removeFromWishlist = async (productId: string) => {
    if (!user) return

    try {
      const wishlistRef = doc(db, 'wishlists', user.uid)
      await updateDoc(wishlistRef, {
        items: arrayRemove(productId),
        updatedAt: Date.now(),
      })

      setWishlistItems((prev) => prev.filter((id) => id !== productId))
    } catch (error) {
      console.log('[wishlist] Remove error:', error)
      throw error
    }
  }

  const isInWishlist = (productId: string) => wishlistItems.includes(productId)

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
