"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import { useAuth } from "@/lib/auth-context"
import { MarketplaceHeader } from "@/components/marketplace-header"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import Image from "next/image"

interface CartItem {
  product_id: string
  title: string
  quantity: number
  price: number
  image_url?: string
}

export default function CartPage() {
  const { user, authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<CartItem[]>([])
  const [removing, setRemoving] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      fetchCart()
    } else if (!authLoading && !user) {
      setLoading(false)
    }
  }, [user, authLoading])

  async function fetchCart() {
    try {
      const data = await apiClient.cart.get()
      setItems(data)
    } catch (err: any) {
      console.error("[v0] Error fetching cart:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to load cart",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleRemove(productId: string) {
    setRemoving(productId)
    try {
      await apiClient.cart.remove(productId)
      setItems(items.filter((item) => item.product_id !== productId))
      window.dispatchEvent(new Event("cartUpdated"))
      toast({
        title: "Item Removed",
        description: "Item removed from cart",
      })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to remove item",
      })
    } finally {
      setRemoving(null)
    }
  }

  async function handleCheckout() {
    setSubmitting(true)
    try {
      await apiClient.cart.submit()
      router.push("/checkout")
      toast({
        title: "Proceeding to Checkout",
        description: "Your cart has been submitted",
      })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to proceed to checkout",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!user && !authLoading) {
    return (
      <div className="min-h-screen">
        <MarketplaceHeader />
        <div className="container flex items-center justify-center py-12">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>Please sign in to view your cart</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/")} className="w-full">
                Go to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <div className="container max-w-4xl py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Shopping Cart</h1>
          <p className="mt-2 text-lg text-muted-foreground">Review your items before checkout</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some items to get started</p>
              <Button onClick={() => router.push("/products")}>Browse Products</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.product_id} className="flex items-center gap-4 pb-4 border-b last:border-0">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted">
                      {item.image_url ? (
                        <Image
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      <p className="font-semibold mt-1">R{item.price.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(item.product_id)}
                      disabled={removing === item.product_id}
                    >
                      {removing === item.product_id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{total >= 500 ? "FREE" : "R60.00"}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>R{(total + (total >= 500 ? 0 : 60)).toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleCheckout} disabled={submitting} className="w-full" size="lg">
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
