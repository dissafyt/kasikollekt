"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase-config"

interface AuthContextType {
  user: User | null
  loading: boolean
  userRole: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userRole: null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult()
          const role = (idTokenResult.claims.role as string) || null
          setUserRole(role)
        } catch (error) {
          console.error("Error fetching user role:", error)
          setUserRole(null)
        }
      } else {
        setUserRole(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, loading, userRole }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
