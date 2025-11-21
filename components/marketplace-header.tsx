"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, LogOut, UserCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"
import { AuthModal } from "./auth-modal"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase-config"
import { useRouter } from 'next/navigation'
import { ExpandingSearch } from "@/components/ExpandingSearch"
import { apiClient } from "@/lib/api-client"

export function MarketplaceHeader() {
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const router = useRouter()
  const [showUserLabel, setShowUserLabel] = useState(false)
  const [showCartLabel, setShowCartLabel] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [cartLoading, setCartLoading] = useState(false)

  useEffect(() => {
    if (user) {
      checkOnboardingStatus()
      fetchCartCount()
    }
  }, [user])

  useEffect(() => {
    const handleCartUpdate = () => {
      if (user) {
        fetchCartCount()
      }
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => window.removeEventListener("cartUpdated", handleCartUpdate)
  }, [user])

  async function checkOnboardingStatus() {
    try {
      if (!user) return

      await apiClient.onboarding.getStatus()
    } catch (error: any) {
      console.error("Error checking onboarding status:", error)
      // If 404, user hasn't completed onboarding
      if (error.message?.includes("404") || error.message?.includes("not found")) {
        router.push("/onboarding")
      }
    }
  }

  async function fetchCartCount() {
    if (!user) return

    try {
      setCartLoading(true)
      const cart = await apiClient.cart.get()
      const itemCount = cart.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0
      setCartCount(itemCount)
    } catch (error) {
      console.error("Error fetching cart:", error)
      setCartCount(0)
    } finally {
      setCartLoading(false)
    }
  }

  async function handleSignOut() {
    try {
      if (auth) {
        await signOut(auth)
      }
      
      await fetch("/api/auth/session", {
        method: "DELETE",
      })
      
      setCartCount(0)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <>
      <header className="flex items-center sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 justify-center">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary px-1.0 py-1.0 mx-1.0 my-1.0">
              <span className="text-lg font-bold text-primary-foreground px-0.5">KK</span>
            </div>
            <span className="text-xl font-bold">KasiKollekt</span>
          </Link>

          <div className="flex flex-1 items-center gap-4 md:gap-6 max-w-xl"></div>

          <nav className="flex items-center gap-2 ml-[]">
            <ExpandingSearch />

            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowUserLabel(true)}
              onMouseLeave={() => setShowUserLabel(false)}
            >
              {/* Label that expands to the left */}
              <div
                className={`absolute right-10 transition-all duration-300 ease-in-out overflow-hidden ${
                  showUserLabel ? "w-auto opacity-100" : "w-0 opacity-0"
                }`}
              >
                <div className="whitespace-nowrap text-sm text-muted-foreground pr-2">
                  {loading ? "..." : user ? "Account" : "Login"}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {!loading && !user && (
                    <DropdownMenuItem onClick={() => setShowAuthModal(true)}>
                      <UserCircle className="mr-2 h-4 w-4" />
                      Sign In
                    </DropdownMenuItem>
                  )}
                  {!loading && user && (
                    <>
                      <div className="px-2 py-1.5 text-sm font-medium">{user.email}</div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <UserCircle className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders">
                          <UserCircle className="mr-2 h-4 w-4" />
                          Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowCartLabel(true)}
              onMouseLeave={() => setShowCartLabel(false)}
            >
              <div
                className={`absolute right-10 transition-all duration-300 ease-in-out overflow-hidden ${
                  showCartLabel ? "w-auto opacity-100" : "w-0 opacity-0"
                }`}
              >
                <div className="whitespace-nowrap text-sm text-muted-foreground pr-2">
                  {cartLoading
                    ? "Loading..."
                    : cartCount > 0
                      ? `${cartCount} item${cartCount > 1 ? "s" : ""}`
                      : "Cart is empty"}
                </div>
              </div>

              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hidden trigger for Google sign-up from homepage hero */}
      <button id="google-signup-trigger" onClick={() => setShowAuthModal(true)} className="hidden" aria-hidden="true" />

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  )
}
