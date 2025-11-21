import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CheckCircle2, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function BrandPricingPage() {
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
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h1>
            <p className="mt-4 text-lg text-muted-foreground text-pretty leading-relaxed">
              No upfront costs. No monthly fees. You only pay when you sell. Earn more as you grow.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Bronze</Badge>
                  <div className="flex gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl">10% Commission</CardTitle>
                <CardDescription>Perfect for new brands getting started</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Requirements:</p>
                    <p className="text-sm text-muted-foreground">0 - 50 sales per month</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">What you get:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Brand dashboard access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Unlimited design uploads</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Full fulfillment service</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Monthly payouts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Sales analytics</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge>Silver</Badge>
                  <div className="flex gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl">15% Commission</CardTitle>
                <CardDescription>For growing brands with consistent sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Requirements:</p>
                    <p className="text-sm text-muted-foreground">51 - 200 sales per month</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Everything in Bronze, plus:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Priority design review</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Featured brand placement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Advanced analytics</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Bulk order discounts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Design assistance (1 free/month)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Gold
                  </Badge>
                  <div className="flex gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl">20% Commission</CardTitle>
                <CardDescription>For established brands with high volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Requirements:</p>
                    <p className="text-sm text-muted-foreground">200+ sales per month</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Everything in Silver, plus:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Custom branded store</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Dedicated account manager</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Priority fulfillment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Unlimited design assistance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Marketing support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex mb-12 flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 text-center">Pricing Example</h2>
            <Card>
              <CardHeader>
                <CardTitle>How Your Earnings Work</CardTitle>
                <CardDescription>
                  Here's a breakdown of how commissions are calculated on a typical R299 t-shirt sale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm">Retail Price (set by you)</span>
                    <span className="font-semibold">R299</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm text-muted-foreground">Platform Costs (blank tee + print + shipping)</span>
                    <span className="text-muted-foreground">-R180</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm">Gross Margin</span>
                    <span className="font-semibold">R119</span>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Your Commission (Bronze - 10%)</span>
                      <span className="font-semibold text-primary">R30</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Your Commission (Silver - 15%)</span>
                      <span className="font-semibold text-primary">R45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Your Commission (Gold - 20%)</span>
                      <span className="font-semibold text-primary">R60</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex mb-12 items-stretch flex-col">
            <h2 className="text-2xl font-bold mb-6 text-center">Additional Services</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Design Services</CardTitle>
                  <CardDescription>Need help bringing your ideas to life?</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our in-house designers can create custom designs for your brand. Pricing starts at R500 per design.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>2-3 concept variations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Unlimited revisions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Print-ready files</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Custom Branded Store</CardTitle>
                  <CardDescription>Get your own storefront on KasiKollekt</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Available for Gold tier brands. Get a custom URL, branded colors, and your own storefront within the
                    marketplace.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Custom URL (kasikollekt.com/yourbrand)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Brand colors and logo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Dedicated brand page</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex items-center rounded-lg bg-primary/5 border border-primary/20 p-8 text-center flex-col">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Earning?</h2>
            <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">
              Join KasiKollekt today and start selling with zero upfront costs. Your tier automatically upgrades as you
              grow.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/brands/apply" className="gap-2">
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/brands/how-it-works">Learn How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  )
}
