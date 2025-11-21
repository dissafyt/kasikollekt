"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle2, Users, TrendingUp, Award, Handshake, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiClient } from "@/lib/api-client"

export default function PartnerProgramPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    const submissionData = {
      company_name: formData.get("companyName") as string,
      contact_name: formData.get("contactName") as string,
      email: formData.get("email") as string,
      phone_number: formData.get("phone") as string,
      partnership_type: formData.get("partnershipType") as string,
      company_description: formData.get("description") as string,
      partnership_proposal: formData.get("goals") as string,
    }

    try {
      const response = await apiClient.submitPartner(submissionData)
      console.log("[KasiKollekt-API] Partner application submitted:", response)

      if (response.success || response.id) {
        setSuccess(true)
        e.currentTarget.reset()
      } else {
        setError(response.error || "Failed to submit application. Please try again.")
      }
    } catch (err) {
      console.error("[KasiKollekt-API] Partner application error:", err)
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
              Partner Program
            </h1>
            <p className="mt-4 text-lg text-secondary-foreground/80 text-pretty leading-relaxed">
              Join forces with KasiKollekt to grow your business. Our partner program offers exclusive benefits,
              resources, and support to help you succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex items-center py-12 md:py-16 justify-center">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            {/* Benefits Grid */}
            <div className="mb-12">
              <h2 className="mb-8 text-3xl font-bold tracking-tight">Partner Benefits</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <Users className="mb-2 h-8 w-8 text-primary" />
                    <CardTitle>Access to Our Network</CardTitle>
                    <CardDescription>
                      Connect with 100+ local brands and thousands of customers across South Africa
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <TrendingUp className="mb-2 h-8 w-8 text-primary" />
                    <CardTitle>Revenue Sharing</CardTitle>
                    <CardDescription>
                      Earn competitive commissions on every sale generated through your partnership
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <Award className="mb-2 h-8 w-8 text-primary" />
                    <CardTitle>Marketing Support</CardTitle>
                    <CardDescription>
                      Get access to co-branded marketing materials, campaigns, and promotional resources
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <Handshake className="mb-2 h-8 w-8 text-primary" />
                    <CardTitle>Dedicated Support</CardTitle>
                    <CardDescription>
                      Work with a dedicated partner manager to help you maximize your success
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Partner Types */}
            <div className="flex mb-12 justify-center items-start flex-col">
              <h2 className="mb-8 text-3xl font-bold tracking-tight">Partnership Opportunities</h2>
              <div className="flex justify-center space-x-5">
                <Card>
                  <CardHeader>
                    <CardTitle>Technology Partners</CardTitle>
                    <CardDescription>
                      Integrate your platform or service with KasiKollekt to provide enhanced value to our brands and
                      customers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">API access and technical documentation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">Co-marketing opportunities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">Revenue sharing on integrated services</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribution Partners</CardTitle>
                    <CardDescription>
                      Help us reach new markets and customer segments through your distribution channels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">Exclusive territory rights</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">Bulk pricing and special terms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">Marketing and sales support</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Strategic Partners</CardTitle>
                    <CardDescription>
                      Collaborate on joint ventures, co-branded initiatives, and strategic growth opportunities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">Custom partnership agreements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">Joint product development</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">Shared resources and expertise</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Partnership Application Form */}
            <Card>
              <CardHeader>
                <CardTitle>Apply for Partnership</CardTitle>
                <CardDescription>
                  Tell us about your company and how you'd like to partner with KasiKollekt
                </CardDescription>
              </CardHeader>
              <CardContent>
                {success && (
                  <Alert className="mb-6 border-green-500 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Partnership application submitted! We'll review it and contact you within 3-5 business days.
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
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input id="companyName" name="companyName" placeholder="Your Company" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name *</Label>
                      <Input id="contactName" name="contactName" placeholder="John Doe" required />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" name="email" type="email" placeholder="john@company.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+27 XX XXX XXXX" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="partnershipType">Partnership Type *</Label>
                    <select
                      id="partnershipType"
                      name="partnershipType"
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select partnership type</option>
                      <option value="technology">Technology Partner</option>
                      <option value="distribution">Distribution Partner</option>
                      <option value="strategic">Strategic Partner</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Company Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Tell us about your company, what you do, and your market presence..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goals">Partnership Goals *</Label>
                    <Textarea
                      id="goals"
                      name="goals"
                      placeholder="What are you hoping to achieve through this partnership? How can we work together?"
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
