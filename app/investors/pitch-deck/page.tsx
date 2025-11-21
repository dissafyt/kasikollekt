import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, FileText } from "lucide-react"

export default function PitchDeckPage() {
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
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                <FileText className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-secondary-foreground md:text-5xl text-balance">
              KasiKollekt Pitch Deck
            </h1>
            <p className="mt-6 text-lg text-secondary-foreground/80 text-pretty leading-relaxed">
              Download our comprehensive pitch deck to learn more about our business model, market opportunity,
              financial projections, and growth strategy.
            </p>
          </div>
        </div>
      </section>

      {/* Pitch Deck Content */}
      <section className="flex items-center py-12 md:py-16 justify-center">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-lg border bg-card p-8 md:p-12">
              <h2 className="text-2xl font-bold mb-6">What's Inside</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary mt-0.5">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Executive Summary</h3>
                    <p className="text-sm text-muted-foreground">
                      Overview of KasiKollekt's mission, vision, and value proposition
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary mt-0.5">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Problem & Solution</h3>
                    <p className="text-sm text-muted-foreground">
                      How we're solving distribution challenges for local brands
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary mt-0.5">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Market Opportunity</h3>
                    <p className="text-sm text-muted-foreground">
                      African fashion market size, growth trends, and target segments
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary mt-0.5">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold">Business Model</h3>
                    <p className="text-sm text-muted-foreground">
                      Revenue streams, pricing strategy, and unit economics
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary mt-0.5">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold">Technology Platform</h3>
                    <p className="text-sm text-muted-foreground">
                      Platform architecture, scalability, and competitive advantages
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary mt-0.5">
                    6
                  </div>
                  <div>
                    <h3 className="font-semibold">Go-to-Market Strategy</h3>
                    <p className="text-sm text-muted-foreground">
                      Brand acquisition, customer growth, and marketing channels
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary mt-0.5">
                    7
                  </div>
                  <div>
                    <h3 className="font-semibold">Financial Projections</h3>
                    <p className="text-sm text-muted-foreground">
                      3-year revenue forecast, profitability timeline, and key metrics
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary mt-0.5">
                    8
                  </div>
                  <div>
                    <h3 className="font-semibold">Team & Advisors</h3>
                    <p className="text-sm text-muted-foreground">
                      Founding team background, expertise, and strategic advisors
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary mt-0.5">
                    9
                  </div>
                  <div>
                    <h3 className="font-semibold">Investment Ask</h3>
                    <p className="text-sm text-muted-foreground">
                      Funding requirements, use of funds, and investor benefits
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-6 mb-8">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">Pitch Deck Details</p>
                    <p className="text-sm text-muted-foreground">Format: PDF | Size: 8.5 MB | Pages: 24</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button size="lg" className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Download Pitch Deck (PDF)
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  By downloading, you agree to keep this information confidential
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">Have questions about our pitch deck?</p>
              <Button variant="outline" asChild>
                <Link href="/investors/contact">Contact Our Team</Link>
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
