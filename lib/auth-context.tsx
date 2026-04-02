'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  User, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth'
import { auth } from './firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

interface UserProfile {
  email: string
  displayName?: string
  createdAt: number
  updatedAt: number
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  loginWithEmail: (email: string, password: string) => Promise<void>
  registerWithEmail: (email: string, password: string, displayName: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Fetch user profile from Firestore
        try {
          const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (profileDoc.exists()) {
            setUserProfile(profileDoc.data() as UserProfile)
          }
        } catch (error) {
          console.log('[auth] Profile fetch error:', error)
        }
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const registerWithEmail = async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    
    try {
      // Create user profile in Firestore
      const now = Date.now()
      const profileData: UserProfile = {
        email,
        displayName,
        createdAt: now,
        updatedAt: now,
      }
      
      await setDoc(doc(db, 'users', result.user.uid), profileData)
      setUserProfile(profileData)
    } catch (error) {
      console.error('[auth] Failed to save user profile to Firestore:', error)
      // Do not throw the error, we still want the user to be logged in
    }
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    
    try {
      // Create or update user profile in Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid))
      if (!userDoc.exists()) {
        const now = Date.now()
        const profileData: UserProfile = {
          email: result.user.email || '',
          displayName: result.user.displayName || undefined,
          createdAt: now,
          updatedAt: now,
        }
        await setDoc(doc(db, 'users', result.user.uid), profileData)
        setUserProfile(profileData)
      }
    } catch (error) {
      console.error('[auth] Failed to sync Google login with Firestore:', error)
      // Do not throw the error, we still want the user to be logged in
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider 
      value={{
        user,
        userProfile,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
