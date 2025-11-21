import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Users, Globe, Zap } from "lucide-react"

export default function InvestorOverviewPage() {
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
              Invest in the Future of <span className="text-primary">African Streetwear</span>
            </h1>
            <p className="mt-6 text-lg text-secondary-foreground/80 text-pretty leading-relaxed">
              KasiKollekt is revolutionizing how local South African brands reach customers through our print-on-demand
              marketplace platform. Join us in empowering local creativity and building the next generation of African
              fashion commerce.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/investors/contact">Get in Touch</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/investors/pitch-deck">View Pitch Deck</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="flex items-center py-12 md:py-16 justify-center">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">R2.5M</p>
                  <p className="text-sm text-muted-foreground">Target Year 1 GMV</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-sm text-muted-foreground">Brand Partners</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">10K+</p>
                  <p className="text-sm text-muted-foreground">Active Customers</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">15-20%</p>
                  <p className="text-sm text-muted-foreground">Platform Commission</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model */}
      <section className="flex items-center border-t bg-muted/30 py-12 md:py-16 justify-center">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Our Business Model</h2>
            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-xl font-semibold mb-3">B2B-B2C Marketplace</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We connect local brands with customers through our curated marketplace. Brands upload designs, we
                  handle printing, fulfillment, and delivery. Zero inventory risk for brands, seamless experience for
                  customers.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-xl font-semibold mb-3">Multiple Revenue Streams</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Product markup on every sale (30-40% margin)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Platform commission from brand sales (10-20% tiered)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Design services for brands without in-house designers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Custom branded storefronts (premium feature)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Bulk order fulfillment for wholesale clients</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-xl font-semibold mb-3">Scalable Technology</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Built on modern cloud infrastructure with automated print job management, real-time inventory
                  tracking, and seamless payment processing. Our platform is designed to scale from 50 to 500+ brands
                  without significant infrastructure changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="flex items-center border-t py-12 md:py-16 justify-center">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Market Opportunity</h2>
            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-xl font-semibold mb-3">Growing African Fashion Market</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The African fashion and apparel market is projected to reach $15.5 billion by 2025, with South Africa
                  leading the way. Young consumers are increasingly seeking authentic, locally-made products that
                  celebrate African culture and creativity.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-xl font-semibold mb-3">Underserved Local Brands</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Thousands of talented local brands struggle with distribution, inventory management, and fulfillment.
                  KasiKollekt removes these barriers, allowing brands to focus on design while we handle operations.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-xl font-semibold mb-3">Print-on-Demand Advantage</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Zero inventory risk, rapid product testing, and sustainable production. Our model eliminates waste and
                  allows brands to experiment with designs without upfront manufacturing costs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Opportunity */}
      <section className="flex items-center border-t bg-secondary py-12 md:py-16 justify-center">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-secondary-foreground mb-4">Investment Opportunity</h2>
            <p className="text-lg text-secondary-foreground/80 text-pretty leading-relaxed mb-8">
              We're seeking strategic investors to help us scale operations, expand our brand network, and enhance our
              technology platform. Join us in building the future of African fashion commerce.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/investors/contact">Schedule a Meeting</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-background/10 border-secondary-foreground/20 text-secondary-foreground hover:bg-background/20"
              >
                <Link href="/investors/pitch-deck">Download Pitch Deck</Link>
              </Button>
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
