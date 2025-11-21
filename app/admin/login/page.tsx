"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShoppingBag } from 'lucide-react'
import { authAPI } from "@/lib/api-client"
import { auth } from "@/lib/firebase-config"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    if (auth) {
      setAuthReady(true)
    } else {
      setError("Firebase authentication failed to initialize. Please refresh the page.")
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!email || !password) {
        setError("Please enter both email and password")
        setIsLoading(false)
        return
      }

      if (!authReady) {
        setError("Authentication system is not ready. Please wait or refresh the page.")
        setIsLoading(false)
        return
      }

      console.log("[v0] Attempting login for:", email)

      if (!auth) {
        setError("Firebase authentication is not initialized. Please check your configuration.")
        setIsLoading(false)
        return
      }

      await authAPI.login(email, password)

      const user = auth.currentUser
      if (user) {
        const idTokenResult = await user.getIdTokenResult()
        const role = idTokenResult.claims.role as string

        console.log("[v0] Login successful, user role:", role)

        if (role !== "admin") {
          await auth.signOut()
          setError("Access denied. Only admin users can access this area.")
          setIsLoading(false)
          return
        }
      }

      console.log("[v0] Admin login successful, redirecting to dashboard")
      router.push("/admin")
    } catch (err: any) {
      console.error("[v0] Login error:", err)

      let errorMessage = "Invalid email or password"

      if (err.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password. Please check your credentials and try again."
      } else if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address."
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again."
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many failed login attempts. Please try again later."
      } else if (err.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection."
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <ShoppingBag className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">KasiKollekt Admin</CardTitle>
            <CardDescription>Sign in to access the admin dashboard</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || !authReady}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || !authReady}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || !authReady}>
              {isLoading ? "Signing in..." : !authReady ? "Initializing..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Use your Firebase admin credentials to sign in</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
