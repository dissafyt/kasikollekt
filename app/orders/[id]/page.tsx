"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { MarketplaceHeader } from "@/components/marketplace-header"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

interface OrderDetails {
  order_id: string
  total_amount: number
  status: string
  payment_status?: string
  created_at: string
  updated_at: string
  proof_of_payment_url?: string
  items: Array<{
    product_id: string
    title: string
    quantity: number
    price: number
  }>
}

export default function OrderDetailPage() {
  const { user, authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const orderId = params.id as string

  useEffect(() => {
    if (!authLoading && user && orderId) {
      fetchOrder()
    } else if (!authLoading && !user) {
      setLoading(false)
    }
  }, [user, authLoading, orderId])

  async function fetchOrder() {
    try {
      const data = await apiClient.orders.get(orderId)
      setOrder(data)
    } catch (err: any) {
      console.error("[v0] Error fetching order:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to load order",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleUploadProof() {
    if (!selectedFile) return

    setUploading(true)
    try {
      await apiClient.orders.uploadProof(orderId, selectedFile)
      toast({
        title: "Proof Uploaded",
        description: "Your proof of payment has been uploaded successfully",
      })
      setSelectedFile(null)
      fetchOrder()
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to upload proof",
      })
    } finally {
      setUploading(false)
    }
  }

  async function handleCancel() {
    setCancelling(true)
    try {
      await apiClient.orders.cancel(orderId)
      toast({
        title: "Order Cancelled",
        description: "Your order has been cancelled",
      })
      fetchOrder()
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to cancel order",
      })
    } finally {
      setCancelling(false)
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
              <CardDescription>Please sign in to view order details</CardDescription>
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
          <Button variant="ghost" onClick={() => router.push("/orders")} className="mb-4">
            ← Back to Orders
          </Button>
          <h1 className="text-4xl font-bold tracking-tight">Order Details</h1>
          <p className="mt-2 text-lg text-muted-foreground">Order #{orderId.slice(0, 8)}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !order ? (
          <Alert variant="destructive">
            <AlertDescription>Order not found</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Order Status</CardTitle>
                    <CardDescription>Created {new Date(order.created_at).toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge variant={order.status === "completed" ? "success" : "default"}>
                    {order.status.replace(/_/g, " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Status</span>
                    <span className="font-medium">{order.payment_status || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-semibold text-lg">R{order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0">
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">R{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {order.status === "awaiting_payment" && !order.proof_of_payment_url && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Proof of Payment</CardTitle>
                  <CardDescription>Upload your payment confirmation to verify your order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="flex-1"
                      disabled={uploading}
                    />
                    {selectedFile && (
                      <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Button onClick={handleUploadProof} disabled={!selectedFile || uploading} className="w-full">
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Proof
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {order.proof_of_payment_url && (
              <Card>
                <CardHeader>
                  <CardTitle>Proof of Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={order.proof_of_payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View uploaded proof
                  </a>
                </CardContent>
              </Card>
            )}

            {(order.status === "awaiting_payment" || order.status === "pending_verification") && (
              <Button variant="destructive" onClick={handleCancel} disabled={cancelling} className="w-full">
                {cancelling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Cancel Order
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
