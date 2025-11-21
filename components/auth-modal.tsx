"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, CheckCircle2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
} from "firebase/auth"
import { auth } from "@/lib/firebase-config"
import { useRouter } from 'next/navigation'
import { apiClient } from "@/lib/api-client"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const handleRedirectResult = async () => {
      if (!auth) return

      try {
        const result = await getRedirectResult(auth)
        if (result && result.user) {
          console.log("[v0] Google redirect successful")
          const idToken = await result.user.getIdToken()
          
          await apiClient.customerAuth.signup(idToken)
          
          await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          })

          toast({
            title: "Welcome back!",
            description: "You've successfully signed in with Google.",
            variant: "default",
          })

          try {
            const userData = await apiClient.customerAuth.me()
            if (!userData.onboarded) {
              router.push("/onboarding")
            }
          } catch {
            router.push("/onboarding")
          }

          onOpenChange(false)
        }
      } catch (err: any) {
        console.error("[v0] Google redirect error:", err)
        if (err.code !== 'auth/popup-closed-by-user') {
          const errorMessage = err.message || "Google sign-in failed. Please try again."
          setError(errorMessage)
          toast({
            title: "Sign-in failed",
            description: errorMessage,
            variant: "destructive",
          })
        }
      }
    }

    handleRedirectResult()
  }, [router, onOpenChange, toast])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth) {
      const errorMsg = "Firebase is not initialized"
      setError(errorMsg)
      toast({
        title: "Initialization error",
        description: errorMsg,
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setError("")

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          const errorMsg = "Passwords do not match"
          setError(errorMsg)
          toast({
            title: "Validation error",
            description: errorMsg,
            variant: "destructive",
          })
          setLoading(false)
          return
        }
        
        const result = await createUserWithEmailAndPassword(auth, email, password)
        const idToken = await result.user.getIdToken()
        
        await apiClient.customerAuth.signup(idToken)
        
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        })
        
        toast({
          title: "Account created!",
          description: "Welcome! Let's complete your profile.",
          variant: "default",
        })
        
        router.push("/onboarding")
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password)
        const idToken = await result.user.getIdToken()
        
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        })

        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
          variant: "default",
        })
      }

      // Success - close modal and reset form
      onOpenChange(false)
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setError("")
    } catch (err: any) {
      console.error("[v0] Auth error:", err)
      
      let errorMessage = "Authentication failed. Please try again."
      
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password. Please try again."
      } else if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email."
      } else if (err.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists."
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters."
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address."
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Please try again later."
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      
      toast({
        title: mode === "signup" ? "Sign-up failed" : "Sign-in failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (!auth) {
      const errorMsg = "Firebase is not initialized"
      setError(errorMsg)
      toast({
        title: "Initialization error",
        description: errorMsg,
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setError("")

    try {
      const provider = new GoogleAuthProvider()
      await signInWithRedirect(auth, provider)
      // Note: Success will be handled in the redirect result handler
    } catch (err: any) {
      console.error("[v0] Google sign-in error:", err)
      const errorMessage = err.message || "Google sign-in failed. Please try again."
      setError(errorMessage)
      toast({
        title: "Google sign-in failed",
        description: errorMessage,
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin")
    setError("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md z-[100]">
        <DialogHeader>
          <DialogTitle>{mode === "signin" ? "Sign In" : "Create Account"}</DialogTitle>
          <DialogDescription>
            {mode === "signin" ? "Sign in to your account to continue" : "Create a new account to get started"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "signin" ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {mode === "signin" ? "Sign In with Email" : "Sign Up with Email"}
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {mode === "signin" ? "Sign in with Google" : "Sign up with Google"}
          </Button>

          <div className="text-center text-sm">
            {mode === "signin" ? (
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary hover:underline font-medium"
                  disabled={loading}
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary hover:underline font-medium"
                  disabled={loading}
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
