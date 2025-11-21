import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CheckCircle2, Upload, DollarSign, Package, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HowItWorksPage() {
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
          <Button variant="ghost" asChild>
            <Link href="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex items-center justify-center">
        <main className="flex items-center container py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight">How KasiKollekt Works</h1>
            <p className="mt-4 text-lg text-muted-foreground text-pretty leading-relaxed">
              We've built the simplest way for local brands to sell custom t-shirts online. No inventory, no printing
              hassles, no shipping headaches.
            </p>
          </div>

          <div className="flex space-y-8 mb-12 flex-col items-stretch">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xl">
                    1
                  </div>
                  <div className="flex-1">
                    <CardTitle>Apply & Get Approved</CardTitle>
                    <CardDescription className="mt-2">
                      Submit your brand application with your design portfolio. We review within 48 hours and approve
                      brands that align with our quality standards and local culture focus.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xl">
                    2
                  </div>
                  <div className="flex-1">
                    <CardTitle>Upload Your Designs</CardTitle>
                    <CardDescription className="mt-2">
                      Access your brand dashboard and upload your t-shirt designs. We support PNG, SVG, and JPG files.
                      Our system automatically generates product mockups for the marketplace.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xl">
                    3
                  </div>
                  <div className="flex-1">
                    <CardTitle>Set Your Pricing</CardTitle>
                    <CardDescription className="mt-2">
                      Choose your retail price. We handle base costs (blank tee + printing + shipping). You earn a
                      commission on every sale based on your tier: Bronze (10%), Silver (15%), or Gold (20%).
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xl">
                    4
                  </div>
                  <div className="flex-1">
                    <CardTitle>We Handle Everything Else</CardTitle>
                    <CardDescription className="mt-2">
                      When a customer orders your design, we print it on-demand using DTF (Direct-to-Film) technology,
                      perform quality checks, package it, and ship it directly to the customer. You don't touch
                      inventory.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xl">
                    5
                  </div>
                  <div className="flex-1">
                    <CardTitle>Get Paid Monthly</CardTitle>
                    <CardDescription className="mt-2">
                      Track your sales and commissions in real-time through your dashboard. We process payouts monthly
                      via EFT to your registered business account. No hidden fees, no surprises.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <div className="flex mb-12 items-stretch flex-col">
            <h2 className="text-2xl font-bold mb-6">What We Provide</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <Upload className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Brand Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Upload and manage designs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Set pricing and manage catalogue</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Track sales and order status</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>View analytics and insights</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Package className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Full Fulfillment</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>DTF printing on premium tees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Quality control checks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Professional packaging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Nationwide shipping</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <DollarSign className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Transparent Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>No upfront costs or monthly fees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Tiered commission structure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Monthly EFT payouts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Real-time earnings tracking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Growth Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Marketplace visibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Featured brand opportunities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Design assistance available</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Custom branded stores (Gold tier)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex rounded-lg bg-primary/5 border border-primary/20 p-8 text-center flex-col items-stretch">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Selling?</h2>
            <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">
              Join hundreds of local brands already selling on KasiKollekt. No risk, no inventory, just pure creativity
              and earnings.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/brands/apply" className="gap-2">
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/brands/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
        </main>
      </div>
    </div>
  )
}
