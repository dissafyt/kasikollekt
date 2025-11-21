"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { MarketplaceHeader } from "@/components/marketplace-header"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

export default function CheckoutPage() {
  const { user, authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  async function handleCheckout() {
    setLoading(true)
    setError("")
    try {
      const result = await apiClient.checkout.process()

      if (result.payment_url) {
        // Redirect to payment provider
        window.location.href = result.payment_url
      } else {
        router.push(`/orders/${result.order_id}`)
        toast({
          title: "Order Created",
          description: "Your order has been created successfully",
        })
      }
    } catch (err: any) {
      console.error("[v0] Checkout error:", err)
      setError(err.message || "Failed to process checkout")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen">
        <MarketplaceHeader />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <div className="container max-w-2xl py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Checkout</h1>
          <p className="mt-2 text-lg text-muted-foreground">Complete your order</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
            <CardDescription>You will be redirected to our secure payment provider</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleCheckout} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Proceed to Payment
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
