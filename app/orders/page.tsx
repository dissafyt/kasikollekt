"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, Eye } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { MarketplaceHeader } from "@/components/marketplace-header"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { formatDistanceToNow } from "date-fns"

interface Order {
  order_id: string
  total_amount: number
  status: string
  payment_status?: string
  created_at: string
  items: any[]
}

export default function OrdersPage() {
  const { user, authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!authLoading && user) {
      fetchOrders()
    } else if (!authLoading && !user) {
      setLoading(false)
    }
  }, [user, authLoading])

  async function fetchOrders() {
    try {
      const data = await apiClient.orders.list()
      setOrders(data)
    } catch (err: any) {
      console.error("[v0] Error fetching orders:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to load orders",
      })
    } finally {
      setLoading(false)
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "pending":
      case "awaiting_payment":
        return "warning"
      case "processing":
      case "pending_verification":
        return "default"
      case "completed":
        return "success"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  if (!user && !authLoading) {
    return (
      <div className="min-h-screen">
        <MarketplaceHeader />
        <div className="container flex items-center justify-center py-12">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>Please sign in to view your orders</CardDescription>
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
          <h1 className="text-4xl font-bold tracking-tight">My Orders</h1>
          <p className="mt-2 text-lg text-muted-foreground">Track and manage your orders</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
              <Button onClick={() => router.push("/products")}>Browse Products</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.order_id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.order_id.slice(0, 8)}</CardTitle>
                      <CardDescription>
                        {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusColor(order.status) as any}>{order.status.replace(/_/g, " ")}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{order.items.length} item(s)</p>
                      <p className="text-lg font-semibold">R{order.total_amount.toFixed(2)}</p>
                    </div>
                    <Button variant="outline" onClick={() => router.push(`/orders/${order.order_id}`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
