"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle2, Upload, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiClient } from "@/lib/api-client"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/lib/auth-context"

export default function BrandApplyPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user } = useAuth()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    const submissionData = {
      brand_name: formData.get("brandName") as string,
      contact_name: formData.get("contactName") as string,
      email: formData.get("email") as string,
      phone_number: formData.get("phone") as string,
      website: (formData.get("website") as string) || undefined,
      brand_description: formData.get("description") as string,
      num_designs_ready: Number.parseInt(formData.get("designs") as string) || 0,
      registration_number: (formData.get("businessReg") as string) || undefined,
      referral_source: (formData.get("referral") as string) || undefined,
    }

    try {
      const response = await apiClient.submitBrand(submissionData)
      console.log("[KasiKollekt-API] Brand application submitted:", response)

      if (response.success || response.id) {
        setSuccess(true)
        e.currentTarget.reset()
      } else {
        setError(response.error || "Failed to submit application. Please try again.")
      }
    } catch (err) {
      console.error("[KasiKollekt-API] Brand application error:", err)
      setError("An error occurred. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center border-b justify-center">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">KK</span>
            </div>
            <span className="text-lg font-bold">KasiKollekt</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />

      <div className="flex items-center justify-center">
        <main className="flex container py-12 flex-col items-stretch justify-center gap-0">
          <div className="flex mx-auto max-w-4xl flex-col items-stretch">
            <div className="flex mb-8 flex-col items-stretch">
              <h1 className="text-4xl font-bold tracking-tight">Apply as a Brand Partner</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Join South Africa's fastest-growing print-on-demand platform for local brands
              </p>
            </div>

            <div className="mb-12 grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CheckCircle2 className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">No Upfront Costs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Zero inventory risk. We only print when customers order.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CheckCircle2 className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Full Fulfillment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We handle printing, quality control, packaging, and shipping.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CheckCircle2 className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Earn Commissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Earn 10-20% commission on every sale. Higher tiers unlock better rates.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Brand Application Form</CardTitle>
                <CardDescription>Tell us about your brand and we'll get back to you within 48 hours</CardDescription>
              </CardHeader>
              <CardContent>
                {success && (
                  <Alert className="mb-6 border-green-500 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Application submitted successfully! We'll review it and get back to you within 48 hours.
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert className="mb-6 border-red-500 bg-red-50">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="brandName">Brand Name *</Label>
                      <Input id="brandName" name="brandName" placeholder="Urban Roots" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name *</Label>
                      <Input id="contactName" name="contactName" placeholder="John Doe" required />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" name="email" type="email" placeholder="hello@urbanroots.co.za" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+27 XX XXX XXXX" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website / Social Media</Label>
                    <Input id="website" name="website" placeholder="https://instagram.com/urbanroots" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Brand Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Tell us about your brand, your design style, and what makes you unique..."
                      rows={5}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="designs">Number of Designs Ready</Label>
                    <Input id="designs" name="designs" type="number" placeholder="5" min="0" />
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Brand Logo (Optional)</Label>
                    <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-8 hover:border-primary transition-colors cursor-pointer">
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessReg">Business Registration Number (Optional)</Label>
                    <Input id="businessReg" name="businessReg" placeholder="2024/123456/07" />
                    <p className="text-xs text-muted-foreground">
                      Required for payouts. Can be provided later during onboarding.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referral">How did you hear about us?</Label>
                    <Input id="referral" name="referral" placeholder="Social media, friend, Google search..." />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" size="lg" className="flex-1" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                    <Button type="button" variant="outline" size="lg" asChild>
                      <Link href="/brands/how-it-works">Learn More First</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="flex mt-8 rounded-lg bg-muted p-6 flex-col items-stretch">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>We review your application within 48 hours</li>
                <li>If approved, you'll receive onboarding instructions via email</li>
                <li>Upload your designs and set your pricing</li>
                <li>We review and approve your designs (usually within 24 hours)</li>
                <li>Your products go live on the marketplace</li>
                <li>Start earning commissions on every sale</li>
              </ol>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
