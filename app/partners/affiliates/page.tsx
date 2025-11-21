"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, DollarSign, Link2, BarChart3, Gift, Loader2, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiClient } from "@/lib/api-client"

export default function AffiliatesPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    const submissionData = {
      first_name: formData.get("firstName") as string,
      last_name: formData.get("lastName") as string,
      email: formData.get("email") as string,
      website_url: formData.get("website") as string,
      audience_size: formData.get("audience") as string,
      promotion_methods: formData.get("promotion") as string,
    }

    try {
      const response = await apiClient.submitAffiliate(submissionData)
      console.log("[KasiKollekt-API] Affiliate application submitted:", response)

      if (response.success || response.id) {
        setSuccess(true)
        e.currentTarget.reset()
      } else {
        setError(response.error || "Failed to submit application. Please try again.")
      }
    } catch (err) {
      console.error("[KasiKollekt-API] Affiliate application error:", err)
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
              Affiliate Program
            </h1>
            <p className="mt-4 text-lg text-secondary-foreground/80 text-pretty leading-relaxed">
              Earn commission by promoting KasiKollekt. Share unique designs from local brands and get rewarded for
              every sale you generate.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex items-center py-12 md:py-16 justify-center">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            {/* How It Works */}
            <div className="mb-12">
              <h2 className="mb-8 text-3xl font-bold tracking-tight">How It Works</h2>
              <div className="grid gap-6 md:grid-cols-4">
                <Card>
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-xl font-bold text-primary">1</span>
                    </div>
                    <CardTitle className="text-lg">Sign Up</CardTitle>
                    <CardDescription>Join our affiliate program for free in minutes</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-xl font-bold text-primary">2</span>
                    </div>
                    <CardTitle className="text-lg">Get Your Link</CardTitle>
                    <CardDescription>Receive your unique affiliate tracking link</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-xl font-bold text-primary">3</span>
                    </div>
                    <CardTitle className="text-lg">Promote</CardTitle>
                    <CardDescription>Share products on your platform or social media</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-xl font-bold text-primary">4</span>
                    </div>
                    <CardTitle className="text-lg">Earn</CardTitle>
                    <CardDescription>Get paid commission on every sale you refer</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Benefits */}
            <div className="flex mb-12 flex-col items-stretch">
              <h2 className="mb-8 text-3xl font-bold tracking-tight">Affiliate Benefits</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <DollarSign className="mb-2 h-8 w-8 text-primary" />
                    <CardTitle>Competitive Commission</CardTitle>
                    <CardDescription>Earn 10-15% commission on every sale you generate</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <Link2 className="mb-2 h-8 w-8 text-primary" />
                    <CardTitle>Custom Links</CardTitle>
                    <CardDescription>Get unique tracking links for products, brands, or categories</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <BarChart3 className="mb-2 h-8 w-8 text-primary" />
                    <CardTitle>Real-Time Analytics</CardTitle>
                    <CardDescription>Track clicks, conversions, and earnings in your dashboard</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <Gift className="mb-2 h-8 w-8 text-primary" />
                    <CardTitle>Marketing Materials</CardTitle>
                    <CardDescription>Access banners, product images, and promotional content</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Commission Structure */}
            <div className="flex mb-12 flex-col items-stretch">
              <h2 className="mb-8 text-3xl font-bold tracking-tight">Commission Structure</h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Bronze Tier</CardTitle>
                        <CardDescription>0-50 sales per month</CardDescription>
                      </div>
                      <div className="text-2xl font-bold text-primary">10%</div>
                    </div>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Silver Tier</CardTitle>
                        <CardDescription>51-150 sales per month</CardDescription>
                      </div>
                      <div className="text-2xl font-bold text-primary">12%</div>
                    </div>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Gold Tier</CardTitle>
                        <CardDescription>151+ sales per month</CardDescription>
                      </div>
                      <div className="text-2xl font-bold text-primary">15%</div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Application Form */}
            <Card>
              <CardHeader>
                <CardTitle>Apply to Become an Affiliate</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 2 business days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {success && (
                  <Alert className="mb-6 border-green-500 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Application submitted successfully! We'll review it and contact you within 2 business days.
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
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" placeholder="Doe" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website/Social Media URL</Label>
                    <Input id="website" name="website" type="url" placeholder="https://yourwebsite.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audience">Tell us about your audience</Label>
                    <Textarea
                      id="audience"
                      name="audience"
                      placeholder="Describe your audience size, demographics, and engagement..."
                      rows={4}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="promotion">How will you promote KasiKollekt?</Label>
                    <Textarea
                      id="promotion"
                      name="promotion"
                      placeholder="Describe your promotional strategy..."
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
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
