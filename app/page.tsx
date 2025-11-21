"use client"

import Link from "next/link"
import { MarketplaceHeader } from "@/components/marketplace-header"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { exampleProducts } from "@/lib/example-data"

export default function HomePage() {
  const featuredProducts = exampleProducts.filter((p) => p.featured)

  return (
    <div className="min-h-screen">
      <MarketplaceHeader />

      <main>
        {/* Hero Section */}
        <section className="flex items-center relative overflow-hidden bg-secondary py-20 md:py-32">
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-secondary-foreground md:text-6xl text-balance text-left">
                Kasi Kollektiv Luxury.
                <br />
                <span className="text-primary">Support Local Brands.</span>
              </h1>
              <p className="mt-6 text-lg text-secondary-foreground/80 text-pretty leading-relaxed text-left">
                Discover unique t-shirt 1/100 produced items brands. Get your hands on your taste today!
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-left justify-start">
                <Button size="lg" className="gap-2" asChild>
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-background/10 border-secondary-foreground/20 text-secondary-foreground hover:bg-background/20 gap-2"
                  onClick={() => {
                    const signUpBtn = document.getElementById("google-signup-trigger")
                    if (signUpBtn) signUpBtn.click()
                  }}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign Up with Google
                </Button>
              </div>
            </div>
          </div>
          <div className="flex absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] justify-start flex-col items-center" />
        </section>

        {/* Featured Products */}
        <section className="flex items-center py-12 md:py-16 justify-center">
          <div className="container">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Featured Designs</h2>
                <p className="mt-2 text-muted-foreground">Fresh drops from local brands</p>
              </div>
              <Button variant="ghost" className="gap-2" asChild>
                <Link href="/products">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        {/* Brand Spotlight */}
        <section className="flex items-center border-t bg-muted/30 py-12 md:py-16 justify-center">
          <div className="container">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight">Featured Brands</h2>
              <p className="mt-2 text-muted-foreground">Supporting local creativity, one design at a time</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {["Urban Roots", "Local Legends", "Sound Culture", "Kasi Sports"].map((brand) => (
                <div
                  key={brand}
                  className="flex flex-col items-center justify-center rounded-lg border bg-card p-8 transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-2xl font-bold text-primary">{brand.charAt(0)}</span>
                  </div>
                  <h3 className="font-semibold">{brand}</h3>
                  <p className="mt-1 text-sm text-muted-foreground text-center">
                    {Math.floor(Math.random() * 20) + 5} designs
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="flex items-center border-t py-16 md:py-24 text-center justify-center">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">
                Got a brand? Join KasiKollekt
              </h2>
              <p className="mt-4 text-lg text-muted-foreground text-pretty leading-relaxed">
                We handle printing, fulfillment, and delivery. You focus on creating amazing designs. Start selling your
                brand today.
              </p>
              <Button size="lg" className="mt-8 gap-2" asChild>
                <Link href="/brands/apply">
                  Apply as a Brand
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex items-center border-t bg-secondary py-12 text-secondary-foreground mx-0 px-12 justify-center">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-sm font-bold text-primary-foreground">KK</span>
                </div>
                <span className="text-lg font-bold">KasiKollekt</span>
              </div>
              <p className="text-sm text-secondary-foreground/70">Exclusive access to Kollektiv of Kasi Brands. </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Shop</h4>
              <ul className="space-y-2 text-sm text-secondary-foreground/70">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/category/8Nk5dD0M0Nrvp5KNu2oV" className="hover:text-primary transition-colors">
                    Tops
                  </Link>
                </li>
                <li>
                  <Link href="/category/T4QCOewP0qkCu6GufvSm" className="hover:text-primary transition-colors">
                    Bottoms
                  </Link>
                </li>
                <li>
                  <Link href="/category/RoNzXZflcsncIZoFL6kc" className="hover:text-primary transition-colors">
                    Shoes
                  </Link>
                </li>
                <li>
                  <Link href="/category/1EIWrqLox1AsVKYLwUjt" className="hover:text-primary transition-colors">
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">For Brands</h4>
              <ul className="space-y-2 text-sm text-secondary-foreground/70">
                <li>
                  <Link href="/brands/apply" className="hover:text-primary transition-colors">
                    Apply Now
                  </Link>
                </li>
                <li>
                  <Link href="/brands/how-it-works" className="hover:text-primary transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/brands/pricing" className="hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">For Partners</h4>
              <ul className="space-y-2 text-sm text-secondary-foreground/70">
                <li>
                  <Link href="/partners/program" className="hover:text-primary transition-colors">
                    Partner Program
                  </Link>
                </li>
                <li>
                  <Link href="/partners/affiliates" className="hover:text-primary transition-colors">
                    Affiliates
                  </Link>
                </li>
                <li>
                  <Link href="/partners/wholesale" className="hover:text-primary transition-colors">
                    Wholesale
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">For Investors</h4>
              <ul className="space-y-2 text-sm text-secondary-foreground/70">
                <li>
                  <Link href="/investors/overview" className="hover:text-primary transition-colors">
                    Overview
                  </Link>
                </li>
                <li>
                  <Link href="/investors/pitch-deck" className="hover:text-primary transition-colors">
                    Pitch Deck
                  </Link>
                </li>
                <li>
                  <Link href="/investors/contact" className="hover:text-primary transition-colors">
                    Get in Touch
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Support</h4>
              <ul className="space-y-2 text-sm text-secondary-foreground/70">
                <li>
                  <Link href="/terms" className="hover:text-primary transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-returns" className="hover:text-primary transition-colors">
                    Shipping & Returns
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-secondary-foreground/10 pt-8 text-center text-sm text-secondary-foreground/70">
            <p>&copy; 2025 KasiKollekt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
