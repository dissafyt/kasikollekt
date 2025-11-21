"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Package, TrendingDown, Truck, Clock, Loader2, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiClient } from "@/lib/api-client"

export default function WholesalePage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    const submissionData = {
      business_name: formData.get("businessName") as string,
      contact_name: formData.get("contactName") as string,
      email: formData.get("email") as string,
      phone_number: formData.get("phone") as string,
      business_type: formData.get("businessType") as string,
      estimated_order_volume: Number.parseInt(formData.get("quantity") as string) || 0,
      order_frequency: formData.get("frequency") as string,
      product_categories: formData.get("products") as string,
      message: (formData.get("message") as string) || undefined,
    }

    try {
      const response = await apiClient.submitWholesale(submissionData)
      console.log("[KasiKollekt-API] Wholesale request submitted:", response)

      if (response.success || response.id) {
        setSuccess(true)
        e.currentTarget.reset()
      } else {
        setError(response.error || "Failed to submit request. Please try again.")
      }
    } catch (err) {
      console.error("[KasiKollekt-API] Wholesale request error:", err)
      setError("An error occurred. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center border-b justify-center">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">KK</span>
            </div>
            <span className="text-lg font-bold">KasiKollekt</span>
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link href="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex items-center border-b bg-secondary py-16 md:py-24 justify-center">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-secondary-foreground md:text-5xl text-balance">
              Wholesale Program
            </h1>
            <p className="mt-4 text-lg text-secondary-foreground/80 text-pretty leading-relaxed">
              Stock your retail store or online shop with unique designs from South African brands. Get wholesale
              pricing on bulk orders of 50+ units.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex items-center py-12 md:py-16 justify-center">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            {/* Benefits */}
            <div className="mb-12">
              <h2 className="mb-8 text-3xl font-bold tracking-tight">Wholesale Benefits</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <TrendingDown className="mb-2 h-8 w-8 text-primary" />
                    <CardTitle>Bulk Pricing</CardTitle>
                    <CardDescription>Save 20-40% on orders of 50+ units with tiered volume discounts</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <Package className="mb-2 h-8 w-8 text-primary" />
                    <CardTitle>Exclusive Designs</CardTitle>
                    <CardDescription>
                      Access to unique designs from 100+ local brands not available elsewhere
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <Truck className="mb-2 h-8 w-8 text-primary" />
                    <CardTitle>Flexible Delivery</CardTitle>
                    <CardDescription>
                      Free shipping on orders over R5,000 with flexible delivery schedules
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <Clock className="mb-2 h-8 w-8 text-primary" />
                    <CardTitle>Fast Turnaround</CardTitle>
                    <CardDescription>Most wholesale orders fulfilled within 5-7 business days</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Pricing Tiers */}
            <div className="flex mb-12 flex-col items-stretch">
              <h2 className="mb-8 text-3xl font-bold tracking-tight">Volume Pricing</h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Starter</CardTitle>
                        <CardDescription>50-99 units per order</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">20% off</div>
                        <div className="text-sm text-muted-foreground">R239 per unit</div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Growth</CardTitle>
                        <CardDescription>100-249 units per order</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">30% off</div>
                        <div className="text-sm text-muted-foreground">R209 per unit</div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Enterprise</CardTitle>
                        <CardDescription>250+ units per order</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">40% off</div>
                        <div className="text-sm text-muted-foreground">R179 per unit</div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                * Pricing based on standard retail price of R299 per unit. Custom pricing available for orders of 500+
                units.
              </p>
            </div>

            {/* How It Works */}
            <div className="flex mb-12 flex-col items-stretch">
              <h2 className="mb-8 text-3xl font-bold tracking-tight">How Wholesale Works</h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="font-bold text-primary">1</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">Submit Your Request</CardTitle>
                        <CardDescription className="mt-1">
                          Fill out the wholesale inquiry form with your business details and order requirements
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="font-bold text-primary">2</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">Get a Custom Quote</CardTitle>
                        <CardDescription className="mt-1">
                          Our team will review your request and provide a detailed quote within 1-2 business days
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="font-bold text-primary">3</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">Place Your Order</CardTitle>
                        <CardDescription className="mt-1">
                          Approve the quote and place your order with flexible payment terms available
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="font-bold text-primary">4</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">Receive Your Products</CardTitle>
                        <CardDescription className="mt-1">
                          Your order is printed, quality checked, and delivered to your location
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Inquiry Form */}
            <Card>
              <CardHeader>
                <CardTitle>Request a Wholesale Quote</CardTitle>
                <CardDescription>
                  Tell us about your business and order requirements. We'll get back to you within 1-2 business days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {success && (
                  <Alert className="mb-6 border-green-500 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Quote request submitted! We'll send you a detailed quote within 1-2 business days.
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert className="mb-6 border-red-500 bg-red-50">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input id="businessName" name="businessName" placeholder="Your Store Name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name</Label>
                      <Input id="contactName" name="contactName" placeholder="John Doe" required />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" placeholder="john@yourstore.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+27 XX XXX XXXX" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Input
                      id="businessType"
                      name="businessType"
                      placeholder="e.g., Retail Store, Online Shop, Boutique"
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Estimated Order Quantity</Label>
                      <Input id="quantity" name="quantity" type="number" placeholder="50" min="50" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Order Frequency</Label>
                      <Input id="frequency" name="frequency" placeholder="e.g., Monthly, Quarterly" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="products">Product Interests</Label>
                    <Textarea
                      id="products"
                      name="products"
                      placeholder="Which categories or brands are you interested in? Any specific designs?"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Information</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your business and wholesale needs..."
                      rows={4}
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Request Quote"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
