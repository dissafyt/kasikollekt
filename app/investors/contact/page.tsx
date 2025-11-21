"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Phone, MapPin, Loader2, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiClient } from "@/lib/api-client"

export default function InvestorContactPage() {
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
      phone_number: formData.get("phone") as string,
      organization: (formData.get("organization") as string) || undefined,
      investment_range: (formData.get("investmentRange") as string) || undefined,
      message: (formData.get("message") as string) || undefined,
      nda_accepted: formData.get("nda") === "on",
    }

    try {
      const response = await apiClient.submitInvestor(submissionData)
      console.log("[KasiKollekt-API] Investor inquiry submitted:", response)

      if (response.success || response.id) {
        setSuccess(true)
        e.currentTarget.reset()
      } else {
        setError(response.error || "Failed to submit inquiry. Please try again.")
      }
    } catch (err) {
      console.error("[KasiKollekt-API] Investor inquiry error:", err)
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
          <Button variant="ghost" size="sm" asChild>
            <Link href="/investors/overview" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Overview
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex items-center border-b bg-secondary py-16 md:py-24 justify-center">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-secondary-foreground md:text-5xl text-balance">
              Let's Build the Future Together
            </h1>
            <p className="mt-6 text-lg text-secondary-foreground/80 text-pretty leading-relaxed">
              Interested in investing in KasiKollekt? We'd love to hear from you. Schedule a meeting with our team to
              discuss investment opportunities and learn more about our vision.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="flex items-center py-12 md:py-16 justify-center">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Contact Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Reach out to our investor relations team to schedule a meeting or request additional information.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Email</p>
                      <a
                        href="mailto:investors@kasikollekt.com"
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        investors@kasikollekt.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Phone</p>
                      <a href="tel:+27123456789" className="text-sm text-muted-foreground hover:text-primary">
                        +27 12 345 6789
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-sm text-muted-foreground">Johannesburg, South Africa</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Response Time:</strong> We typically respond to investor
                    inquiries within 24-48 hours.
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="rounded-lg border bg-card p-6 md:p-8">
                  <h3 className="text-xl font-bold mb-6">Send Us a Message</h3>

                  {success && (
                    <Alert className="mb-6 border-green-500 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Thank you for your inquiry! We'll get back to you within 24-48 hours.
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
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" name="firstName" placeholder="John" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" name="lastName" placeholder="Doe" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+27 12 345 6789" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Input id="organization" name="organization" placeholder="Investment Firm Name" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="investmentRange">Investment Range</Label>
                      <select
                        id="investmentRange"
                        name="investmentRange"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a range</option>
                        <option value="under-500k">Under R500K</option>
                        <option value="500k-1m">R500K - R1M</option>
                        <option value="1m-5m">R1M - R5M</option>
                        <option value="5m-plus">R5M+</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about your investment interests and any questions you have..."
                        rows={5}
                        required
                      />
                    </div>

                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="nda"
                        name="nda"
                        className="mt-1 h-4 w-4 rounded border-input"
                        required
                      />
                      <Label htmlFor="nda" className="text-sm font-normal leading-relaxed">
                        I agree to sign a Non-Disclosure Agreement (NDA) before receiving confidential information *
                      </Label>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Inquiry"
                      )}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      All inquiries are treated with strict confidentiality
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex items-center border-t py-8 justify-center">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2025 KasiKollekt. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
